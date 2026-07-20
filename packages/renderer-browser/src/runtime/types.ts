import type { ArtifactTransformer } from '@vishot/core'

export interface CaptureBrowserCliArguments {
  renderEntry: string
  outputDir: string
  rootNames: string[]
}

export interface BrowserCaptureRequest {
  sceneAppRoot?: string
  baseUrl?: string
  routePath: string
  outputDir: string
  settleMs?: number
  rootNames?: string[]
  imageTransformers?: ArtifactTransformer[]
  viewport?: {
    width: number
    height: number
    deviceScaleFactor?: number
  }
}
