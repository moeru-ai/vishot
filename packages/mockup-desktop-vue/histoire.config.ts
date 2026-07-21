import UnoCSS from 'unocss/vite'

import { HstVue } from '@histoire/plugin-vue'
import { defineConfig } from 'histoire'

export default defineConfig({
  plugins: [
    HstVue(),
  ],
  routerMode: 'hash',
  setupFile: 'stories/setup.ts',
  theme: {
    title: 'Vishot Desktop Mockups',
  },
  tree: {
    groups: [
      {
        id: 'platforms',
        title: 'Platforms',
      },
      {
        id: 'capture',
        title: 'Capture',
      },
    ],
  },
  vite: {
    plugins: [
      UnoCSS(),
    ],
  },
})
