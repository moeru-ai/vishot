---
name: use-vishot-with-capacitor
description: Capture deterministic Capacitor application surfaces with Vishot while distinguishing browser-rendered WebView evidence from native-shell evidence. Use for mobile routes, responsive states, or Capacitor UI verification.
---

# Use Vishot with Capacitor

Capture the locally served WebView with Vishot by default. Add separate platform-native evidence only when the requested behavior depends on the native shell.

## WebView capture

1. Identify the route, platform mode, orientation, viewport, theme, locale, fixture data, and output directory.
2. Start the product's local web development or preview command and wait until it is listening.
3. Make the requested state reproducible at load time through a fixture route, query, seeded storage, or scene app.
4. Follow `$use-vishot-with-web` and capture at the requested mobile viewport:

   ```bash
   pnpm exec vishot render \
     --target browser \
     http://127.0.0.1:5173/settings \
     --width 390 \
     --height 844 \
     --settle-ms 1000 \
     --output-dir /absolute/output/settings
   ```

5. Inspect the artifact for mobile navigation, sheets, onboarding, loading indicators, permission explanations, responsive overflow, fonts, and safe-area simulations owned by the web app.

Desktop text and controls may be hidden, renamed, or moved at mobile dimensions. Readiness conditions must match the rendered mobile state rather than a desktop assumption.

## Native evidence boundary

A browser capture does not verify status bars, native safe-area application, system permission sheets, native keyboards, camera views, plugins, or other platform-owned UI.

When native behavior is material:

- Use an already configured simulator or device and the repository's platform command.
- Capture native evidence with the platform's screenshot facility.
- Do not install a mobile automation framework or select a new native dependency unless the user requested that expansion.
- Report native evidence as unavailable when the required platform toolchain is absent. Do not relabel WebView evidence as native evidence.

Return the platform mode, viewport or device, orientation, and evidence type with every artifact.
