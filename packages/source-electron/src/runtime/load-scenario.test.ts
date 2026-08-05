import path from 'node:path'

import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'

import { afterEach, describe, expect, it } from 'vitest'

import { loadScenarioModule } from './load-scenario'

const temporaryDirectories: string[] = []

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map(directory => rm(directory, { force: true, recursive: true })))
})

describe('loadScenarioModule', () => {
  it('loads a TypeScript scenario with an extensionless relative import', async () => {
    const directory = await mkdtemp(path.join(tmpdir(), 'vishot-scenario-'))
    temporaryDirectories.push(directory)

    await writeFile(
      path.join(directory, 'scenario-definition.ts'),
      `export const scenarioId = 'extensionless-import'\n`,
    )
    await writeFile(
      path.join(directory, 'scenario.ts'),
      [
        `import { scenarioId } from './scenario-definition'`,
        `export default { id: scenarioId, async run() {} }`,
      ].join('\n'),
    )

    const loaded = await loadScenarioModule(path.join(directory, 'scenario.ts'))

    expect(loaded.scenario.id).toBe('extensionless-import')
  })
})
