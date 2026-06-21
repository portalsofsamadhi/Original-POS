import { defineConfig } from 'vite'
import { resolve as _resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: 'src/booking.ts',
      output: {
        entryFileNames: 'booking/booking.js',
        format: 'es'
      }
    },
    outDir: 'dist'
  }
})
