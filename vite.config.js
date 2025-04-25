import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_'); // Loads only VITE_* vars
  
  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT), // Uses .env or Vite's default (5173) if undefined
      proxy: {
        '/api': {
          target: env.VITE_API_URL, // No fallback → fails if .env is invalid
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})