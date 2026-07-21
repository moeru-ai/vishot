# `@vishot/renderer-browser`

Playwright Chromium renderer for Vishot capture roots.

## What it does

This package starts a browser rendering flow for a scene entry and exports named capture roots as final image artifacts. It reuses `@vishot/core` for selectors, artifact filenames, and artifact validation.

## How to use

```ts
import { captureBrowserRoots } from '@vishot/renderer-browser'

await captureBrowserRoots({
  outputDir: './screenshots/final',
  routePath: '/',
  sceneAppRoot: './capture/render-entry.ts',
})
```

Or run it through the CLI:

```bash
pnpm exec vishot render \
  --target browser \
  ./capture/render-entry.ts \
  --output-dir ./screenshots/final
```

Pass `rootNames` or repeat `--root` in the CLI to export only selected capture roots.

## When to use

- You need final browser-composed screenshots from capture-root DOM regions.
- You need a renderer adapter over the shared Vishot artifact protocol.

## When not to use

- Use `@vishot/source-electron` for raw application screenshots from Electron.
- Keep product scenario logic in the product repository.
