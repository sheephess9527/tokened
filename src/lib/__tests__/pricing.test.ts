import { describe, expect, it } from 'vitest'
import {
  chineseInflationRate,
  costSpread,
  estimateCosts,
  findBestValue,
  MODELS,
  tokensForModel,
  type TokenProfile,
} from '../pricing'

const byId = (id: string) => MODELS.find((m) => m.id === id)!

/** An all-English prompt: no CJK characters at all. */
const english = (tokens: number): TokenProfile => ({
  openAiTokens: tokens,
  chineseChars: 0,
  nonChineseTokens: tokens,
})

/** A prompt that is entirely CJK characters. */
const chinese = (chars: number, openAiTokens: number): TokenProfile => ({
  openAiTokens,
  chineseChars: chars,
  nonChineseTokens: 0,
})

describe('tokensForModel', () => {
  it('uses the exact encoder result for OpenAI models', () => {
    for (const model of MODELS.filter((m) => m.usesOpenAiVocabulary)) {
      expect(tokensForModel(english(1000), model)).toBe(1000)
      expect(tokensForModel(chinese(500, 320), model)).toBe(320)
    }
  })

  it('never discounts an all-English prompt for a CJK-optimised vocabulary', () => {
    // Regression: a flat per-model multiplier made DeepSeek and Qwen look ~42%
    // cheaper on prompts containing no Chinese at all.
    for (const model of MODELS.filter((m) => m.region === 'apac')) {
      expect(tokensForModel(english(1000), model)).toBe(1000)
    }
  })

  it('only advantages CJK-optimised vocabularies on CJK characters', () => {
    const deepseek = byId('deepseek-v4-flash')
    const profile = chinese(100, 64)

    expect(tokensForModel(profile, deepseek)).toBe(
      Math.round(100 * deepseek.cjkTokensPerChar),
    )
    expect(tokensForModel(profile, deepseek)).toBeLessThan(100)
  })

  it('keeps every model within a sane range of the baseline for Latin text', () => {
    for (const model of MODELS) {
      const tokens = tokensForModel(english(1000), model)
      expect(tokens).toBeGreaterThan(900)
      expect(tokens).toBeLessThan(1100)
    }
  })
})

describe('estimateCosts', () => {
  it('returns one estimate per model, cheapest first', () => {
    const costs = estimateCosts(english(1000), 'USD')
    expect(costs).toHaveLength(MODELS.length)
    for (let i = 1; i < costs.length; i++) {
      expect(costs[i].costUsd).toBeGreaterThanOrEqual(costs[i - 1].costUsd)
    }
  })

  it('prices input tokens off each model own vocabulary count', () => {
    const deepseek = byId('deepseek-v4-flash')
    const profile = chinese(1000, 640)
    const estimate = estimateCosts(profile, 'USD').find((e) => e.model.id === deepseek.id)!

    expect(estimate.tokens).toBe(tokensForModel(profile, deepseek))
    expect(estimate.costUsd).toBeCloseTo((estimate.tokens / 1e6) * deepseek.inputPer1M, 12)
  })

  it('bills output tokens at the output rate on top of input', () => {
    const model = byId('gpt-5.4')
    const inputOnly = estimateCosts(english(1000), 'USD').find((e) => e.model.id === model.id)!
    const withOutput = estimateCosts(english(1000), 'USD', 500).find(
      (e) => e.model.id === model.id,
    )!

    expect(withOutput.outputTokens).toBe(500)
    expect(withOutput.costUsd - inputOnly.costUsd).toBeCloseTo(
      (withOutput.outputTokens / 1e6) * model.outputPer1M,
      12,
    )
  })

  it('scales output by the same vocabulary ratio as the prompt', () => {
    const deepseek = byId('deepseek-v4-flash')
    const profile = chinese(1000, 640)
    const estimate = estimateCosts(profile, 'USD', 1000).find(
      (e) => e.model.id === deepseek.id,
    )!
    const ratio = tokensForModel(profile, deepseek) / profile.openAiTokens

    expect(estimate.outputTokens).toBe(Math.round(1000 * ratio))
  })

  it('treats output tokens as absolute, not a ratio of input', () => {
    const a = estimateCosts(english(1000), 'USD', 500)
    const b = estimateCosts(english(2000), 'USD', 500)
    const model = 'gpt-5.4'
    expect(a.find((e) => e.model.id === model)!.outputTokens).toBe(
      b.find((e) => e.model.id === model)!.outputTokens,
    )
  })

  it('costs nothing for an empty prompt', () => {
    expect(estimateCosts(english(0), 'USD').every((e) => e.costUsd === 0)).toBe(true)
  })

  it('still ranks the APAC models cheapest on English, on price alone', () => {
    // With the token discount gone, their advantage has to come from the
    // per-token price — which it does.
    const cheapest = estimateCosts(english(10_000), 'USD')[0]
    expect(cheapest.model.region).toBe('apac')
    expect(cheapest.tokens).toBe(10_000)
  })
})

describe('findBestValue', () => {
  it('returns the cheapest estimate', () => {
    const costs = estimateCosts(english(5000), 'USD', 200)
    expect(findBestValue(costs)).toBe(costs[0])
  })

  it('returns null when there is nothing to compare', () => {
    expect(findBestValue([])).toBeNull()
  })
})

describe('costSpread', () => {
  it('reports how many times pricier the dearest model is', () => {
    const costs = estimateCosts(english(10_000), 'USD')
    const spread = costSpread(costs)!
    expect(spread).toBeCloseTo(costs[costs.length - 1].costUsd / costs[0].costUsd, 9)
    expect(spread).toBeGreaterThan(1)
  })

  it('is undefined when every estimate is free', () => {
    expect(costSpread(estimateCosts(english(0), 'USD'))).toBeNull()
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
