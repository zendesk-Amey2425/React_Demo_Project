import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all /api/v1 requests to the Rails backend in development.
      // In production, a reverse proxy (nginx, CloudFront, etc.) handles this
      // routing so the frontend and API share the same domain — no CORS issues.
      '/api/v1': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
