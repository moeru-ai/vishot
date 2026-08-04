import { describe, expect, it } from 'vitest'

import { captureNameFromUrl } from './names'

describe('captureNameFromUrl', () => {
  it('uses the last pathname segment', () => {
    expect(captureNameFromUrl('http://127.0.0.1:5173/settings/connection')).toBe('connection')
  })

  it('prefers a hash route over the document pathname', () => {
    expect(captureNameFromUrl('file:///app/index.html#/settings/providers')).toBe('providers')
  })

  it('names a root page home', () => {
    expect(captureNameFromUrl('http://127.0.0.1:5173/')).toBe('home')
  })
})
