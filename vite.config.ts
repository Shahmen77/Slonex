import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~/components": path.resolve(__dirname, "./src/components"),
      "~/client": path.resolve(__dirname, "./src/client"),
      "~/server": path.resolve(__dirname, "./src/server"),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  },
})