import path from 'node:path'
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Use repo name for GitHub Pages base path in production builds.
  base: command === "build" ? (process.env.BASE_PATH ?? "/") : "/",
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))
