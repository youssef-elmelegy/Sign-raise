<template>
    <div class="video-player-container">
        <div v-if="!store.cameraActive && !videoUrl" class="empty-state">
            <p>No video selected</p>
        </div>

        <div class="video-wrapper" v-show="store.cameraActive || videoUrl">
            <!-- Camera Feed -->
            <video v-show="localStream" ref="cameraVideo" autoplay playsinline class="camera-feed"
                :style="{ transform: mirrorCamera ? 'scaleX(-1)' : 'none' }"></video>

            <!-- File Video Player -->
            <video v-show="videoUrl && !localStream" ref="videoElement" controls :src="videoUrl"
                @error="handleVideoError" @loadstart="isLoading = true" @canplay="isLoading = false" width="100%"
                height="auto"></video>

            <!-- Hand Pose Canvas Overlay -->
            <canvas ref="poseCanvas" class="pose-canvas"></canvas>

            <!-- Translation Overlay -->
            <div v-if="store.translatedText" class="translation-overlay">
                <div class="translation-text">{{ store.translatedText }}</div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="loading-overlay">
                <div class="spinner"></div>
                <p>Loading video...</p>
            </div>

            <!-- Error State -->
            <div v-if="error" class="error-overlay">
                <p>{{ error }}</p>
                <button @click="retryCamera" class="retry-button">
                    Retry Camera
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { usePlaygroundStore } from '@/stores/playgroundStore';

const props = defineProps({
    videoUrl: String
});


const store = usePlaygroundStore();
const cameraVideo = ref(null);
const poseCanvas = ref(null);
const isLoading = ref(false);
const error = ref(null);
const localStream = ref(null);
const handDetector = ref(null);
const animationFrame = ref(null);
const mirrorCamera = ref(true);

// TensorFlow.js initialization
const initializeDetector = async () => {
    try {
        if (typeof window !== 'undefined') {
            // Initialize Long library first
            window.Long = await import('long').then(m => m.default);

            const tf = await import('@tensorflow/tfjs');
            await tf.setBackend('webgl');

            const handPose = await import('@tensorflow-models/hand-pose-detection');
            handDetector.value = await handPose.HandPose.create({
                runtime: 'tfjs',
                maxHands: 2,
                modelType: 'full'
            });
        }
    } catch (err) {
        console.error('TF.js initialization failed:', err);
        error.value = 'Failed to initialize hand detection';
    }
};
// Lifecycle Hooks
onMounted(async () => {
    await initializeDetector();
    if (store.receiveVideo) startCamera();
});

onBeforeUnmount(() => {
    stopCamera();
    stopDetection();
});

// Watchers
watch(() => store.receiveVideo, async (newVal) => {
    if (newVal) await startCamera();
    else stopCamera();
});

watch(() => store.isTranslating, (newVal) => {
    if (newVal && handDetector.value) detectHands();
    else stopDetection();
});

// Camera Methods
const startCamera = async () => {
    try {
        isLoading.value = true;
        error.value = null;

        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
            audio: false
        });

        localStream.value = stream;

        if (cameraVideo.value) {
            cameraVideo.value.srcObject = stream;
            await new Promise(resolve => {
                if (cameraVideo.value) {
                    cameraVideo.value.onloadedmetadata = resolve;
                }
            });

            if (poseCanvas.value && cameraVideo.value) {
                poseCanvas.value.width = cameraVideo.value.videoWidth;
                poseCanvas.value.height = cameraVideo.value.videoHeight;
            }
        }

        store.setCameraActive(true);

    } catch (err) {
        handleCameraError(err);
    } finally {
        isLoading.value = false;
    }
};

const stopCamera = () => {
    if (localStream.value) {
        localStream.value.getTracks().forEach(track => {
            track.stop();
            track.enabled = false;
        });
        localStream.value = null;
    }
    if (cameraVideo.value) {
        cameraVideo.value.srcObject = null;
    }
    store.setCameraActive(false);
    stopDetection();
};

// Detection Methods
const detectHands = async () => {
    if (!store.isTranslating || !handDetector.value || !cameraVideo.value || !poseCanvas.value) return;

    try {
        const ctx = poseCanvas.value.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, poseCanvas.value.width, poseCanvas.value.height);
        const hands = await handDetector.value.estimateHands(cameraVideo.value);

        if (hands.length > 0) {
            drawLandmarks(ctx, hands[0].keypoints);
            const text = interpretSign(hands[0].keypoints);
            store.setTranslatedText(text);
        }

        animationFrame.value = requestAnimationFrame(detectHands);
    } catch (detectionError) {
        console.error('Detection error:', detectionError);
        store.setError('Hand detection failed');
        stopDetection();
    }
};

const drawLandmarks = (ctx, landmarks) => {
    ctx.strokeStyle = '#FF3B30';
    ctx.lineWidth = 2;

    landmarks.forEach(landmark => {
        ctx.beginPath();
        ctx.arc(landmark.x, landmark.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#34C759';
        ctx.fill();
    });
};

const interpretSign = (landmarks) => {
    // TODO: Implement actual sign interpretation
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    return thumbTip.y < indexTip.y ? 'Hello' : '...';
};

const stopDetection = () => {
    if (animationFrame.value) {
        cancelAnimationFrame(animationFrame.value);
        animationFrame.value = null;
    }
    if (poseCanvas.value) {
        const ctx = poseCanvas.value.getContext('2d');
        ctx?.clearRect(0, 0, poseCanvas.value.width, poseCanvas.value.height);
    }
};

// Error Handling
const handleCameraError = (err) => {
    console.error('Camera error:', err);
    error.value = err.message || 'Camera access denied';
    store.setError(error.value);
    stopCamera();
};

const handleVideoError = () => {
    error.value = "Failed to load video";
    isLoading.value = false;
};

const retryCamera = async () => {
    error.value = null;
    await startCamera();
};
</script>

<style scoped>
/* Keep existing styles the same */
.video-player-container {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 500px;
    background-color: #000;
    border-radius: 12px;
    overflow: hidden;
}

.video-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}

.camera-feed,
video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.pose-canvas {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 1;
}

.translation-overlay {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 1.4rem;
    backdrop-filter: blur(6px);
    z-index: 2;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.empty-state {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #888;
    font-size: 1.2rem;
}

.loading-overlay,
.error-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    z-index: 3;
}

.error-overlay {
    background: rgba(229, 62, 62, 0.8);
}

.retry-button {
    margin-top: 1rem;
    padding: 8px 16px;
    background: #fff;
    color: #e53e3e;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.2s;
}

.retry-button:hover {
    opacity: 0.9;
}

.spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>