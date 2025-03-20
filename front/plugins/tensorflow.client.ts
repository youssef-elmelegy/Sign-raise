import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(async (nuxtApp) => {
  if (process.client) {
    // Load polyfills and TensorFlow.js directly from CDN
    try {
      // Load necessary polyfills
      window.Buffer = await import("buffer").then((mod) => mod.Buffer);
      window.Long = await import("long").then((mod) => mod.default);

      // Dynamically load TensorFlow.js from CDN
      await loadScript(
        "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0/dist/tf.min.js"
      );

      // Pre-load hand pose detection model to avoid delays later
      await loadScript(
        "https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection@2.0.0/dist/hand-pose-detection.min.js"
      );

      console.log("TensorFlow.js dependencies loaded in plugin");
    } catch (err) {
      console.warn("Failed to preload TensorFlow.js dependencies:", err);
      // Don't fail the plugin, we'll handle this in the component
    }
  }
});

// Helper function to load scripts
function loadScript(src) {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = (e) => {
      console.error(`Failed to load script: ${src}`, e);
      reject(new Error(`Failed to load script: ${src}`));
    };
    document.head.appendChild(script);
  });
}
