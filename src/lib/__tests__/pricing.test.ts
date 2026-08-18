import { describe, expect, it } from 'vitest'
import {
  chineseInflationRate,
  costSpread,
  estimateCosts,
  findBestValue,
  MODELS,
} from '../pricing'

const byId = (id: string) => MODELS.find((m) => m.id === id)!

describe('estimateCosts', () => {
  it('returns one estimate per model, cheapest first', () => {
    const costs = estimateCosts(1000, 'USD')
    expect(costs).toHaveLength(MODELS.length)
    for (let i = 1; i < costs.length; i++) {
      expect(costs[i].costUsd).toBeGreaterThanOrEqual(costs[i - 1].costUsd)
    }
  })

  it('scales input tokens by the model vocabulary multiplier', () => {
    const deepseek = byId('deepseek-v4-flash')
    const estimate = estimateCosts(1000, 'USD').find((e) => e.model.id === deepseek.id)!
    expect(estimate.tokens).toBe(Math.round(1000 * deepseek.tokenMultiplier))
    expect(estimate.costUsd).toBeCloseTo((estimate.tokens / 1e6) * deepseek.inputPer1M, 12)
  })

  it('bills output tokens at the output rate on top of input', () => {
    const model = byId('gpt-5.4')
    const inputOnly = estimateCosts(1000, 'USD').find((e) => e.model.id === model.id)!
    const withOutput = estimateCosts(1000, 'USD', 500).find((e) => e.model.id === model.id)!

    expect(withOutput.outputTokens).toBe(Math.round(500 * model.tokenMultiplier))
    expect(withOutput.costUsd - inputOnly.costUsd).toBeCloseTo(
      (withOutput.outputTokens / 1e6) * model.outputPer1M,
      12,
    )
  })

  it('treats output tokens as absolute, not a ratio of input', () => {
    const a = estimateCosts(1000, 'USD', 500)
    const b = estimateCosts(2000, 'USD', 500)
    const model = 'gpt-5.4'
    const outA = a.find((e) => e.model.id === model)!.outputTokens
    const outB = b.find((e) => e.model.id === model)!.outputTokens
    expect(outA).toBe(outB)
  })

  it('costs nothing for an empty prompt', () => {
    expect(estimateCosts(0, 'USD').every((e) => e.costUsd === 0)).toBe(true)
  })
})

describe('findBestValue', () => {
  it('returns the cheapest estimate', () => {
    const costs = estimateCosts(5000, 'USD', 200)
    expect(findBestValue(costs)).toBe(costs[0])
  })

  it('returns null when there is nothing to compare', () => {
    expect(findBestValue([])).toBeNull()
  })
})

describe('costSpread', () => {
  it('reports how many times pricier the dearest model is', () => {
    const costs = estimateCosts(10_000, 'USD')
    const spread = costSpread(costs)!
    expect(spread).toBeCloseTo(costs[costs.length - 1].costUsd / costs[0].costUsd, 9)
    expect(spread).toBeGreaterThan(1)
  })

  it('is undefined when every estimate is free', () => {
    expect(costSpread(estimateCosts(0, 'USD'))).toBeNull()
  })
})

describe('chineseInflationRate', () => {
  it('reports the percentage of tokens saved', () => {
    expect(chineseInflationRate(100, 60)).toBe(40)
  })

  it('is null with no baseline to compare against', () => {
    expect(chineseInflationRate(0, 0)).toBeNull()
  })

  it('goes negative when the estimate is worse than the baseline', () => {
    expect(chineseInflationRate(100, 120)).toBe(-20)
  })
})
