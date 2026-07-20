import { describe, expect, it } from 'vitest'

import { parseCaptureCliArguments } from './capture'

const scenarioPath = './scenarios/settings.ts'
const appEntrypoint = './dist/main.js'
const outputDir = './artifacts/raw'
const usage = 'Usage: vishot-source-electron <scenario.ts> --app-entrypoint <electron-main> --output-dir <dir>'

describe('parseCaptureCliArguments', () => {
  it('accepts a scenario path with required Electron app and output flags', () => {
    expect(parseCaptureCliArguments([
      scenarioPath,
      '--app-entrypoint',
      appEntrypoint,
      '--output-dir',
      outputDir,
    ])).toEqual({
      scenarioPath,
      appEntrypoint,
      outputDir,
      format: 'png',
    })
  })

  it('accepts the -o alias and optional cwd', () => {
    expect(parseCaptureCliArguments([
      scenarioPath,
      '--app-entrypoint',
      appEntrypoint,
      '--cwd',
      './apps/desktop',
      '-o',
      outputDir,
    ])).toEqual({
      scenarioPath,
      appEntrypoint,
      cwd: './apps/desktop',
      outputDir,
      format: 'png',
    })
  })

  it('accepts --output-dir=value', () => {
    expect(parseCaptureCliArguments([
      scenarioPath,
      '--app-entrypoint',
      appEntrypoint,
      `--output-dir=${outputDir}`,
    ])).toEqual({
      scenarioPath,
      appEntrypoint,
      outputDir,
      format: 'png',
    })
  })

  it('accepts an optional --format flag', () => {
    expect(parseCaptureCliArguments([
      scenarioPath,
      '--app-entrypoint',
      appEntrypoint,
      '--output-dir',
      outputDir,
      '--format',
      'avif',
    ])).toEqual({
      scenarioPath,
      appEntrypoint,
      outputDir,
      format: 'avif',
      avif: {
        maxWidth: 1920,
        quality: 50,
        speed: 6,
      },
    })
  })

  it('accepts optional AVIF tuning flags', () => {
    expect(parseCaptureCliArguments([
      scenarioPath,
      '--app-entrypoint',
      appEntrypoint,
      '--output-dir',
      outputDir,
      '--format',
      'avif',
      '--avif-max-width',
      '1200',
      '--avif-quality',
      '35',
      '--avif-speed',
      '4',
    ])).toEqual({
      scenarioPath,
      appEntrypoint,
      outputDir,
      format: 'avif',
      avif: {
        maxWidth: 1200,
        quality: 35,
        speed: 4,
      },
    })
  })

  it('rejects missing scenario path', () => {
    expect(() => parseCaptureCliArguments([
      '--app-entrypoint',
      appEntrypoint,
      '--output-dir',
      outputDir,
    ])).toThrow(usage)
  })

  it('rejects missing app entrypoint', () => {
    expect(() => parseCaptureCliArguments([
      scenarioPath,
      '--output-dir',
      outputDir,
    ])).toThrow(usage)
  })

  it('rejects missing output directory', () => {
    expect(() => parseCaptureCliArguments([
      scenarioPath,
      '--app-entrypoint',
      appEntrypoint,
    ])).toThrow(usage)
  })

  it('rejects unsupported output formats', () => {
    expect(() => parseCaptureCliArguments([
      scenarioPath,
      '--app-entrypoint',
      appEntrypoint,
      '--output-dir',
      outputDir,
      '--format',
      'webp',
    ])).toThrow('Unsupported capture format "webp". Expected "png" or "avif".')
  })

  it('rejects invalid AVIF quality values', () => {
    expect(() => parseCaptureCliArguments([
      scenarioPath,
      '--app-entrypoint',
      appEntrypoint,
      '--output-dir',
      outputDir,
      '--format',
      'avif',
      '--avif-quality',
      '200',
    ])).toThrow('Unsupported AVIF quality "200". Expected an integer between 0 and 100.')
  })

  it('rejects invalid AVIF speed values', () => {
    expect(() => parseCaptureCliArguments([
      scenarioPath,
      '--app-entrypoint',
      appEntrypoint,
      '--output-dir',
      outputDir,
      '--format',
      'avif',
      '--avif-speed',
      '0',
    ])).toThrow('Unsupported AVIF speed "0". Expected an integer between 1 and 10.')
  })

  it('rejects invalid AVIF max width values', () => {
    expect(() => parseCaptureCliArguments([
      scenarioPath,
      '--app-entrypoint',
      appEntrypoint,
      '--output-dir',
      outputDir,
      '--format',
      'avif',
      '--avif-max-width',
      '0',
    ])).toThrow('Unsupported AVIF max width "0". Expected an integer >= 1.')
  })

  it('rejects extra positional arguments', () => {
    expect(() => parseCaptureCliArguments([
      scenarioPath,
      './scenarios/chat.ts',
      '--app-entrypoint',
      appEntrypoint,
      '--output-dir',
      outputDir,
    ])).toThrow(usage)
  })
})
