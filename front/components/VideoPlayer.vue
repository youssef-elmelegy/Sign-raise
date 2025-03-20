<template>
    <div class="video-player-container bg-gray-900 rounded-xl overflow-hidden">
        <!-- Empty State -->
        <div v-if="!store.cameraActive && !videoUrl" class="empty-state text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mb-4">
                <path d="M23 7l-7 5 7 5V7z" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            <p>Start the camera to begin translation</p>
        </div>

        <!-- Video Wrapper -->
        <div class="video-wrapper" v-show="store.cameraActive || videoUrl">
            <!-- Camera Feed -->
            <video v-show="localStream" ref="cameraVideo" autoplay playsinline muted class="camera-feed"
                :style="{ transform: mirrorCamera ? 'scaleX(-1)' : 'none' }"></video>

            <!-- File Video Player -->
            <video v-show="videoUrl && !localStream" ref="videoElement" controls :src="videoUrl"
                @error="handleVideoError" @loadstart="isLoading = true" @canplay="isLoading = false" width="100%"
                height="auto"></video>

            <!-- Hand Pose Canvas Overlay -->
            <canvas ref="poseCanvas" class="pose-canvas"></canvas>

            <!-- Translation Overlay -->
            <div v-if="store.translatedText && showOverlay"
                class="translation-overlay bg-black bg-opacity-70 text-white">
                <div class="translation-text">{{ store.translatedText }}</div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="loading-overlay bg-black bg-opacity-70 text-white">
                <div class="spinner border-t-white"></div>
                <p>{{ loadingMessage }}</p>
            </div>

            <!-- Error State - Only show for critical errors -->
            <div v-if="error && showErrorOverlay" class="loading-overlay bg-black bg-opacity-80 text-white">
                <p>{{ error }}</p>
                <button v-if="error.includes('detection')" @click="retryModelLoad"
                    class="retry-button bg-white text-gray-900 hover:bg-gray-100">
                    Retry Loading Model
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { usePlaygroundStore } from '@/stores/playgroundStore';

