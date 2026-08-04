import type { ArtifactTransformer } from '@vishot/core'

export interface BrowserCaptureRequest {
  baseUrl?: string
  imageTransformers?: ArtifactTransformer[]
  outputDir: string
  rootNames?: string[]
  routePath: string
  sceneAppRoot?: string
  settleMs?: number
  viewport?: {
    deviceScaleFactor?: number
    height: number
    width: number
  }
}

/** Direct browser-page capture without Vishot capture-root markup. */
export interface BrowserPageCaptureRequest {
  /** Artifact name override. The URL route supplies the default. */
  artifactName?: string
  /** Capture the complete scrollable document instead of the viewport. @default false */
  fullPage?: boolean
  outputDir: string
  /** Additional delay after page load in milliseconds. @default 0 */
  settleMs?: number
  url: string
  viewport?: {
    deviceScaleFactor?: number
    height: number
    width: number
  }
}
