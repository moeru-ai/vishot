import type { VishotArtifact } from '@vishot/core'
import type { Page } from 'playwright'

import type { CaptureOptions } from './types'

import { mkdir } from 'node:fs/promises'

import { applyArtifactTransformers, artifactFilePath, createImageArtifact } from '@vishot/core'

export async function capturePage(
  outputDir: string,
  name: string,
  page: Page,
  options?: CaptureOptions,
): Promise<VishotArtifact[]> {
  const filePath = artifactFilePath(outputDir, name, 'png')

  await page.waitForLoadState('domcontentloaded')

  if (options?.settleMs && options.settleMs > 0) {
    await page.waitForTimeout(options.settleMs)
    // A Vite reload may start during the settle window. Never capture its transient document.
    await page.waitForLoadState('domcontentloaded')
  }

  await mkdir(outputDir, { recursive: true })
  await page.screenshot({
    animations: 'disabled',
    fullPage: options?.fullPage ?? false,
    path: filePath,
  })

  return applyArtifactTransformers(
    createImageArtifact({
      artifactName: name,
      filePath,
      stage: 'electron-raw',
    }),
    options?.transformers,
  )
}
