import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || 'http://localhost:4000'

  // Starts on 3000, or the next free port (3001, 3002, ...) if it's taken.
  // In development the browser calls /api on this same address and Vite forwards it to the
  // backend, so whichever port is picked, the backend's CORS list doesn't need to include it.
  const server = {
    port: 3000,
    strictPort: false,
    proxy: {
      '/api': {
        target: apiUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  }

  return {
    plugins: [react(), tailwindcss()],
    server,
    preview: server,
  }
})
