---
name: use-vishot
description: Capture deterministic screenshots with the installed Vishot CLI and return a reproducible artifact manifest. Use for UI inspection, visual evidence, documentation images, or screenshot comparison across browser, Electron, and Capacitor applications.
---

# Use Vishot

Use the project's installed `vishot` binary. Keep application-specific routes, selectors, fixtures, window identities, and startup commands in the product repository.

## Workflow

1. Identify each requested state: surface, runtime, viewport or window size, theme, locale, fixture data, interactions, and readiness condition.
2. Reuse product-owned capture roots, fixture routes, and Electron scenarios before creating disposable automation.
3. Select the runtime guidance:
   - Use `$use-vishot-with-web` for browser routes and Vite scene apps.
   - Use `$use-vishot-with-electron` for Electron windows and scenarios.
   - Use `$use-vishot-with-capacitor` for a Capacitor WebView or native-shell evidence.
   - Also use `$use-vishot-with-input-file` when the state depends on a local file.
4. Give Vishot an explicit output directory owned by the caller. Do not invent repository storage or cleanup policy.
5. Keep compared captures deterministic: use the same state, viewport, device scale, theme, locale, fixture data, readiness condition, and output format.
6. Inspect every artifact. Reject blank, loading, error, permission, onboarding, stale, or visibly unstable results unless that is the requested state.
7. Return an explicit manifest rather than relying on directory order:

   ```text
   id: settings-connection
   title: Settings / Connection
   runtime: web
   viewport: 1440x900
   image: /absolute/output/settings-connection.png
   command: pnpm exec vishot render ...
   ```

Record the concrete failure reason instead of an image path when capture cannot complete.

## Contract

- Prefer a repository dependency and `pnpm exec vishot`, `npm exec vishot`, or the project's equivalent so the CLI version is reproducible.
- If Vishot or its required Playwright runtime is missing, report the requirement before changing project dependencies. Installing a browser runtime is acceptable only when the requested capture work authorizes it.
- Use stable IDs and human-readable titles.
- Treat `--settle-ms` as a final stability window, not a replacement for a state-specific ready signal.
- Omit `--name` when the URL or Electron window yields a unique meaningful artifact name. Set it when names would collide or fail to identify the state.
- Return absolute artifact paths and the parameters needed to reproduce the capture.
- Do not claim that a browser capture proves native-shell UI or that a fixed delay proves application readiness.
