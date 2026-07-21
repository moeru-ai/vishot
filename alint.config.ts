import jsPlugin from '@alint-js/plugin-js'

import { defineConfig, ignorePatternsAIAgents, ignorePatternsCommon } from '@alint-js/cli'

export default defineConfig([
  {
    ignores: [
      ...ignorePatternsCommon,
      ...ignorePatternsAIAgents,
    ],
  },
  {
    extends: ['js/recommended'],
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts,vue}'],
    ignore: {
      gitignore: true,
    },
    plugins: {
      js: jsPlugin,
    },
  },
])
