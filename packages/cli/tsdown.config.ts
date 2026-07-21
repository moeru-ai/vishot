import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
    },
    format: 'esm',
    deps: {
      neverBundle: [
        '@vishot/core',
        '@vishot/renderer-browser',
        '@vishot/source-electron',
      ],
    },
    dts: true,
    clean: true,
  },
  {
    entry: {
      'bin/index': 'src/bin/index.ts',
    },
    format: 'esm',
    deps: {
      neverBundle: [
        '@vishot/core',
        '@vishot/renderer-browser',
        '@vishot/source-electron',
      ],
    },
    dts: false,
    clean: false,
    outputOptions: {
      banner: '#!/usr/bin/env node',
    },
  },
])
