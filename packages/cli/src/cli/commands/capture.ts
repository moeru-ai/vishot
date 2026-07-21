import type { ArtifactTransformer } from '@vishot/core'

import type { CaptureElectronCliArguments } from '../capture-options'

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { Transformer } from '@napi-rs/image'
import { createScenarioContext, loadScenarioModule } from '@vishot/source-electron'
import { _electron as electron } from 'playwright'

import { defaultAvifCaptureOptions, parseAvifCaptureOptions, parseCaptureFormat } from '../capture-options'
import { parseStringOption } from '../options'
import { defineCommand } from './command'

export const electronCaptureUsageMessage = 'Usage: vishot capture --target electron <scenario.ts> --app-entrypoint <electron-main> --output-dir <dir>'

export const capture = defineCommand({
  name: 'capture',
  description: 'Capture screenshots from an application source target.',
  arguments: '<scenario.ts>',
  options: [
    {
      flags: '--target <target>',
      description: 'Capture target: electron',
    },
    {
      flags: '--app-entrypoint <path>',
      description: 'Electron main entrypoint passed to Playwright Electron',
    },
    {
      flags: '--cwd <path>',
      description: 'Working directory for the Electron process',
    },
    {
      flags: '-o, --output-dir <dir>',
      description: 'Directory to write capture output into',
    },
    {
      flags: '--format <format>',
      description: 'Output format: png or avif',
    },
    {
      flags: '--avif-max-width <px>',
      description: 'Max width for AVIF output',
    },
    {
      flags: '--avif-quality <quality>',
      description: 'AVIF quality between 0-100',
    },
    {
      flags: '--avif-speed <speed>',
      description: 'AVIF speed between 1-10',
    },
  ],
  action: async (context, scenarioPath, options) => {
    await runCaptureElectron(parseCaptureElectronCliArgumentsFromOptions(scenarioPath, options), context.io.cwd)
    return 0
  },
})

export function parseCaptureElectronCliArguments(argv: string[]): CaptureElectronCliArguments {
  const { input, flags } = parseArgv(argv)
  return parseCaptureElectronCliArgumentsFromOptions(input[0], flags, input.length)
}

async function runCaptureElectron(options: CaptureElectronCliArguments, commandCwd: string): Promise<void> {
  const resolvedCwd = options.cwd ? path.resolve(commandCwd, options.cwd) : commandCwd
  const resolvedAppEntrypoint = path.resolve(resolvedCwd, options.appEntrypoint)
  const resolvedOutputDir = path.resolve(commandCwd, options.outputDir)

  await mkdir(resolvedOutputDir, { recursive: true })

  const loadedScenario = await loadScenarioModule(options.scenarioPath)

  const electronApp = await electron.launch({
    args: [resolvedAppEntrypoint],
    cwd: resolvedCwd,
  })

  try {
    const context = createScenarioContext(
      electronApp,
      resolvedOutputDir,
      options.format === 'avif'
        ? {
            transformers: [createAvifTransformer(options.avif ?? defaultAvifCaptureOptions())],
          }
        : undefined,
    )
    await loadedScenario.scenario.run(context)
  }
  finally {
    await electronApp.close()
  }
}

function createAvifTransformer(options: NonNullable<CaptureElectronCliArguments['avif']>): ArtifactTransformer {
  return async (artifact) => {
    const derivedFilePath = artifact.filePath.replace(/\.png$/i, '.avif')

    const transformer = new Transformer(await readFile(artifact.filePath))
    const metadata = await transformer.metadata()

    if (metadata.width > options.maxWidth) {
      const scale = options.maxWidth / metadata.width
      transformer.resize(options.maxWidth, Math.round(metadata.height * scale))
    }

    const avifBuffer = await transformer.avif({
      quality: options.quality,
      speed: options.speed,
    })

    await writeFile(derivedFilePath, avifBuffer)
    await rm(artifact.filePath, { force: true })

    return {
      ...artifact,
      filePath: derivedFilePath,
      format: 'avif',
    }
  }
}

function parseCaptureElectronCliArgumentsFromOptions(
  scenarioPath: unknown,
  options: unknown,
  inputLength = 1,
): CaptureElectronCliArguments {
  const flags = options as Record<string, unknown>
  const appEntrypoint = parseStringOption(flags.appEntrypoint)
  const outputDir = parseStringOption(flags.outputDir)
  const target = parseStringOption(flags.target)

  if (target !== undefined && target !== 'electron') {
    throw new Error(`Unsupported capture target "${target}". Expected "electron".`)
  }

  if (inputLength !== 1
    || typeof scenarioPath !== 'string'
    || scenarioPath.length === 0
    || target === undefined
    || appEntrypoint === undefined
    || outputDir === undefined) {
    throw new Error(electronCaptureUsageMessage)
  }

  const format = parseCaptureFormat(parseStringOption(flags.format))

  return {
    scenarioPath,
    appEntrypoint,
    cwd: parseStringOption(flags.cwd),
    outputDir,
    format,
    avif: format === 'avif'
      ? parseAvifCaptureOptions({
          avifMaxWidth: parseStringOption(flags.avifMaxWidth),
          avifQuality: parseStringOption(flags.avifQuality),
          avifSpeed: parseStringOption(flags.avifSpeed),
        })
      : undefined,
  }
}

function parseArgv(argv: readonly string[]): { flags: Record<string, unknown>, input: string[] } {
  const flags: Record<string, unknown> = {}
  const input: string[] = []

  for (let index = argv[0] === '--' ? 1 : 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '-o') {
      flags.outputDir = argv[index + 1]
      index += 1
    }
    else if (arg?.startsWith('--')) {
      const [rawKey, inlineValue] = arg.slice(2).split('=', 2)
      const key = rawKey.replace(/-([a-z])/gu, (_, letter: string) => letter.toUpperCase())
      flags[key] = inlineValue ?? argv[index + 1]
      if (inlineValue === undefined) {
        index += 1
      }
    }
    else if (arg !== undefined) {
      input.push(arg)
    }
  }

  return { flags, input }
}
