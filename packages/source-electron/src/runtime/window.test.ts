import type { ElectronApplication, Page } from 'playwright'

import { describe, expect, it, vi } from 'vitest'

import { findWindow } from './window'

function createPage(title: string, url: string): Page {
  return {
    title: vi.fn(async () => title),
    url: vi.fn(() => url),
  } as Partial<Page> as Page
}

describe('findWindow', () => {
  it('uses the first window when no selector is supplied', async () => {
    const page = createPage('AIRI', 'file:///app/index.html#/')
    const electronApp = {
      firstWindow: vi.fn(async () => page),
    } as Partial<ElectronApplication> as ElectronApplication

    await expect(findWindow(electronApp, {})).resolves.toBe(page)
  })

  it('matches both title and URL when supplied', async () => {
    const beatSync = createPage('BeatSync', 'file:///app/beat-sync.html')
    const main = createPage('AIRI', 'file:///app/index.html#/')
    const electronApp = {
      windows: vi.fn(() => [beatSync, main]),
    } as Partial<ElectronApplication> as ElectronApplication

    await expect(findWindow(electronApp, {
      title: 'AIRI',
      url: '#/',
    })).resolves.toBe(main)
  })

  it('reports discovered windows instead of falling back on mismatch', async () => {
    const page = createPage('BeatSync', 'file:///app/beat-sync.html')
    const electronApp = {
      windows: vi.fn(() => [page]),
    } as Partial<ElectronApplication> as ElectronApplication

    await expect(findWindow(electronApp, {
      timeoutMs: 0,
      url: '#/settings',
    })).rejects.toThrow('Discovered windows')
  })
})
