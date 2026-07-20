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
      ],
    },
    dts: true,
    clean: true,
  },
  {
    entry: {
      'cli/capture': 'src/cli/capture.ts',
    },
    format: 'esm',
    deps: {
      neverBundle: [
        '@vishot/core',
      ],
    },
    dts: false,
    clean: false,
    outputOptions: {
      banner: '#!/usr/bin/env node',
    },
  },
])
