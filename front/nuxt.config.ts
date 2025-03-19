import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineNuxtConfig({
  // Disable SSR for TensorFlow compatibility
  ssr: false,

  compatibilityDate: "2024-11-01",

  alias: {
    "@": resolve(__dirname, "./"),
  },

  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [
      tailwindcss(),
      nodePolyfills({
        protocolImports: true,
      }),
    ],
    optimizeDeps: {
      include: [
        "@tensorflow/tfjs",
        "@tensorflow-models/hand-pose-detection",
        "vue",
      ],
    },
  },

  build: {
    transpile: [
      "@daily-co/daily-js",
      "@tensorflow/tfjs",
      "@tensorflow-models/hand-pose-detection",
      "vue",
      "long",
      "buffer",
    ],
  },

  devServer: {
    port: process.env.NU ? parseInt(process.env.NU, 10) : undefined,
  },

  modules: ["@nuxt/image", "@pinia/nuxt"],

  // Required for TensorFlow.js in Nuxt
  nitro: {
    externals: {
      inline: ["@tensorflow/tfjs"],
    },
  },
});
