import { beforeEach, describe, expect, it, vi } from 'vitest'

import packageJSON from '../../package.json'

import { executeCli, parseCaptureBrowserCliArguments, parseCaptureElectronCliArguments } from './cli'

const captureBrowserPage = vi.hoisted(() => vi.fn(async () => ({
  artifactName: 'settings',
  filePath: '/tmp/settings.png',
  format: 'png',
  kind: 'image' as const,
  stage: 'browser-final' as const,
})))

vi.mock('@vishot/renderer-browser', () => ({
  captureBrowserPage,
  captureBrowserRoots: vi.fn(async () => []),
}))

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
      appEntrypoint,
      avif: {
        maxWidth: 1200,
        quality: 35,
        speed: 4,
      },
      cwd: './apps/desktop',
      format: 'avif',
      outputDir,
      scenarioPath,
      settleMs: 0,
    })
  })

  it('parses built-in Electron window captures without a scenario module', () => {
    expect(parseCaptureElectronCliArguments([
      '--target',
      'electron',
      '--app-entrypoint',
      appEntrypoint,
      '--window-url',
      '#/',
      '--window-title',
      'AIRI',
      '--electron-executable',
      './node_modules/electron',
      '--name',
      'main-window',
      '--settle-ms',
      '800',
      '--output-dir',
      outputDir,
    ])).toEqual({
      appEntrypoint,
      captureName: 'main-window',
      electronExecutable: './node_modules/electron',
      format: 'png',
      outputDir,
      settleMs: 800,
      windowTitle: 'AIRI',
      windowUrl: '#/',
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
      '--width',
      '1440',
      '--height',
      '900',
      '--settle-ms',
      '500',
    ])).toEqual({
      fullPage: false,
      height: 900,
      outputDir: './artifacts/browser-run',
      renderEntry: 'src/scenes/intro.ts',
      rootNames: ['intro-desktop', 'intro-settings'],
      settleMs: 500,
      width: 1440,
    })
  })

  it('parses direct browser page capture options', () => {
    expect(parseCaptureBrowserCliArguments([
      '--target',
      'browser',
      'http://127.0.0.1:5173/settings',
      '--width',
      '390',
      '--height',
      '844',
      '--settle-ms',
      '1000',
      '--name',
      'pocket-settings',
      '--output-dir',
      outputDir,
      '--full-page',
    ])).toEqual({
      captureName: 'pocket-settings',
      fullPage: true,
      height: 844,
      outputDir,
      renderEntry: 'http://127.0.0.1:5173/settings',
      rootNames: [],
      settleMs: 1000,
      width: 390,
    })
  })

  it('uses unified command names in validation errors', () => {
    expect(() => parseCaptureElectronCliArguments([
      '--target',
      'electron',
      scenarioPath,
      '--app-entrypoint',
      appEntrypoint,
      '--settle-ms',
      '-1',
      '--output-dir',
      outputDir,
    ])).toThrow('Unsupported settle duration')

    expect(() => parseCaptureBrowserCliArguments([
      '--target',
      'browser',
    ])).toThrow('Usage: vishot render --target browser <scene-root-or-url> --output-dir <dir>')
  })

  it('rejects invalid direct browser dimensions', () => {
    expect(() => parseCaptureBrowserCliArguments([
      '--target',
      'browser',
      'http://127.0.0.1:5173/settings',
      '--output-dir',
      outputDir,
      '--width',
      '0',
    ])).toThrow('Unsupported browser width "0". Expected an integer >= 1.')

    expect(() => parseCaptureBrowserCliArguments([
      '--target',
      'browser',
      'http://127.0.0.1:5173/settings',
      '--output-dir',
      outputDir,
      '--height',
      '900.5',
    ])).toThrow('Unsupported browser height "900.5". Expected a whole number.')
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
  beforeEach(() => {
    captureBrowserPage.mockClear()
  })

  it('prints the package version without invoking command dispatch', async () => {
    const stdout: string[] = []
    const stderr: string[] = []

    await expect(executeCli(['node', 'vishot', '--version'], {
      cwd: process.cwd(),
      stderr: { write: message => stderr.push(message) },
      stdout: { write: message => stdout.push(message) },
    })).resolves.toBe(0)

    expect(stdout).toEqual([`${packageJSON.version}\n`])
    expect(stderr).toEqual([])
  })

  it('reports unknown top-level commands', async () => {
    const stdout: string[] = []
    const stderr: string[] = []

    await expect(executeCli(['node', 'vishot', 'unknown'], {
      cwd: process.cwd(),
      stderr: { write: message => stderr.push(message) },
      stdout: { write: message => stdout.push(message) },
    })).resolves.toBe(2)

    expect(stdout).toEqual([])
    expect(stderr).toEqual(['unknown command: unknown\n'])
  })

  it('preserves numeric browser options parsed by cac', async () => {
    const stdout: string[] = []
    const stderr: string[] = []

    await expect(executeCli([
      'node',
      'vishot',
      'render',
      '--target',
      'browser',
      'http://127.0.0.1:5173/settings',
      '--width',
      '1440',
      '--height',
      '900',
      '--settle-ms',
      '500',
      '--output-dir',
      '/workspace/project/screenshots/settings',
    ], {
      cwd: '/workspace/project',
      stderr: { write: message => stderr.push(message) },
      stdout: { write: message => stdout.push(message) },
    })).resolves.toBe(0)

    expect(captureBrowserPage).toHaveBeenCalledWith(expect.objectContaining({
      settleMs: 500,
      viewport: {
        height: 900,
        width: 1440,
      },
    }))
    expect(stdout).toEqual([])
    expect(stderr).toEqual([])
  })
})
