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
