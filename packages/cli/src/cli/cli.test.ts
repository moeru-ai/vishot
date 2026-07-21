import { describe, expect, it } from 'vitest'

import { executeCli, parseCaptureBrowserCliArguments, parseCaptureElectronCliArguments } from './cli'

const scenarioPath = './scenarios/settings.ts'
const appEntrypoint = './dist/main.js'
const outputDir = './artifacts/raw'

describe('unified vishot cli argument parsing', () => {
  it('parses Electron capture commands by target', () => {
    expect(parseCaptureElectronCliArguments([
      '--target',
      'electron',
      scenarioPath,
      '--app-entrypoint',
      appEntrypoint,
      '--cwd',
      './apps/desktop',
      '-o',
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
      cwd: './apps/desktop',
      outputDir,
      format: 'avif',
      avif: {
        maxWidth: 1200,
        quality: 35,
        speed: 4,
      },
    })
  })

  it('parses browser render commands by target', () => {
    expect(parseCaptureBrowserCliArguments([
      '--target',
      'browser',
      'src/scenes/intro.ts',
      '-o',
      './artifacts/browser-run',
      '--root',
      'intro-desktop',
      '--root',
      'intro-settings',
    ])).toEqual({
      renderEntry: 'src/scenes/intro.ts',
      outputDir: './artifacts/browser-run',
      rootNames: ['intro-desktop', 'intro-settings'],
    })
  })

  it('uses unified command names in validation errors', () => {
    expect(() => parseCaptureElectronCliArguments([
      '--target',
      'electron',
      scenarioPath,
      '--app-entrypoint',
      appEntrypoint,
    ])).toThrow('Usage: vishot capture --target electron <scenario.ts> --app-entrypoint <electron-main> --output-dir <dir>')

    expect(() => parseCaptureBrowserCliArguments([
      '--target',
      'browser',
      'src/scenes/intro.ts',
    ])).toThrow('Usage: vishot render --target browser <render-entry> --output-dir <dir>')
  })

  it('rejects mismatched targets', () => {
    expect(() => parseCaptureElectronCliArguments([
      '--target',
      'browser',
      scenarioPath,
      '--app-entrypoint',
      appEntrypoint,
      '--output-dir',
      outputDir,
    ])).toThrow('Unsupported capture target "browser". Expected "electron".')

    expect(() => parseCaptureBrowserCliArguments([
      '--target',
      'electron',
      'src/scenes/intro.ts',
      '--output-dir',
      './artifacts/browser-run',
    ])).toThrow('Unsupported render target "electron". Expected "browser".')
  })
})

describe('executeCli', () => {
  it('prints the package version without invoking command dispatch', async () => {
    const stdout: string[] = []
    const stderr: string[] = []

    await expect(executeCli(['node', 'vishot', '--version'], {
      cwd: process.cwd(),
      stdout: { write: message => stdout.push(message) },
      stderr: { write: message => stderr.push(message) },
    })).resolves.toBe(0)

    expect(stdout).toEqual(['0.0.0\n'])
    expect(stderr).toEqual([])
  })

  it('reports unknown top-level commands', async () => {
    const stdout: string[] = []
    const stderr: string[] = []

    await expect(executeCli(['node', 'vishot', 'unknown'], {
      cwd: process.cwd(),
      stdout: { write: message => stdout.push(message) },
      stderr: { write: message => stderr.push(message) },
    })).resolves.toBe(2)

    expect(stdout).toEqual([])
    expect(stderr).toEqual(['unknown command: unknown\n'])
  })
})
