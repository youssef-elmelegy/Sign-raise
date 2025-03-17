import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  alias: {
    "@": resolve(__dirname, "./"),
  },

  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    transpile: ["@daily-co/daily-js"],
   },

  devServer: {
    port: process.env.NUXT_PORT || 3000,
  },

  modules: ["@nuxt/image"],
});
