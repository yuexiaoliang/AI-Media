import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [useCredentials()],

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

    modulePreload: {
      polyfill: false
    }
  },

  css: {
    devSourcemap: true
  }
})

function useCredentials() {
  return {
    name: 'use-credentials',
    transformIndexHtml(html) {
      // 删除 crossorigin 属性，否则会导致跨域问题
      return html.replace(/(type="module" )?crossorigin /g, "");
    },
  };
}