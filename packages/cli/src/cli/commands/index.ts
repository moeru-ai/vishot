import { capture as render } from './renderer/browser/capture'
import { capture } from './source/electron/capture'

export const commandTree = [
  capture,
  render,
]

export { registerCommandTree } from './command'
