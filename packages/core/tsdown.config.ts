import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    artifacts: 'src/artifacts.ts',
    files: 'src/files.ts',
    ready: 'src/ready.ts',
    selectors: 'src/selectors.ts',
  },
  format: 'esm',
  dts: true,
  clean: true,
})
