import { describe, expect, it } from 'vitest'
import { formatSnapshot, FX_SNAPSHOT, PRICING_SNAPSHOT } from '../snapshot'

describe('formatSnapshot', () => {
  it('renders a month per language', () => {
    expect(formatSnapshot('2026-06', 'en')).toBe('Jun 2026')
    expect(formatSnapshot('2026-06', 'zh')).toBe('2026 年 6 月')
    expect(formatSnapshot('2026-12', 'en')).toBe('Dec 2026')
  })

  it('falls back to the raw value rather than printing nonsense', () => {
    expect(formatSnapshot('not-a-date', 'en')).toBe('not-a-date')
    expect(formatSnapshot('2026-13', 'en')).toBe('2026-13')
  })

  it('keeps the declared snapshots in a parseable shape', () => {
    for (const snapshot of [PRICING_SNAPSHOT, FX_SNAPSHOT]) {
      expect(snapshot).toMatch(/^\d{4}-\d{2}$/)
      expect(formatSnapshot(snapshot, 'en')).not.toBe(snapshot)
    }
  })
})
