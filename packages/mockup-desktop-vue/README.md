# `@vishot/mockup-desktop-vue`

Vue capture canvas and desktop mockup components for Vishot.

## What it does

This package provides reusable Vue primitives for building screenshot scenes:

- capture canvas components
- desktop platform shells for macOS and Windows mockups
- scene ready helpers
- screen navigation composables
- capture-root helpers for Vue Router scenes

## How to use

```vue
<script setup lang="ts">
import { markScenarioReady, ScenarioCanvas } from '@vishot/mockup-desktop-vue'

markScenarioReady()
</script>

<template>
  <ScenarioCanvas>
    <!-- screenshot scene -->
  </ScenarioCanvas>
</template>
```

Import narrower entrypoints when a product only needs one surface:

```ts
import { useSceneReady } from '@vishot/mockup-desktop-vue'
import { MacosPlatformRoot } from '@vishot/mockup-desktop-vue/macos'
```

## When to use

- You are composing reusable desktop screenshot scenes in Vue.
- You need generic capture canvas, ready-signal, or desktop shell primitives.

## When not to use

- Do not add product-specific routes, docs walkthroughs, or app selectors here.
- Use the product repository for scenario content and visual narratives.
