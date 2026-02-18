import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Fixed dev server port to prevent Vite from auto-incrementing when port is in use.
// If the port is already in use, Vite will exit with an error (strictPort: true).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5177,
    strictPort: true
  }
})
