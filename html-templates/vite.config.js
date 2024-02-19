import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',

  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    }
  },

  build: {
    rollupOptions: {
      input: [
        resolve(__dirname, 'cover.html'),
        resolve(__dirname, 'word-card.html'),
      ],
    },
  },

  css: {
    devSourcemap: true
  }
})