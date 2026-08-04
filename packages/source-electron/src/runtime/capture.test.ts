import type { Page } from 'playwright'

import path from 'node:path'

import { mkdtemp, rm } from 'node:fs/promises'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { capturePage } from './capture'

const cleanupDirectories = new Set<string>()

afterEach(async () => {
  await Promise.all(Array.from(cleanupDirectories, async (directory) => {
    await rm(directory, { force: true, recursive: true })
    cleanupDirectories.delete(directory)
  }))
})

describe('capturePage', () => {
  it('waits for renderer readiness before and after the stability window', async () => {
    const outputDir = await mkdtemp(path.join(process.cwd(), '.tmp-electron-capture-'))
    cleanupDirectories.add(outputDir)

    const screenshot = vi.fn(async () => {})
    const waitForLoadState = vi.fn(async () => {})
    const waitForTimeout = vi.fn(async () => {})
    const page = {
      screenshot,
      waitForLoadState,
      waitForTimeout,
    } as unknown as Page

    await capturePage(outputDir, 'main-window', page, {
      settleMs: 10000,
    })

    expect(waitForLoadState).toHaveBeenNthCalledWith(1, 'domcontentloaded')
    expect(waitForTimeout).toHaveBeenCalledWith(10000)
    expect(waitForLoadState).toHaveBeenNthCalledWith(2, 'domcontentloaded')
    expect(waitForLoadState.mock.invocationCallOrder[0]).toBeLessThan(waitForTimeout.mock.invocationCallOrder[0])
    expect(waitForTimeout.mock.invocationCallOrder[0]).toBeLessThan(waitForLoadState.mock.invocationCallOrder[1])
    expect(waitForLoadState.mock.invocationCallOrder[1]).toBeLessThan(screenshot.mock.invocationCallOrder[0])
  })
})
