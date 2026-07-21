import { resolve } from 'node:path'

import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    Vue(),
  ],
  build: {
    lib: {
      entry: {
        'index': resolve(import.meta.dirname, 'src/index.ts'),
        'components': resolve(import.meta.dirname, 'src/components/index.ts'),
        'composables': resolve(import.meta.dirname, 'src/composables/index.ts'),
        'macos': resolve(import.meta.dirname, 'src/components/platforms/macos/index.ts'),
        'runtime/scene-canvas': resolve(import.meta.dirname, 'src/runtime/scene-canvas.ts'),
        'windows': resolve(import.meta.dirname, 'src/components/platforms/windows/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        '@vishot/core',
        '@vueuse/core',
        'reka-ui',
        'vue',
        'vue-router',
      ],
      output: {
        assetFileNames: 'assets/[name][extname]',
        chunkFileNames: 'chunks/[name].js',
        entryFileNames: '[name].js',
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
})
