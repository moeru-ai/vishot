import { defineConfig } from 'tsdown'

export default defineConfig({
  clean: true,
  deps: {
    neverBundle: [
      '@vishot/core',
    ],
  },
  dts: true,
  entry: {
    index: 'src/index.ts',
  },
  format: 'esm',
})
