# Vishot

Composable screenshot tooling for source capture, browser rendering, and desktop mockup composition.

## Packages

- `@vishot/core`: shared artifact contracts, capture-root selectors, ready signals, and file helpers.
- `@vishot/source-electron`: Playwright Electron source capture for raw application screenshots.
- `@vishot/renderer-browser`: Playwright Chromium renderer for final browser-composed image artifacts.
- `@vishot/mockup-desktop-vue`: Vue components for capture canvases and desktop mockup shells.

Product-specific screenshot scenarios should live in the product repository. Vishot owns reusable capture protocols, renderers, and mockup primitives.
