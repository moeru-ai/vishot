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
