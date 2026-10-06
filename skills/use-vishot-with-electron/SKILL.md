---
name: use-vishot-with-electron
description: Capture deterministic Electron windows with Vishot. Use when an Electron application must be launched, a semantic window selected, or a product-owned Playwright scenario run before capture.
---

# Use Vishot with Electron

Use `vishot capture --target electron`. Keep product routes, selectors, window classifications, and interaction helpers in the product repository.

## Direct window capture

Use direct capture when startup already produces the requested state:

```bash
pnpm exec vishot capture \
  --target electron \
  --app-entrypoint ./dist/main.js \
  --cwd . \
  --window-url '#/' \
  --settle-ms 1000 \
  --output-dir /absolute/output/main
```

- Select the renderer with `--window-url`, `--window-title`, or both. Omit both only when the first window is intentionally the target.
- Use `--electron-executable` when Playwright cannot discover the product's Electron binary through its package-manager layout.
- Use `--name` when the title or URL would not produce a stable unique artifact name.

## Scenario capture

Use a product-owned scenario when capture requires navigation or state preparation:

```bash
pnpm exec vishot capture \
  --target electron \
  ./capture/settings-scenario.ts \
  --app-entrypoint ./dist/main.js \
  --cwd . \
  --output-dir /absolute/output/settings
```

The scenario imports `defineScenario` from `@vishot/source-electron`, identifies the intended `Page`, prepares product state with Playwright, waits for a state-specific postcondition, and calls `context.capture(name, page)`.

## Window and state invariants

- Do not treat `electronApp.firstWindow()` or the next `window` event as a semantic identity when startup can create splash, onboarding, DevTools, hidden, or auxiliary windows.
- Match windows by stable URL, title, and state-specific visible content. Fail on ambiguity instead of silently capturing a plausible different window.
- Resize the native `BrowserWindow` when the requested dimensions describe the actual Electron window. `page.setViewportSize()` changes renderer metrics but does not resize the native window.
- Treat expanding, auto-hiding, and reused toggle controls as state machines. Check the current state before acting and wait for the intended postcondition.
- Wait for a state-specific condition before the final `--settle-ms` window. A longer fixed delay is not a substitute for readiness.
- Reuse an isolated application profile, locale, theme, data, and window size for captures that will be compared.

Inspect every captured window and return its semantic identity with the absolute artifact path.
