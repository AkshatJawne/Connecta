import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, 
    // This is to proxy the requests to the backend server, eliminating potential CORS issues
    proxy: {
      "/api" : {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      }
    }
  },
})
