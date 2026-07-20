import type { CaptureBrowserCliArguments } from '../runtime/types'

import path from 'node:path'
import process from 'node:process'

import { fileURLToPath } from 'node:url'

import { errorMessageFrom } from '@moeru/std'

import meow from 'meow'

import { captureBrowserRoots } from '../runtime/capture'

const captureBrowserHelpText = `
  Capture browser-rendered scenes and export named roots.

  Usage
    $ vishot-renderer-browser <render-entry> --output-dir <dir>

  Options
    --output-dir, -o  Directory to write browser capture output into
    --root            Named capture root to export; may be repeated
`

const captureBrowserUsageMessage = 'Usage: vishot-renderer-browser <render-entry> --output-dir <dir>'

export function parseCaptureBrowserCliArguments(argv: string[]): CaptureBrowserCliArguments {
  const cli = meow(captureBrowserHelpText, {
    argv: argv[0] === '--' ? argv.slice(1) : argv,
    importMeta: import.meta,
    flags: {
      outputDir: {
        shortFlag: 'o',
        type: 'string',
      },
      root: {
        isMultiple: true,
        type: 'string',
      },
    },
  })

  if (cli.input.length !== 1
    || typeof cli.flags.outputDir !== 'string'
    || cli.flags.outputDir.length === 0) {
    throw new Error(captureBrowserUsageMessage)
  }

  const rootNames = typeof cli.flags.root === 'string'
    ? [cli.flags.root]
    : cli.flags.root ?? []

  return {
    renderEntry: cli.input[0],
    outputDir: cli.flags.outputDir,
    rootNames,
  }
}

async function main(): Promise<void> {
  const options = parseCaptureBrowserCliArguments(process.argv.slice(2))

  await captureBrowserRoots({
    sceneAppRoot: path.resolve(process.cwd(), options.renderEntry),
    routePath: '/',
    outputDir: path.resolve(process.cwd(), options.outputDir),
    rootNames: options.rootNames,
  })
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  void main().catch((error) => {
    console.error(errorMessageFrom(error) ?? captureBrowserUsageMessage)
    process.exitCode = 1
  })
}
