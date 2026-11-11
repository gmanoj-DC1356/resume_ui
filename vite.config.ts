import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Django dev server. Proxying keeps the browser on one origin so the session and CSRF cookies work.
// Override with VITE_DEV_PROXY_TARGET when Django runs on another port.
const DEFAULT_BACKEND_URL = 'http://localhost:8000'
const BACKEND_PATHS = ['/api', '/admin', '/static']

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const backendUrl = env.VITE_DEV_PROXY_TARGET || DEFAULT_BACKEND_URL

  console.log(backendUrl)
  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: Object.fromEntries(
        BACKEND_PATHS.map((path) => [path, { target: backendUrl, changeOrigin: false }]),
      ),
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
