export type VishotArtifactKind = 'image'
export type VishotArtifactStage = 'browser-final' | 'electron-raw'

export interface VishotArtifact {
  kind: VishotArtifactKind
  stage: VishotArtifactStage
  artifactName: string
  filePath: string
  format: string
  metadata?: Record<string, unknown>
}

export type ArtifactTransformer = (
  artifact: VishotArtifact,
) => Promise<VishotArtifact | VishotArtifact[]>
