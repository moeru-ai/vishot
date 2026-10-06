---
name: use-vishot-with-input-file
description: Prepare and capture a deterministic UI state that depends on selecting a local file. Use with Vishot when an Electron scenario, fixture route, or scene app must represent an import, upload, or open-file workflow.
---

# Use Vishot with an Input File

Keep private paths out of reusable source. Pass the absolute input path through an environment variable or command argument, verify it exists, and wait for a file-specific postcondition before capture.

## Electron scenario

Electron scenarios can drive a file chooser through the Playwright `Page` exposed by Vishot:

```ts
const inputFile = process.env.VISHOT_INPUT_FILE
if (!inputFile)
  throw new Error('VISHOT_INPUT_FILE is required')

const [fileChooser] = await Promise.all([
  page.waitForEvent('filechooser'),
  page.getByRole('menuitem', { name: 'Import' }).click(),
])

await fileChooser.setFiles(inputFile)
await page.getByText(path.basename(inputFile), { exact: true })
  .waitFor({ state: 'visible' })
await context.capture('imported-file', page)
```

Use `locator.setInputFiles(inputFile)` when the product exposes a stable `<input type="file">`. Start waiting for `filechooser` before clicking a control that creates the input lazily.

## Browser boundary

`vishot render` captures a direct URL or a Vite capture-root app; it does not currently execute an arbitrary browser interaction scenario. For browser file-input states, use one of these product-owned approaches:

- expose a deterministic fixture route or scene app that renders the post-import state;
- seed the parsed fixture data through a supported query, local store, or fixture adapter before page load;
- use separate browser automation when the user requested the real file chooser flow, and identify that artifact as external to Vishot rather than claiming Vishot performed the interaction.

Do not add production-only bypasses merely to create a screenshot.

## Readiness and privacy

- Wait for a postcondition tied to the selected file: displayed basename, imported record ID, parsed preview, or active renderer.
- If import does not activate the item, select it and wait for the destination surface before capture.
- Reject a default, unchanged, parsing, or loading view as a failed file-input scenario.
- Do not put private filenames or paths in scenario IDs, artifact names, tests, logs, or committed source.
- Return only the artifact path and non-sensitive fixture description needed to reproduce the state.
