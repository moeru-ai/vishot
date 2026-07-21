export type CaptureFormat = 'png' | 'avif'

export interface AvifCaptureOptions {
  maxWidth: number
  quality: number
  speed: number
}

export interface CaptureElectronCliArguments {
  scenarioPath: string
  appEntrypoint: string
  cwd?: string
  outputDir: string
  format: CaptureFormat
  avif?: AvifCaptureOptions
}

export interface CaptureBrowserCliArguments {
  renderEntry: string
  outputDir: string
  rootNames: string[]
}

const DEFAULT_AVIF_MAX_WIDTH = 1920
const DEFAULT_AVIF_QUALITY = 50
const DEFAULT_AVIF_SPEED = 6

export function defaultAvifCaptureOptions(): AvifCaptureOptions {
  return {
    maxWidth: DEFAULT_AVIF_MAX_WIDTH,
    quality: DEFAULT_AVIF_QUALITY,
    speed: DEFAULT_AVIF_SPEED,
  }
}

export function parseCaptureFormat(format: string | undefined): CaptureFormat {
  if (format === undefined || format.length === 0) {
    return 'png'
  }

  if (format === 'png' || format === 'avif') {
    return format
  }

  throw new Error(`Unsupported capture format "${format}". Expected "png" or "avif".`)
}

export function parseAvifCaptureOptions(flags: {
  avifMaxWidth?: string
  avifQuality?: string
  avifSpeed?: string
}): AvifCaptureOptions {
  const maxWidth = flags.avifMaxWidth === undefined
    ? DEFAULT_AVIF_MAX_WIDTH
    : parsePositiveInteger(flags.avifMaxWidth, 'AVIF max width')
  const quality = flags.avifQuality === undefined
    ? DEFAULT_AVIF_QUALITY
    : parsePositiveInteger(flags.avifQuality, 'AVIF quality')
  const speed = flags.avifSpeed === undefined
    ? DEFAULT_AVIF_SPEED
    : parsePositiveInteger(flags.avifSpeed, 'AVIF speed')

  if (maxWidth < 1) {
    throw new Error(`Unsupported AVIF max width "${maxWidth}". Expected an integer >= 1.`)
  }

  if (quality < 0 || quality > 100) {
    throw new Error(`Unsupported AVIF quality "${quality}". Expected an integer between 0 and 100.`)
  }

  if (speed < 1 || speed > 10) {
    throw new Error(`Unsupported AVIF speed "${speed}". Expected an integer between 1 and 10.`)
  }

  return {
    maxWidth,
    quality,
    speed,
  }
}

function parsePositiveInteger(value: string, description: string): number {
  if (!/^\d+$/.test(value)) {
    throw new Error(`Unsupported ${description} "${value}". Expected a whole number.`)
  }

  return Number(value)
}
