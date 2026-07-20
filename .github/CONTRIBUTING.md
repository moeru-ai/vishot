# Contributing to Vishot

Thanks for helping improve Vishot. This repository is a pnpm workspace for reusable screenshot capture sources, browser renderers, and desktop mockup components.

## Prerequisites

- Git
- Node.js 24+
- pnpm through Corepack

```bash
corepack enable
pnpm install
```

## Development

```bash
pnpm typecheck
pnpm test
pnpm lint
pnpm dev:mockup
```

Use workspace filters for focused work:

```bash
pnpm -F @vishot/core test:run
pnpm -F @vishot/source-electron typecheck
pnpm -F @vishot/mockup-desktop-vue story:dev
```

## Package Boundaries

- Put shared artifact contracts and helpers in `@vishot/core`.
- Put Electron source capture behavior in `@vishot/source-electron`.
- Put browser final-render/export behavior in `@vishot/renderer-browser`.
- Put reusable Vue mockup components in `@vishot/mockup-desktop-vue`.
- Keep product-specific scenarios, selectors, routes, and screenshots in the product repository that uses Vishot.

## Pull Requests

- Keep PRs focused.
- Include tests for changed contracts, CLI parsing, filename handling, and non-trivial Vue layout behavior.
- Report the exact verification commands you ran.
- Use Conventional Commits for commit messages.
