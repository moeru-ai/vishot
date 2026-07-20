import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@vishot/core': new URL('../core/src/index.ts', import.meta.url).pathname,
    },
  },
  test: {
    environment: 'node',
  },
})
