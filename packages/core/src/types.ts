export type ArtifactTransformer = (
  artifact: VishotArtifact,
) => Promise<VishotArtifact | VishotArtifact[]>
export interface VishotArtifact {
  artifactName: string
  filePath: string
  format: string
  kind: VishotArtifactKind
  metadata?: Record<string, unknown>
  stage: VishotArtifactStage
}

export type VishotArtifactKind = 'image'

export type VishotArtifactStage = 'browser-final' | 'electron-raw'
