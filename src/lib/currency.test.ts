import { describe, expect, it } from 'vitest'
import { convertFromUsd, formatCost } from './currency'

describe('convertFromUsd', () => {
  it('returns the same amount for USD', () => {
    expect(convertFromUsd(10, 'USD')).toBe(10)
  })

  it('applies the GBP rate', () => {
    expect(convertFromUsd(10, 'GBP')).toBeCloseTo(7.9)
  })

  it('applies the CNY rate', () => {
    expect(convertFromUsd(10, 'CNY')).toBeCloseTo(72.5)
  })
})

describe('formatCost', () => {
  it('formats zero with two decimals', () => {
    expect(formatCost(0, 'USD')).toBe('$0.00')
  })

  it('uses six decimals for very small amounts', () => {
    expect(formatCost(0.00005, 'USD')).toBe('$0.000050')
  })

  it('uses five decimals for small amounts under a cent', () => {
    expect(formatCost(0.005, 'USD')).toBe('$0.00500')
  })

  it('uses four decimals under one unit', () => {
    expect(formatCost(0.5, 'USD')).toBe('$0.5000')
  })

  it('uses two decimals at or above one unit', () => {
    expect(formatCost(12.345, 'USD')).toBe('$12.35')
  })

  it('applies the currency symbol', () => {
    expect(formatCost(1, 'GBP')).toBe('£0.7900')
    expect(formatCost(1, 'CNY')).toBe('¥7.25')
  })
})
