import { describe, expect, it } from 'vitest'
import { convertFromUsd, CURRENCY_SYMBOL, formatCost } from '../currency'

describe('convertFromUsd', () => {
  it('leaves USD untouched', () => {
    expect(convertFromUsd(12.5, 'USD')).toBe(12.5)
  })

  it('applies the snapshot rate for other currencies', () => {
    expect(convertFromUsd(100, 'GBP')).toBeCloseTo(75.4, 6)
    expect(convertFromUsd(100, 'CNY')).toBeCloseTo(669.3, 6)
  })
})

describe('formatCost', () => {
  it('prefixes the currency symbol', () => {
    for (const currency of ['USD', 'GBP', 'CNY'] as const) {
      expect(formatCost(1, currency).startsWith(CURRENCY_SYMBOL[currency])).toBe(true)
    }
  })

  it('keeps sub-cent per-call figures readable instead of rounding to zero', () => {
    expect(formatCost(0.0000004, 'USD')).toBe('$0.000000')
    expect(formatCost(0.00005, 'USD')).toBe('$0.000050')
    expect(formatCost(0.005, 'USD')).toBe('$0.00500')
    expect(formatCost(0.5, 'USD')).toBe('$0.5000')
  })

  it('groups thousands once a monthly projection gets large', () => {
    expect(formatCost(1234567.891, 'USD')).toBe('$1,234,567.89')
  })

  it('formats zero as plain currency', () => {
    expect(formatCost(0, 'USD')).toBe('$0.00')
  })
})
