import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const match = id.match(/gpt-tokenizer\/(?:esm\/)?encoding\/(\w+)/)
          if (match) {
            return `tokenizer-${match[1]}`
          }
        },
      },
    },
  },
})
