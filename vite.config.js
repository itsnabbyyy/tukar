import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://127.0.0.1:8000',
      '/chat': 'http://127.0.0.1:8000',
      '/files': 'http://127.0.0.1:8000',
      '/try-on': 'http://127.0.0.1:8000'
    }
  }
})
