import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base is '/' because this deploys to the USER PAGE kshitijkb28.github.io (root).
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
  },
})
