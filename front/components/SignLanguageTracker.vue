<template>
  <div class="tracker-container">
    <!-- Hidden video element used for capturing the webcam stream -->
    <video ref="webcam" class="webcam" playsinline muted style="display:none"></video>
    <!-- Canvas to display the processed output -->
    <canvas ref="outputCanvas" class="output-canvas"></canvas>
    <!-- Optional buttons to control webcam, switch camera etc. -->
    <button @click="enableCam" id="webcamButton">start translate</button>
    <button @click="switchCamera" id="switch-camera" style="display:none">Switch Camera</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
// Refs for DOM elements
const webcam = ref(null);
const outputCanvas = ref(null);
let videoStream = null;
let webcamRunning = false;
let videoFacingMode = 'user';
let handLandmarker = undefined; // This will be loaded later
// import * as tflite from '@tensorflow/tfjs-tflite';

// Load external libraries dynamically if you need to in Nuxt
// Alternatively, include them in your nuxt.config.js head property

// Example: Create and load the HandLandmarker using mediapipe tasks vision
const createHandLandmarker = async () => {
  // Import mediapipe tasks vision dynamically
  const { HandLandmarker, FilesetResolver } = await import(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0'
      );
  const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
  );
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
      delegate: 'GPU',
    },
    runningMode: 'VIDEO',
    numHands: 1,
  });
};

// async function loadModels() {
//   const letterModel = await tflite.loadTFLiteModel('/exported/model.tflite');
//   const wordModel = await tflite.loadTFLiteModel('/exported/word.tflite');
//   // Use these models as needed.
// }


// Initialize the hand landmarker on component mount
onMounted(async () => {
  // await loadModels();
  await createHandLandmarker();
});

// Function to get the webcam stream based on constraints
async function loadCamera() {
  // Stop any existing stream
  if (videoStream) {
    videoStream.getTracks().forEach((track) => track.stop());
  }
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: videoFacingMode },
    });
    if (webcam.value) {
      webcam.value.srcObject = videoStream;
      webcam.value.play();
      webcam.value.addEventListener('loadeddata', predictWebcam);
    }
  } catch (error) {
    console.error('Error accessing the camera: ', error);
  }
}

// Enable the webcam stream
function enableCam() {
  if (!handLandmarker) {
    console.log('HandLandmarker not loaded yet.');
    return;
  }
  webcamRunning = !webcamRunning;
  // Optionally hide or show controls based on state
  loadCamera();
}

// Toggle camera facing mode (user / environment)
async function switchCamera() {
  videoFacingMode = videoFacingMode === 'user' ? 'environment' : 'user';
  webcamRunning = false;
  await loadCamera();
  webcamRunning = true;
}

// Prediction loop to process webcam frames
let lastVideoTime = -1;
async function predictWebcam() {
  if (!webcam.value || !outputCanvas.value) return;
  // Ensure video dimensions are available
  if (webcam.value.videoHeight === 0) return;

  const canvasCtx = outputCanvas.value.getContext('2d');
  // Set canvas size to match your desired display dimensions
  outputCanvas.value.width = window.innerWidth;
  outputCanvas.value.height = (webcam.value.videoHeight / webcam.value.videoWidth) * window.innerWidth;

  // Switch running mode to VIDEO if needed (once)
  // Get current timestamp for mediapipe processing
  const startTimeMs = performance.now();
  // Run hand detection on the current video frame
  const results = await handLandmarker.detectForVideo(webcam.value, startTimeMs);

  // Clear the canvas and draw the video frame as background
  canvasCtx.clearRect(0, 0, outputCanvas.value.width, outputCanvas.value.height);
  canvasCtx.drawImage(
      webcam.value,
      0,
      0,
      outputCanvas.value.width,
      outputCanvas.value.height
  );

  // Process detection results and draw annotations as needed
  if (results.landmarks && results.landmarks[0]) {
    // Example: draw a rectangle around the detected hand.
    // Extract landmark coordinates and compute bounding box.
    let xs = results.landmarks[0].map((pt) => pt.x);
    let ys = results.landmarks[0].map((pt) => pt.y);
    const canvasWidth = outputCanvas.value.width;
    const canvasHeight = outputCanvas.value.height;
    const minX = Math.min(...xs) * canvasWidth;
    const maxX = Math.max(...xs) * canvasWidth;
    const minY = Math.min(...ys) * canvasHeight;
    const maxY = Math.max(...ys) * canvasHeight;

    canvasCtx.strokeStyle = '#FF0000';
    canvasCtx.lineWidth = 4;
    canvasCtx.strokeRect(minX, minY, maxX - minX, maxY - minY);

    // Here you can add your TFLite sign language translation logic:
    // 1. Crop the detected region.
    // 2. Preprocess the cropped image.
    // 3. Run the prediction model.
    // 4. Map the prediction to a sign language letter/word.
    // 5. Display the translated result.
  }

  // Continue processing if webcam is running
  if (webcamRunning) {
    requestAnimationFrame(predictWebcam);
  }
}

// Clean up on component unmount
onBeforeUnmount(() => {
  if (videoStream) {
    videoStream.getTracks().forEach((track) => track.stop());
  }
});
</script>

<style scoped>
.tracker-container {
  position: relative;
  text-align: center;
}
.webcam {
  display: none; /* Hidden because we use canvas for output */
}
.output-canvas {
  width: 100%;
  max-width: 600px;
  border: 1px solid #ccc;
  margin: 0 auto;
}
</style>
