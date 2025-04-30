import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',  // Адрес API, на который будут проксироваться запросы
        changeOrigin: true,  // Изменяет заголовок Origin на target
        rewrite: (path) => path.replace(/^\/api/, ''), // Убирает /api из пути запроса
      },
    },
  },
})
