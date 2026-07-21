import type { CliIo } from './types'

import { cac } from 'cac'

import packageJson from '../../package.json'
import { commandTree, registerCommandTree } from './commands'

export { parseCaptureElectronCliArguments } from './commands/capture'
export { parseCaptureBrowserCliArguments } from './commands/render'
export type { CliIo } from './types'

export async function executeCli(argv: string[], io: CliIo): Promise<number> {
  if (argv.includes('--version') || argv.includes('-v')) {
    io.stdout.write(`${packageJson.version}\n`)
    return 0
  }

  const cli = cac('vishot')
  let pendingResult: Promise<number> | undefined
  const setPendingResult = (result: Promise<number>) => {
    pendingResult = result
    return result
  }

  cli
    .version(packageJson.version)
    .help()

  registerCommandTree(cli, commandTree, { io }, setPendingResult)

  cli.parse(argv)
  if (!pendingResult && argv.length > 2 && !argv.slice(2).some(arg => arg === '--help' || arg === '-h')) {
    io.stderr.write(`unknown command: ${argv[2]}\n`)
    return 2
  }

  return await (pendingResult ?? Promise.resolve(0))
}
