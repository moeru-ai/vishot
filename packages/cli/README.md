# Vishot

Composable screenshot tooling for source capture, browser rendering, and desktop mockup composition.

Vishot separates screenshot production into reusable source adapters, browser renderers, and mockup primitives. Product-specific scenario automation belongs in the product repository. Vishot owns shared capture protocols, artifact behavior, renderers, and generic visual shells.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Installation and Usage](#installation-and-usage)
- [Concepts](#concepts)
- [Packages](#packages)
- [Documentation Automation](#documentation-automation)
- [Development](#development)
- [Status](#status)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation and Usage

Install the CLI in a project that owns screenshot scenarios:

```bash
pnpm add -D @vishot/cli
```

Use `vishot capture` when a scenario needs to collect source screenshots from a running application. The Electron adapter launches the application through Playwright Electron and writes raw capture artifacts:

```bash
pnpm exec vishot capture \
  --target electron \
  ./capture/scenario.ts \
  --app-entrypoint ./dist/main.js \
  --output-dir ./screenshots/raw
```

Use `vishot render` when a browser render entry exposes Vishot capture roots and needs final composed artifacts:

```bash
pnpm exec vishot render \
  --target browser \
  ./capture/render-entry.ts \
  --output-dir ./screenshots/final
```

Filter browser capture roots by name when a render entry exposes multiple outputs:

```bash
pnpm exec vishot render \
  --target browser \
  ./capture/render-entry.ts \
  --output-dir ./screenshots/final \
  --root hero \
  --root settings
```

## Concepts

Vishot keeps capture concerns split across a small protocol:

- **Source capture** collects raw screenshots from an application runtime.
- **Capture roots** mark browser-rendered DOM regions that should be exported as final artifacts.
- **Ready signals** let scenarios and renderers wait until a scene is stable before taking screenshots.
- **Artifacts** describe generated files with kind, stage, format, dimensions, and paths.
- **Mockup primitives** provide reusable Vue components for desktop screenshots without owning product routes or product-specific selectors.

Keep application routes, window names, walkthroughs, and AIRI-specific automation outside this repository. Put that logic in the product repository and depend on Vishot packages for the reusable pieces.

## Packages

- `@vishot/cli`: unified command line interface for source capture and browser rendering.
- `@vishot/core`: shared artifact contracts, capture-root selectors, ready signals, and file helpers.
- `@vishot/source-electron`: Playwright Electron source capture for raw application screenshots.
- `@vishot/renderer-browser`: Playwright Chromium renderer for final browser-composed image artifacts.
- `@vishot/mockup-desktop-vue`: Vue components for capture canvases and desktop mockup shells.

## Documentation Automation

The table of contents above is generated with `doctoc` so README navigation is not hand-written. Run this after changing root README headings:

```bash
pnpm docs:update
```

`docs:update` refreshes the root README TOC and then copies the root README to `packages/cli/README.md`, keeping the npm README for `@vishot/cli` in sync with the project overview.

Package-specific READMEs live next to their packages and are maintained independently.

## Development

Install dependencies:

```bash
pnpm install
```

Run repository checks:

```bash
pnpm typecheck
pnpm test
pnpm lint
```

Use workspace filters for package-scoped work:

```bash
pnpm -F @vishot/core typecheck
pnpm -F @vishot/renderer-browser test:run
pnpm -F @vishot/mockup-desktop-vue story:dev
```

Build all packages:

```bash
pnpm build
```

## Status

Vishot packages are early and may change while the capture protocol settles.

## License

MIT
