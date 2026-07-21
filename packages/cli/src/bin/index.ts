import process from 'node:process'

import { errorMessageFrom } from '@moeru/std'

import { executeCli } from '../cli/cli'

void executeCli(process.argv, {
  cwd: process.cwd(),
  stderr: process.stderr,
  stdout: process.stdout,
}).then((exitCode) => {
  process.exitCode = exitCode
}).catch((error) => {
  process.stderr.write(`${errorMessageFrom(error) ?? 'Unknown CLI error'}\n`)
  process.exitCode = 1
})
