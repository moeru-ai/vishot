import type { ElectronApplication, Page } from 'playwright'

import type { CaptureOptions, ScenarioContext } from './types'

import { capturePage } from './capture'

export function createScenarioContext(
  electronApp: ElectronApplication,
  outputDir: string,
  defaultCaptureOptions?: CaptureOptions,
): ScenarioContext {
  return {
    capture(name: string, page: Page, options?: CaptureOptions) {
      return capturePage(outputDir, name, page, mergeCaptureOptions(defaultCaptureOptions, options))
    },
    electronApp,
    outputDir,
  }
}

function mergeCaptureOptions(defaultOptions?: CaptureOptions, options?: CaptureOptions): CaptureOptions | undefined {
  const transformers = [
    ...(defaultOptions?.transformers ?? []),
    ...(options?.transformers ?? []),
  ]

  if (!defaultOptions && !options) {
    return undefined
  }

  return {
    fullPage: options?.fullPage ?? defaultOptions?.fullPage,
    transformers: transformers.length > 0 ? transformers : undefined,
  }
}
