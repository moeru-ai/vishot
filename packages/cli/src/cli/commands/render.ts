import type { CaptureBrowserCliArguments } from '../capture-options'

import path from 'node:path'

import { captureBrowserPage, captureBrowserRoots } from '@vishot/renderer-browser'

import { DEFAULT_BROWSER_HEIGHT, DEFAULT_BROWSER_WIDTH, parseNonNegativeIntegerOption, parsePositiveIntegerOption } from '../capture-options'
import { parseBooleanOption, parseRepeatedStringOption, parseStringOption } from '../options'
import { defineCommand } from './command'

export const browserCaptureUsageMessage = 'Usage: vishot render --target browser <scene-root-or-url> --output-dir <dir>'

export const render = defineCommand({
  action: async (context, renderEntry, options) => {
    await runCaptureBrowser(parseCaptureBrowserCliArgumentsFromOptions(renderEntry, options), context.io.cwd)
    return 0
  },
  arguments: '<render-entry>',
  description: 'Render capture roots with a renderer target.',
  name: 'render',
  options: [
    {
      description: 'Render target: browser',
      flags: '--target <target>',
    },
    {
      description: 'Directory to write browser capture output into',
      flags: '-o, --output-dir <dir>',
    },
    {
      description: 'Artifact name override for direct URL capture',
      flags: '--name <name>',
    },
    {
      description: 'Browser viewport width in CSS pixels',
      flags: '--width <px>',
    },
    {
      description: 'Browser viewport height in CSS pixels',
      flags: '--height <px>',
    },
    {
      description: 'Delay after page or scenario readiness in milliseconds',
      flags: '--settle-ms <ms>',
    },
    {
      description: 'Capture the complete scrollable page for direct URLs',
      flags: '--full-page',
    },
    {
      description: 'Named capture root to export; may be repeated',
      flags: '--root <name>',
    },
  ],
})

export function parseCaptureBrowserCliArguments(argv: string[]): CaptureBrowserCliArguments {
  const { flags, input } = parseArgv(argv)
  return parseCaptureBrowserCliArgumentsFromOptions(input[0], flags, input.length)
}

function isPageUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  }
  catch {
    return false
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
    else if (arg === '--target') {
      flags.target = argv[index + 1]
      index += 1
    }
    else if (arg === '--root') {
      const roots = Array.isArray(flags.root) ? flags.root : []
      roots.push(argv[index + 1])
      flags.root = roots
      index += 1
    }
    else if (arg === '--full-page') {
      flags.fullPage = true
    }
    else if (arg?.startsWith('--root=')) {
      const roots = Array.isArray(flags.root) ? flags.root : []
      roots.push(arg.slice('--root='.length))
      flags.root = roots
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

function parseCaptureBrowserCliArgumentsFromOptions(
  renderEntry: unknown,
  options: unknown,
  inputLength = 1,
): CaptureBrowserCliArguments {
  const flags = options as Record<string, unknown>
  const outputDir = parseStringOption(flags.outputDir)
  const target = parseStringOption(flags.target)

  if (target !== undefined && target !== 'browser') {
    throw new Error(`Unsupported render target "${target}". Expected "browser".`)
  }

  if (inputLength !== 1
    || typeof renderEntry !== 'string'
    || renderEntry.length === 0
    || target === undefined
    || outputDir === undefined) {
    throw new Error(browserCaptureUsageMessage)
  }

  return {
    captureName: parseStringOption(flags.name),
    fullPage: parseBooleanOption(flags.fullPage),
    height: parsePositiveIntegerOption(flags.height, 'browser height', DEFAULT_BROWSER_HEIGHT),
    outputDir,
    renderEntry,
    rootNames: parseRepeatedStringOption(flags.root),
    settleMs: parseNonNegativeIntegerOption(flags.settleMs, 'settle duration', 0),
    width: parsePositiveIntegerOption(flags.width, 'browser width', DEFAULT_BROWSER_WIDTH),
  }
}

async function runCaptureBrowser(options: CaptureBrowserCliArguments, commandCwd: string): Promise<void> {
  const outputDir = path.resolve(commandCwd, options.outputDir)

  if (isPageUrl(options.renderEntry)) {
    if (options.rootNames.length > 0) {
      throw new Error('Direct browser page capture does not accept --root. Use --name to override the artifact name.')
    }

    await captureBrowserPage({
      artifactName: options.captureName,
      fullPage: options.fullPage,
      outputDir,
      settleMs: options.settleMs,
      url: options.renderEntry,
      viewport: {
        height: options.height,
        width: options.width,
      },
    })
    return
  }

  if (options.fullPage) {
    throw new Error('--full-page is only supported when the render entry is a direct URL.')
  }

  await captureBrowserRoots({
    outputDir,
    rootNames: options.rootNames,
    routePath: '/',
    sceneAppRoot: path.resolve(commandCwd, options.renderEntry),
    settleMs: options.settleMs,
    viewport: {
      height: options.height,
      width: options.width,
    },
  })
}
