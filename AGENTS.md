# Vishot Agent Guide

Concise reference for contributors working in the Vishot monorepo.

## Project Shape

- `packages/core`: shared capture contracts, artifact helpers, capture-root selectors, and browser ready signals.
- `packages/source-electron`: Playwright Electron source adapter for collecting raw app screenshots.
- `packages/renderer-browser`: Playwright Chromium renderer for exporting final browser-composed capture roots.
- `packages/mockup-desktop-vue`: Vue capture canvas and desktop mockup components, with Histoire stories.

Product-specific scenario automation belongs in the product repository, not in Vishot. Keep AIRI-specific selectors, routes, window names, and docs capture flows out of these packages.

## Commands

- Install: `pnpm install`
- Typecheck: `pnpm typecheck`
- Tests: `pnpm test`
- Lint: `pnpm lint`
- Histoire: `pnpm dev:mockup`

Use pnpm workspace filters for package-scoped work, for example:

```bash
pnpm -F @vishot/core typecheck
pnpm -F @vishot/renderer-browser test:run
pnpm -F @vishot/mockup-desktop-vue story:dev
```

## Development Practices

- Keep shared protocol and artifact behavior in `@vishot/core`.
- Keep renderer/source packages as adapters over `@vishot/core`, not owners of duplicate artifact types.
- Prefer explicit package exports over deep private imports.
- Do not add backward-compatibility guards for unreleased package shapes; update callers during the migration.
- Use `errorMessageFrom(error)` from `@moeru/std` where that dependency is already present.
- Prefer Vue 3 `<script setup lang="ts">` for Vue components.
- Prefer UnoCSS utility class arrays in Vue templates when class lists are non-trivial.

## Testing

- Add focused Vitest coverage when changing capture contracts, filename normalization, CLI parsing, or Vue layout math.
- Keep Playwright-heavy integration tests targeted and opt-in where they need browser/runtime resources.
- Run `pnpm typecheck`, `pnpm test`, and `pnpm lint` before reporting completion.

## Release

- Use Conventional Commits for commit messages.
- Use `pnpm release` for version bump preparation.
- `bump.config.ts` performs a workspace publish dry-run and does not publish automatically.
