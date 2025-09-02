import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'RiveVue',
      fileName: (format) => `rive-vue.${format}.js`
    },
    rollupOptions: {
      external: ['vue', '@rive-app/canvas', '@rive-app/canvas-lite', '@rive-app/webgl', '@rive-app/webgl2'],
      output: {
        globals: {
          vue: 'Vue',
          '@rive-app/canvas': 'RiveCanvas',
          '@rive-app/canvas-lite': 'RiveCanvasLite',
          '@rive-app/webgl': 'RiveWebGL',
          '@rive-app/webgl2': 'RiveWebGL2'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
}) 