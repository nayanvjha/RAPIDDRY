import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('@react-three/fiber') || id.includes('@react-three/drei')) {
            return 'three';
          }

          if (id.includes('node_modules/gsap')) {
            return 'gsap';
          }

          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor';
          }

          return undefined;
        },
      },
    },
  },
})
