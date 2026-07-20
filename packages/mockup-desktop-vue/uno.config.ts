import { defineConfig, presetWebFonts, presetWind3 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(),
    presetWebFonts({
      fonts: {
        sans: 'Inter',
      },
    }),
  ],
})
