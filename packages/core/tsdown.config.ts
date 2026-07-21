import { defineConfig } from 'tsdown'

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    artifacts: 'src/artifacts.ts',
    files: 'src/files.ts',
    index: 'src/index.ts',
    ready: 'src/ready.ts',
    selectors: 'src/selectors.ts',
  },
  format: 'esm',
})
