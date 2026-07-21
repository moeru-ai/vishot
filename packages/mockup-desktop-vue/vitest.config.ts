import Vue from '@vitejs/plugin-vue'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    Vue(),
  ],
  resolve: {
    alias: {
      '@vishot/core': new URL('../core/src/index.ts', import.meta.url).pathname,
    },
  },
  test: {
    environment: 'jsdom',
    exclude: [
      '**/node_modules/**',
      '**/.git/**',
      '**/*.browser.test.ts',
    ],
  },
})
