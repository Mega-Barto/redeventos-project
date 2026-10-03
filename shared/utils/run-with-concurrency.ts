export async function runWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const limit = Math.max(1, concurrency)
  const results = new Array<R>(items.length)
  let next = 0

  async function consume() {
    while (next < items.length) {
      const index = next
      next += 1
      const item = items[index]
      if (item === undefined) continue
      results[index] = await worker(item, index)
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => consume()))
  return results
}
