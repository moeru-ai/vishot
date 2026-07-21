import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@vishot/core': new URL('../core/src/index.ts', import.meta.url).pathname,
      '@vishot/renderer-browser': new URL('../renderer-browser/src/index.ts', import.meta.url).pathname,
      '@vishot/source-electron': new URL('../source-electron/src/index.ts', import.meta.url).pathname,
    },
  },
  test: {
    environment: 'node',
  },
})
