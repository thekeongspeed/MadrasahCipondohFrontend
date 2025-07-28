import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Teruskan semua request /api ke backend di port 5000
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // Teruskan semua request gambar /uploads ke backend
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})