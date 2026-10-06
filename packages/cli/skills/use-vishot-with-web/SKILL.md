---
name: use-vishot-with-web
description: Capture deterministic browser routes or Vite capture roots with Vishot. Use when a locally runnable web surface can reach the requested state at load time or through product-owned fixture routes and scene apps.
---

# Use Vishot with Web

Use `vishot render --target browser` for local web content. Choose between direct URL capture and a Vite scene app based on how the product exposes the state.

## Direct URL capture

Use a local URL when the requested state is available at page load:

```bash
pnpm exec vishot render \
  --target browser \
  http://127.0.0.1:5173/settings \
  --width 1440 \
  --height 900 \
  --settle-ms 1000 \
  --output-dir /absolute/output/settings
```

- Use `--full-page` only when the complete scrollable document is the intended artifact.
- Use `--name` when the URL-derived name is ambiguous or collides with another state.
- Direct URL capture does not perform interactions. Do not describe a clicked, uploaded, authenticated, or otherwise prepared state as Vishot-reproducible unless the product exposes that state deterministically at load time.

## Capture-root rendering

Use a Vite scene app when the repository exposes `[data-scenario-capture-root]` surfaces:

```bash
pnpm exec vishot render \
  --target browser \
  ./capture/scene-app \
  --root settings \
  --output-dir /absolute/output/final
```

Omit `--root` to export every capture root. A scene app owns its routes, fixture data, interactions, and ready signal; Vishot owns rendering and artifact output.

## Readiness and inspection

1. Start the repository-owned development, preview, or fixture server and wait until it is listening.
2. Make the requested state deterministic with a fixture route, query, seeded storage, or capture-root scene owned by the product.
3. Use a state-specific visible condition or Vishot ready signal before the final settle window. Server readiness alone does not prove UI readiness.
4. When fonts affect layout, wait for `document.fonts.ready` in the product's readiness logic.
5. Inspect the result for missing styles or fonts, transient overlays, stale network data, animation, iframe refusal, and incorrect responsive state.

Keep the target local. Do not use this workflow to navigate or capture an untrusted remote page.
