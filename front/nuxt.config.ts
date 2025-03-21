// nuxt.config.ts
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  alias: {
    "@": resolve(__dirname, "./"),
  },
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      EMAIL_SERVICE_ID: process.env.NUXT_EMAIL_SERVICE_ID,
      EMAIL_TEMPLATE_ID: process.env.NUXT_EMAIL_TEMPLATE_ID,
      EMAIL_PUBLIC_KEY: process.env.NUXT_EMAIL_PUBLIC_KEY,
    }
  },

  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    transpile: ["@daily-co/daily-js"],
  },
  devServer: {
    port: process.env.NUXT_PORT || 3000,
  },
  app: {
    head: {
      script: [
        // Define Module.locateFile so that the WASM file is loaded from the root.
        { src: "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js", defer: true },
        { src: "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js", defer: true },
        { src: "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core", defer: true },
        { src: "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-cpu", defer: true },
      ]
    }
  },
  modules: ["@nuxt/image"],
});
