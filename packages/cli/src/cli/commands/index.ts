import { capture } from './capture'
import { render } from './render'

export const commandTree = [
  capture,
  render,
]

export { registerCommandTree } from './command'
