import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    clean: true,
    deps: {
      neverBundle: [
        '@vishot/core',
        '@vishot/renderer-browser',
        '@vishot/source-electron',
      ],
    },
    dts: true,
    entry: {
      index: 'src/index.ts',
    },
    format: 'esm',
  },
  {
    clean: false,
    deps: {
      neverBundle: [
        '@vishot/core',
        '@vishot/renderer-browser',
        '@vishot/source-electron',
      ],
    },
    dts: false,
    entry: {
      'bin/index': 'src/bin/index.ts',
    },
    format: 'esm',
    outputOptions: {
      banner: '#!/usr/bin/env node',
    },
  },
])
