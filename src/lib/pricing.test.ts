import { describe, expect, it } from 'vitest'
import {
  MODELS,
  chineseInflationRate,
  estimateCosts,
  findBestValue,
  formatPricingSnapshotDate,
} from './pricing'

describe('estimateCosts', () => {
  it('returns one estimate per model', () => {
    const estimates = estimateCosts(1000, 'USD')
    expect(estimates).toHaveLength(MODELS.length)
  })

  it('sorts ascending by cost', () => {
    const estimates = estimateCosts(1000, 'USD')
    for (let i = 1; i < estimates.length; i++) {
      expect(estimates[i].inputCostUsd).toBeGreaterThanOrEqual(estimates[i - 1].inputCostUsd)
    }
  })

  it('applies each model token multiplier', () => {
    const [estimate] = estimateCosts(1000, 'USD').filter((e) => e.model.id === 'deepseek-v4-flash')
    expect(estimate.tokens).toBe(Math.round(1000 * estimate.model.tokenMultiplier))
  })

  it('returns zero cost for zero tokens', () => {
    const estimates = estimateCosts(0, 'USD')
    expect(estimates.every((e) => e.inputCostUsd === 0)).toBe(true)
  })

  it('includes output cost when an output ratio is given', () => {
    const noOutput = estimateCosts(1000, 'USD', 0)
    const withOutput = estimateCosts(1000, 'USD', 1)
    const a = noOutput.find((e) => e.model.id === 'gpt-5.4')!
    const b = withOutput.find((e) => e.model.id === 'gpt-5.4')!
    expect(b.inputCostUsd).toBeGreaterThan(a.inputCostUsd)
  })
})

describe('findBestValue', () => {
  it('returns the cheapest estimate', () => {
    const estimates = estimateCosts(1000, 'USD')
    expect(findBestValue(estimates)).toBe(estimates[0])
  })

  it('returns null for an empty list', () => {
    expect(findBestValue([])).toBeNull()
  })
})

describe('formatPricingSnapshotDate', () => {
  it('formats the snapshot date in English', () => {
    expect(formatPricingSnapshotDate('en')).toBe('June 2026')
  })

  it('formats the snapshot date in Chinese', () => {
    expect(formatPricingSnapshotDate('zh')).toContain('2026')
  })
})

describe('chineseInflationRate', () => {
  it('returns null when the OpenAI baseline is zero', () => {
    expect(chineseInflationRate(0, 0)).toBeNull()
  })

  it('computes the percentage reduction', () => {
    expect(chineseInflationRate(100, 60)).toBe(40)
  })

  it('rounds to the nearest integer', () => {
    expect(chineseInflationRate(100, 67)).toBe(33)
  })
})