const props = defineProps({
    videoUrl: String,
    showOverlay: {
        type: Boolean,
        default: true
    }
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
const modelLoaded = ref(false);
const detectionConfidence = ref(0.7); // Minimum confidence threshold
const loadRetries = ref(0);
const maxRetries = 3;
const showErrorOverlay = ref(false); // Only show error overlay for critical errors

// Computed loading message
const loadingMessage = computed(() => {
    if (!modelLoaded.value) {
        return `Loading hand detection model${loadRetries.value > 0 ? ` (attempt ${loadRetries.value + 1}/${maxRetries + 1})` : ''}...`;
    }
    return 'Starting camera...';
});

// Simplified sign recognition with static poses
// This uses a very basic approach - in reality you'd want more sophisticated algorithms
const signDictionary = {
    'HELLO': {
        fingerStates: {
            thumb: 'up',
            index: 'up',
            middle: 'up',
            ring: 'up',
            pinky: 'up'
        }
    },
    'THANK YOU': {
        fingerStates: {
            thumb: 'out',
            index: 'up',
            middle: 'up',
            ring: 'up',
            pinky: 'up'
        }
    },
    'YES': {
        fingerStates: {
            thumb: 'up',
            index: 'closed',
            middle: 'closed',
            ring: 'closed',
            pinky: 'closed'
        }
    },
    'NO': {
        fingerStates: {
            thumb: 'closed',
            index: 'up',
            middle: 'closed',
            ring: 'closed',
            pinky: 'closed'
        }
    },
    'PLEASE': {
        fingerStates: {
            thumb: 'out',
            index: 'up',
            middle: 'up',
            ring: 'up',
            pinky: 'up'
        }
    },
    'HELP': {
        fingerStates: {
            thumb: 'out',
            index: 'up',
            middle: 'up',
            ring: 'closed',
            pinky: 'closed'
        }
    },
    'SORRY': {
        fingerStates: {
            thumb: 'closed',
            index: 'closed',
            middle: 'closed',
            ring: 'closed',
            pinky: 'closed'
        }
    },
    'GOOD': {
        fingerStates: {
            thumb: 'up',
            index: 'closed',
            middle: 'closed',
            ring: 'closed',
            pinky: 'closed'
        }
    }
};

// TensorFlow.js initialization with improved error handling
const initializeDetector = async () => {
    if (handDetector.value) return true; // Already initialized

    try {
        isLoading.value = true;
        error.value = null;
        showErrorOverlay.value = false;

        // Make sure global window.tf is defined first
        if (typeof window === 'undefined' || !window.tf) {
            // Load TensorFlow directly from CDN for better reliability
            await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0/dist/tf.min.js');
            console.log('TensorFlow.js loaded from CDN');
        }

        // Initialize backend with WebGL first (faster), then fallback to CPU if needed
        try {
            await window.tf.setBackend('webgl');
            await window.tf.ready();
            console.log('Using WebGL backend');
        } catch (backendError) {
            console.warn('WebGL initialization failed, falling back to CPU:', backendError);
            try {
                await window.tf.setBackend('cpu');
                await window.tf.ready();
                console.log('Using CPU backend');
            } catch (cpuError) {
                throw new Error('Failed to initialize TensorFlow backend');
            }
        }

        // Load hand pose model directly
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection@2.0.0/dist/hand-pose-detection.min.js');

        // Create the detector with optimized settings
        const detector = await window.handPoseDetection.createDetector(
            window.handPoseDetection.SupportedModels.MediaPipeHands,
            {
                runtime: 'tfjs',
                modelType: 'lite', // Using lite for better performance
                maxHands: 1,
                solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915'
            }
        );

        handDetector.value = detector;
        console.log('Hand detection model loaded successfully');
        modelLoaded.value = true;
        return true;
    } catch (err) {
        console.error('Hand detection initialization failed:', err);

        // Increase retry counter
        loadRetries.value++;

        if (loadRetries.value <= maxRetries) {
            console.log(`Retrying model initialization (${loadRetries.value}/${maxRetries})...`);
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
            return initializeDetector();
        }

        error.value = `Failed to initialize hand detection model: ${err.message || 'Unknown error'}`;
        showErrorOverlay.value = true; // Show error overlay for model initialization failures
        store.setError('Hand detection model could not be loaded. Try a different browser or device.');
        return false;
    } finally {
        isLoading.value = false;
    }
};

// Helper function to load scripts
const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        // Check if the script is already loaded
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = (e) => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
    });
};

// Lifecycle Hooks
onMounted(async () => {
    // Only initialize the detector in the background, don't start the camera
    try {
        // Just preload the model but don't start the camera
        await initializeDetector();
        console.log('Model initialized on mount, waiting for user to start camera');
    } catch (err) {
        console.error('Failed to initialize on mount:', err);
    }
});

onBeforeUnmount(() => {
    stopCamera();
    stopDetection();
});

// Watchers
watch(() => store.receiveVideo, async (newVal) => {
    if (newVal) {
        if (!modelLoaded.value) {
            const success = await initializeDetector();
            if (success) startCamera();
        } else {
            startCamera();
        }
    } else {
        stopCamera();
    }
});

watch(() => store.isTranslating, async (newVal) => {
    if (newVal) {
        // Make sure detector is initialized before starting detection
        if (!handDetector.value) {
            const success = await initializeDetector();
            if (success) detectHands();
        } else {
            detectHands();
        }
    } else {
        stopDetection();
    }
});

// Camera Methods
const startCamera = async () => {
    try {
        isLoading.value = true;
        error.value = null;
        showErrorOverlay.value = false;

        // Use lower resolution for better performance
        const constraints = {
            video: {
                facingMode: 'user',
                width: { ideal: 640 },
                height: { ideal: 480 },
                frameRate: { ideal: 24 }
            },
            audio: false
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        localStream.value = stream;

        if (cameraVideo.value) {
            cameraVideo.value.srcObject = stream;

            // Wait for video to be ready
            await new Promise(resolve => {
                cameraVideo.value.onloadedmetadata = () => {
                    cameraVideo.value.play().then(resolve).catch(e => {
                        console.warn('Could not autoplay camera:', e);
                        resolve();
                    });
                };
            });

            // Set canvas dimensions to match video
            if (poseCanvas.value && cameraVideo.value) {
                poseCanvas.value.width = cameraVideo.value.videoWidth;
                poseCanvas.value.height = cameraVideo.value.videoHeight;
            }
        }

        store.setCameraActive(true);

        // If translation was previously on, restart it
        if (store.isTranslating && handDetector.value) {
            detectHands();
        }

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
        });
        localStream.value = null;
    }

    if (cameraVideo.value) {
        cameraVideo.value.srcObject = null;
    }

    store.setCameraActive(false);
    stopDetection();
};

