import { HstVue } from '@histoire/plugin-vue'
import { defineConfig } from 'histoire'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  routerMode: 'hash',
  theme: {
    title: 'Vishot Desktop Mockups',
  },
  plugins: [
    HstVue(),
  ],
  setupFile: 'stories/setup.ts',
  vite: {
    plugins: [
      UnoCSS(),
    ],
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
})
