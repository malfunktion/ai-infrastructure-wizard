import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import systemCheckPlugin from './vite-plugin-system-check'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), systemCheckPlugin()],
  server: {
    port: 5173,
    strictPort: true,
    host: true
  }
})