// Simplified hand detection to reduce computational load
const detectHands = async () => {
    if (!store.isTranslating || !handDetector.value || !cameraVideo.value || !poseCanvas.value) return;

    try {
        const ctx = poseCanvas.value.getContext('2d');
        if (!ctx) return;

        // Clear previous drawings
        ctx.clearRect(0, 0, poseCanvas.value.width, poseCanvas.value.height);

        // Skip frames for better performance (detect every 3rd frame)
        if (typeof detectHands.frameCount === 'undefined') {
            detectHands.frameCount = 0;
        }

        detectHands.frameCount = (detectHands.frameCount + 1) % 3;

        if (detectHands.frameCount === 0) {
            // Detect hands
            const hands = await handDetector.value.estimateHands(cameraVideo.value, {
                flipHorizontal: mirrorCamera.value
            });

            if (hands.length > 0) {
                // Only process hands with sufficient confidence
                const hand = hands[0];
                if (hand.score >= detectionConfidence.value) {
                    drawLandmarks(ctx, hand.keypoints);

                    // Simplified detection - just identify basic hand shapes
                    const fingerPositions = getFingerPositions(hand.keypoints);
                    identifySign(fingerPositions);
                }
            }
        }

        // Continue detection loop
        animationFrame.value = requestAnimationFrame(detectHands);
    } catch (detectionError) {
        console.error('Detection error:', detectionError);

        // Don't completely stop if there's a single frame error
        if (detectionError.message && detectionError.message.includes('backend')) {
            // Backend error is more serious - may need to reinitialize
            store.setError('Hand detection failed - trying to recover');
            stopDetection();

            // Try to reinitialize after a short delay
            setTimeout(async () => {
                const success = await initializeDetector();
                if (success && store.isTranslating) detectHands();
            }, 2000);
        } else {
            // For other errors, just continue
            animationFrame.value = requestAnimationFrame(detectHands);
        }
    }
};

