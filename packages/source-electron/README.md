# `@vishot/source-electron`

Playwright Electron source capture adapter for Vishot.

## What it does

This package runs Electron capture scenarios and writes raw application screenshots through the shared Vishot artifact protocol. It provides:

- `defineScenario()` for scenario modules
- `loadScenarioModule()` for loading scenario files
- `createScenarioContext()` for capture helpers bound to an Electron app
- `capturePage()` for page screenshots

## How to use

```ts
import { defineScenario } from '@vishot/source-electron'

export default defineScenario({
  id: 'main-window',
  async run(ctx) {
    const page = await ctx.electronApp.firstWindow()
    await ctx.capture('main-window', page)
  },
})
```

Run the scenario through the CLI:

```bash
pnpm exec vishot capture \
  --target electron \
  ./capture/scenario.ts \
  --app-entrypoint ./dist/main.js \
  --output-dir ./screenshots/raw
```

## When to use

- You need to capture screenshots from an Electron application.
- You want scenario code to emit Vishot artifacts.

## When not to use

- Do not put product-specific routes, selectors, or window names in this package.
- Use `@vishot/renderer-browser` when the input is a browser-rendered capture scene.
