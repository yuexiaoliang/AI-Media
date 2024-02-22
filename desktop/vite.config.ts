import path from 'node:path'

import { defineConfig } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import electron from 'vite-plugin-electron/simple'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
    electron({
      main: {
        entry: 'electron/main.ts',
      },
      preload: {
        input: path.join(__dirname, 'electron/preload.ts'),
      }
    }),
    VueDevTools(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  }
})
