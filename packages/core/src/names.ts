import { sanitizeOutputName } from './files'

/**
 * Derives a stable capture name from a browser URL.
 *
 * Before:
 * - `http://127.0.0.1:5173/settings/connection`
 * - `file:///app/index.html#/settings`
 * - `http://127.0.0.1:5173/`
 *
 * After:
 * - `connection`
 * - `settings`
 * - `home`
 */
export function captureNameFromUrl(value: string): string {
  const url = new URL(value)
  const hashRoute = url.hash.replace(/^#\/?/u, '')
  const hashName = lastPathSegment(hashRoute)

  if (hashName) {
    return sanitizeOutputName(hashName)
  }

  const pathName = lastPathSegment(url.pathname)
  if (pathName && !/^index\.html?$/iu.test(pathName)) {
    return sanitizeOutputName(pathName)
  }

  return 'home'
}

function lastPathSegment(value: string): string | undefined {
  const segment = value
    .split('/')
    .filter(Boolean)
    .at(-1)

  return segment ? decodeURIComponent(segment) : undefined
}
