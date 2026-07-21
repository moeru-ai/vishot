import { resolve } from 'node:path'

import Vue from '@vitejs/plugin-vue'

import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: {
        'components': resolve(import.meta.dirname, 'src/components/index.ts'),
        'composables': resolve(import.meta.dirname, 'src/composables/index.ts'),
        'index': resolve(import.meta.dirname, 'src/index.ts'),
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
  plugins: [
    Vue(),
  ],
})
