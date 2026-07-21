export function parseBooleanOption(value: unknown): boolean {
  return value === true
}

export function parseRepeatedStringOption(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter(item => typeof item === 'string')
  }

  if (typeof value === 'string') {
    return [value]
  }

  return []
}

export function parseStringOption(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0
    ? value
    : undefined
}
