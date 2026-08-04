export { captureBrowserPage, captureBrowserRoots } from './runtime/capture'
export type {
  BrowserCaptureRequest,
  BrowserPageCaptureRequest,
} from './runtime/types'
export { applyArtifactTransformers, artifactFilePath, assertArtifactFilesExist, assertUniqueArtifactFilePaths, assertUniqueCaptureFilePaths, captureNameFromUrl, captureRootSelector, createImageArtifact, sanitizeOutputName } from '@vishot/core'
export type { ArtifactTransformer, VishotArtifact, VishotArtifactKind, VishotArtifactStage } from '@vishot/core'