// Draw hand landmarks for visualization
const drawLandmarks = (ctx, landmarks) => {
    // First draw connections between landmarks for better visualization
    const connections = [
        // Thumb
        [0, 1], [1, 2], [2, 3], [3, 4],
        // Index finger
        [5, 6], [6, 7], [7, 8],
        // Middle finger
        [9, 10], [10, 11], [11, 12],
        // Ring finger
        [13, 14], [14, 15], [15, 16],
        // Pinky
        [17, 18], [18, 19], [19, 20],
        // Palm
        [0, 5], [5, 9], [9, 13], [13, 17]
    ];

    // Draw connections
    ctx.strokeStyle = 'rgba(75, 192, 192, 0.8)';
    ctx.lineWidth = 2;

    connections.forEach(([i, j]) => {
        const start = landmarks[i];
        const end = landmarks[j];

        if (start && end) {
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
    });

    // Draw landmarks
    landmarks.forEach(landmark => {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 99, 132, 0.8)';
        ctx.arc(landmark.x, landmark.y, 3, 0, 2 * Math.PI);
        ctx.fill();
    });

    // Draw fingertips with a different color
    [4, 8, 12, 16, 20].forEach(index => {
        const tip = landmarks[index];
        if (tip) {
            ctx.beginPath();
            ctx.fillStyle = 'rgba(54, 162, 235, 0.8)';
            ctx.arc(tip.x, tip.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    });
};

// Get positions of each finger (simplified for basic gesture recognition)
const getFingerPositions = (landmarks) => {
    // Key points for each finger
    const wrist = landmarks[0];
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];

    // Get knuckles (base of fingers)
    const indexKnuckle = landmarks[5];
    const middleKnuckle = landmarks[9];
    const ringKnuckle = landmarks[13];
    const pinkyKnuckle = landmarks[17];

    // Determine finger states (very simplified)
    // A more robust system would use angles and relative positions
    const fingerPositions = {
        thumb: getFingerState(wrist, landmarks[2], thumbTip),
        index: getFingerState(wrist, indexKnuckle, indexTip),
        middle: getFingerState(wrist, middleKnuckle, middleTip),
        ring: getFingerState(wrist, ringKnuckle, ringTip),
        pinky: getFingerState(wrist, pinkyKnuckle, pinkyTip)
    };

    return fingerPositions;
};

// Determine if a finger is extended or not
const getFingerState = (wrist, knuckle, tip) => {
    // Calculate distances
    const distKnuckleToWrist = distance(knuckle, wrist);
    const distTipToWrist = distance(tip, wrist);

    // If tip is much further from wrist than knuckle, finger is extended
    if (distTipToWrist > distKnuckleToWrist * 1.5) {
        // Detect if finger is pointing up, down, or to the side
        if (tip.y < knuckle.y - 20) return 'up';
        if (tip.y > knuckle.y + 20) return 'down';
        return 'out';
    }

    return 'closed';
};

// Simple matching algorithm to identify signs
const identifySign = (fingerPositions) => {
    // Currently demonstrated signs
    let bestMatch = null;
    let bestScore = 0;

    // Check each sign in our dictionary
    for (const [signName, sign] of Object.entries(signDictionary)) {
        const score = matchSign(fingerPositions, sign.fingerStates);

        if (score > bestScore) {
            bestScore = score;
            bestMatch = signName;
        }
    }

    // Only update if we have a reasonable match
    if (bestScore >= 0.7) {
        // Format the sign name for display
        const formattedSign = bestMatch.replace(/_/g, ' ');
        store.setTranslatedText(formattedSign);
    } else {
        store.setTranslatedText('');
    }
};

// Calculate how well a hand pose matches a sign definition
const matchSign = (fingerPositions, signFingerStates) => {
    let matchingFingers = 0;

    // Count matching fingers
    for (const finger of ['thumb', 'index', 'middle', 'ring', 'pinky']) {
        if (fingerPositions[finger] === signFingerStates[finger]) {
            matchingFingers++;
        }
    }

    // Return score between 0 and 1
    return matchingFingers / 5;
};

// Helper function to calculate distance between two points
function distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

const stopDetection = () => {
    if (animationFrame.value) {
        cancelAnimationFrame(animationFrame.value);
        animationFrame.value = null;
    }

    if (poseCanvas.value) {
        const ctx = poseCanvas.value.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, poseCanvas.value.width, poseCanvas.value.height);
    }

    // Clear translation when stopping detection
    store.setTranslatedText('');
};

// Error Handling
const handleCameraError = (err) => {
    console.error('Camera error:', err);

    // Only show critical camera errors in the store
    if (err.name === 'NotAllowedError') {
        store.setError('Camera access denied. Please allow camera access and try again.');
    } else if (err.name === 'NotFoundError') {
        store.setError('No camera found. Please connect a camera and try again.');
    } else if (err.name === 'NotReadableError') {
        store.setError('Camera is already in use by another application.');
    } else {
        // Log other errors but don't show them in the UI
        console.error('Camera error:', err.message || 'Failed to access camera');
    }

    stopCamera();
};

const handleVideoError = () => {
    // Just log the error but don't show it in the UI
    console.warn("Video loading error");
    isLoading.value = false;
};

const retryModelLoad = async () => {
    error.value = null;
    showErrorOverlay.value = false;
    loadRetries.value = 0;
    const success = await initializeDetector();
    if (success && store.receiveVideo) {
        startCamera();
    }
};
</script>

<style scoped>
.video-player-container {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 500px;
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
    background-color: #000;
}

.pose-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
}

.translation-overlay {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 1.4rem;
    backdrop-filter: blur(6px);
    z-index: 2;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-width: 80%;
    text-align: center;
}

.empty-state {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 3;
}

.retry-button {
    margin-top: 1rem;
    padding: 8px 16px;
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