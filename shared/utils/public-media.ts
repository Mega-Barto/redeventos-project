export function asFileList(value: File | File[] | null | undefined): File[] {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

export function publicMediaOnly<T extends { is_public?: boolean | null }>(rows: readonly T[]): T[] {
  return rows.filter((row) => row.is_public === true)
}

export function mediaFigureAttrs(input: { alt: string; priority?: boolean }) {
  const priority = Boolean(input.priority)
  return {
    alt: input.alt,
    loading: (priority ? 'eager' : 'lazy') as 'eager' | 'lazy',
    fetchpriority: (priority ? 'high' : 'low') as 'high' | 'low',
    decoding: (priority ? 'sync' : 'async') as 'sync' | 'async',
  }
}
