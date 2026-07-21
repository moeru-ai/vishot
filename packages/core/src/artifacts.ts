import type { ArtifactTransformer, VishotArtifact, VishotArtifactStage } from './types'

export async function applyArtifactTransformers(
  artifact: VishotArtifact,
  transformers: ArtifactTransformer[] | undefined,
): Promise<VishotArtifact[]> {
  let currentArtifacts: VishotArtifact[] = [artifact]

  for (const transformer of transformers ?? []) {
    const nextArtifacts: VishotArtifact[] = []

    for (const currentArtifact of currentArtifacts) {
      const transformed = await transformer(currentArtifact)
      nextArtifacts.push(...(Array.isArray(transformed) ? transformed : [transformed]))
    }

    currentArtifacts = nextArtifacts
  }

  return currentArtifacts
}

export function createImageArtifact(options: {
  artifactName: string
  filePath: string
  metadata?: Record<string, unknown>
  stage: VishotArtifactStage
}): VishotArtifact {
  return {
    artifactName: options.artifactName,
    filePath: options.filePath,
    format: 'png',
    kind: 'image',
    metadata: options.metadata,
    stage: options.stage,
  }
}
