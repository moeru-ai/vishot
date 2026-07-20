import type { ArtifactTransformer, VishotArtifact } from '@vishot/core'

import type { ElectronApplication, Page } from 'playwright'

export interface CaptureOptions {
  fullPage?: boolean
  transformers?: ArtifactTransformer[]
}

/**
 * Runtime context exposed to Electron source scenarios.
 *
 * Vishot intentionally exposes the raw Playwright Electron application instead
 * of product-specific helpers. Product repositories can layer their own window
 * classification and navigation helpers around this generic capture boundary.
 */
export interface ScenarioContext {
  electronApp: ElectronApplication
  outputDir: string
  capture: (name: string, page: Page, options?: CaptureOptions) => Promise<VishotArtifact[]>
}

export interface ElectronScenario {
  id: string
  run: (context: ScenarioContext) => Promise<void>
}
