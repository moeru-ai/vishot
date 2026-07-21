# `@vishot/core`

Shared capture contracts and artifact helpers for Vishot.

## What it does

This package owns the reusable protocol shared by source adapters, renderers, and mockup packages:

- artifact types and image artifact creation
- artifact file path normalization and uniqueness checks
- capture-root selector generation
- browser ready signals
- artifact transformer sequencing

## How to use

```ts
import { captureRootSelector, markScenarioReady } from '@vishot/core'
import { createImageArtifact } from '@vishot/core/artifacts'
```

Use `captureRootSelector(name)` to mark DOM regions for browser export, and `markScenarioReady()` when a scene has finished layout, navigation, and data loading.

## When to use

- You are writing a Vishot source adapter or renderer.
- You need stable artifact metadata or filename behavior.
- You need shared capture-root or ready-signal helpers.

## When not to use

- Use `@vishot/cli` for command-line capture workflows.
- Use a source or renderer package when you need runtime-specific Playwright behavior.
