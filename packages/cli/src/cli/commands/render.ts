import type { CaptureBrowserCliArguments } from '../capture-options'

import path from 'node:path'

import { captureBrowserRoots } from '@vishot/renderer-browser'

import { parseRepeatedStringOption, parseStringOption } from '../options'
import { defineCommand } from './command'

export const browserCaptureUsageMessage = 'Usage: vishot render --target browser <render-entry> --output-dir <dir>'

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
      description: 'Named capture root to export; may be repeated',
      flags: '--root <name>',
    },
  ],
})

export function parseCaptureBrowserCliArguments(argv: string[]): CaptureBrowserCliArguments {
  const { flags, input } = parseArgv(argv)
  return parseCaptureBrowserCliArgumentsFromOptions(input[0], flags, input.length)
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
    else if (arg?.startsWith('--output-dir=')) {
      flags.outputDir = arg.slice('--output-dir='.length)
    }
    else if (arg?.startsWith('--target=')) {
      flags.target = arg.slice('--target='.length)
    }
    else if (arg?.startsWith('--root=')) {
      const roots = Array.isArray(flags.root) ? flags.root : []
      roots.push(arg.slice('--root='.length))
      flags.root = roots
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
    outputDir,
    renderEntry,
    rootNames: parseRepeatedStringOption(flags.root),
  }
}

async function runCaptureBrowser(options: CaptureBrowserCliArguments, commandCwd: string): Promise<void> {
  await captureBrowserRoots({
    outputDir: path.resolve(commandCwd, options.outputDir),
    rootNames: options.rootNames,
    routePath: '/',
    sceneAppRoot: path.resolve(commandCwd, options.renderEntry),
  })
}
