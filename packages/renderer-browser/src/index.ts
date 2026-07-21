export { captureBrowserRoots } from './runtime/capture'
export type {
  BrowserCaptureRequest,
} from './runtime/types'
export { applyArtifactTransformers, artifactFilePath, assertArtifactFilesExist, assertUniqueArtifactFilePaths, assertUniqueCaptureFilePaths, captureRootSelector, createImageArtifact, sanitizeOutputName } from '@vishot/core'
export type { ArtifactTransformer, VishotArtifact, VishotArtifactKind, VishotArtifactStage } from '@vishot/core'
