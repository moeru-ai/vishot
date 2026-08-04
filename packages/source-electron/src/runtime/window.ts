import type { ElectronApplication, Page } from 'playwright'

/** Selects an Electron renderer window without assuming product-specific routes or titles. */
export interface ElectronWindowSelector {
  /** Maximum discovery time in milliseconds. @default 10000 */
  timeoutMs?: number
  /** Required substring of the document title. */
  title?: string
  /** Required substring of the renderer URL. */
  url?: string
}

/**
 * Waits for an Electron window matching every supplied selector.
 *
 * When neither title nor URL is supplied, this preserves Playwright's natural
 * first-window behavior. A requested selector never falls back silently.
 */
export async function findWindow(
  electronApp: ElectronApplication,
  selector: ElectronWindowSelector,
): Promise<Page> {
  if (!selector.title && !selector.url) {
    return electronApp.firstWindow()
  }

  const timeoutMs = selector.timeoutMs ?? 10000
  const startedAt = Date.now()

  while (Date.now() - startedAt <= timeoutMs) {
    for (const page of electronApp.windows()) {
      const snapshot = await windowSnapshot(page)

      if (snapshot
        && (!selector.title || snapshot.title.includes(selector.title))
        && (!selector.url || snapshot.url.includes(selector.url))) {
        return page
      }
    }

    await new Promise(resolve => setTimeout(resolve, 100))
  }

  const discoveredWindows = (await Promise.all(electronApp.windows().map(windowSnapshot)))
    .filter(snapshot => snapshot !== undefined)

  throw new Error(
    `No Electron window matched title=${JSON.stringify(selector.title)} url=${JSON.stringify(selector.url)}. Discovered windows: ${JSON.stringify(discoveredWindows)}`,
  )
}

async function windowSnapshot(page: Page): Promise<undefined | { title: string, url: string }> {
  try {
    return {
      title: await page.title(),
      url: page.url(),
    }
  }
  catch {
    // Windows may close while Electron is still creating its stable renderer set.
    return undefined
  }
}
