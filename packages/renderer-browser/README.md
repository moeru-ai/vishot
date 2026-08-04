# `@vishot/renderer-browser`

Playwright Chromium renderer for Vishot capture roots.

## What it does

This package starts a browser rendering flow for a scene entry and exports named capture roots as final image artifacts. It reuses `@vishot/core` for selectors, artifact filenames, and artifact validation.

It can also capture a direct URL when an application does not expose Vishot capture-root markup.

## How to use

```ts
import { captureBrowserRoots } from '@vishot/renderer-browser'

await captureBrowserRoots({
  outputDir: './screenshots/final',
  routePath: '/',
  sceneAppRoot: './capture/scene-app',
})
```

Or run it through the CLI:

```bash
pnpm exec vishot render \
  --target browser \
  ./capture/scene-app \
  --output-dir ./screenshots/final
```

Pass `rootNames` or repeat `--root` in the CLI to export only selected capture roots.

Capture a direct page:

```ts
import { captureBrowserPage } from '@vishot/renderer-browser'

await captureBrowserPage({
  outputDir: './screenshots/settings',
  settleMs: 1000,
  url: 'http://127.0.0.1:5173/settings',
  viewport: {
    height: 900,
    width: 1440,
  },
})
```

## When to use

- You need final browser-composed screenshots from capture-root DOM regions.
- You need a renderer adapter over the shared Vishot artifact protocol.

## When not to use

- Use `@vishot/source-electron` for raw application screenshots from Electron.
- Keep product scenario logic in the product repository.
