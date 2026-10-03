export function emptyToNull(value: unknown): unknown {
  if (value === '' || value === undefined) return null
  return value
}

export function hasNeedQuantity(value: unknown): boolean {
  if (value === '' || value === null || value === undefined) return false
  const amount = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(amount) && amount > 0
}
