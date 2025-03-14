import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
        },
      ],
    },
  },
  alias: {
    "@": resolve(__dirname, "./src"),
  },

  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ["@nuxt/image"],
});
