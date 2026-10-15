/**
 * Calculator state lives in the query string so a configured comparison can be
 * shared or bookmarked. Written with `replaceState` to keep the Back button
 * meaningful and to preserve the current `#section` anchor.
 */
export function readUrlParams(): URLSearchParams {
  if (typeof window === 'undefined') return new URLSearchParams()
  return new URLSearchParams(window.location.search)
}

export function readUrlInt(key: string, fallback: number, max: number): number {
  const raw = readUrlParams().get(key)
  if (raw === null) return fallback
  const value = Number.parseInt(raw, 10)
  if (!Number.isFinite(value) || value < 0) return fallback
  return Math.min(value, max)
}

export function syncUrlParams(values: Record<string, string | null>): void {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams(window.location.search)
  for (const [key, value] of Object.entries(values)) {
    if (value === null) params.delete(key)
    else params.set(key, value)
  }

  const search = params.toString()
  const { pathname, hash } = window.location
  const next = `${pathname}${search ? `?${search}` : ''}${hash}`

  if (next !== `${pathname}${window.location.search}${hash}`) {
    window.history.replaceState(window.history.state, '', next)
  }
}
