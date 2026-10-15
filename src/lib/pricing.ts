import type { Currency } from './currency'
import { formatCost } from './currency'

export interface ModelPricing {
  id: string
  name: string
  provider: string
  inputPer1M: number
  outputPer1M: number
  /**
   * Token count relative to the OpenAI baseline for everything that is not a
   * CJK character. Vocabularies differ far less on Latin text than on CJK, so
   * this stays close to 1 — a flat per-model multiplier applied to the whole
   * prompt would wrongly discount plain-English prompts.
   */
  latinFactor: number
  /**
   * Estimated tokens per CJK character. Measured for OpenAI encodings
   * (o200k_base ~0.64, cl100k_base ~1.10); approximate for everyone else.
   */
  cjkTokensPerChar: number
  /** OpenAI models are counted with the real encoder rather than estimated. */
  usesOpenAiVocabulary: boolean
  accuracy: 'exact' | 'estimate'
  region: 'global' | 'apac'
}

/**
 * USD per 1M tokens (input / output).
 * Snapshot: June 2026 — OpenAI, Anthropic, Google, DeepSeek, Alibaba official pricing.
 */
export const MODELS: ModelPricing[] = [
  {
    id: 'gpt-5.4',
    name: 'GPT-5.4',
    provider: 'OpenAI',
    inputPer1M: 2.5,
    outputPer1M: 10,
    latinFactor: 1,
    cjkTokensPerChar: 0.64,
    usesOpenAiVocabulary: true,
    accuracy: 'exact',
    region: 'global',
  },
  {
    id: 'gpt-5.4-mini',
    name: 'GPT-5.4 mini',
    provider: 'OpenAI',
    inputPer1M: 0.75,
    outputPer1M: 3,
    latinFactor: 1,
    cjkTokensPerChar: 0.64,
    usesOpenAiVocabulary: true,
    accuracy: 'exact',
    region: 'global',
  },
  {
    id: 'gpt-5.4-nano',
    name: 'GPT-5.4 nano',
    provider: 'OpenAI',
    inputPer1M: 0.2,
    outputPer1M: 0.8,
    latinFactor: 1,
    cjkTokensPerChar: 0.64,
    usesOpenAiVocabulary: true,
    accuracy: 'exact',
    region: 'global',
  },
  {
    id: 'claude-sonnet-4.6',
    name: 'Claude Sonnet 4.6',
    provider: 'Anthropic',
    inputPer1M: 3,
    outputPer1M: 15,
    latinFactor: 1.02,
    cjkTokensPerChar: 0.9,
    usesOpenAiVocabulary: false,
    accuracy: 'estimate',
    region: 'global',
  },
  {
    id: 'claude-haiku-4.5',
    name: 'Claude Haiku 4.5',
    provider: 'Anthropic',
    inputPer1M: 1,
    outputPer1M: 5,
    latinFactor: 1.02,
    cjkTokensPerChar: 0.9,
    usesOpenAiVocabulary: false,
    accuracy: 'estimate',
    region: 'global',
  },
  {
    id: 'gemini-3.5-flash',
    name: 'Gemini 3.5 Flash',
    provider: 'Google',
    inputPer1M: 1.5,
    outputPer1M: 9,
    latinFactor: 0.98,
    cjkTokensPerChar: 0.9,
    usesOpenAiVocabulary: false,
    accuracy: 'estimate',
    region: 'global',
  },
  {
    id: 'gemini-3.1-pro',
    name: 'Gemini 3.1 Pro',
    provider: 'Google',
    inputPer1M: 2,
    outputPer1M: 12,
    latinFactor: 0.98,
    cjkTokensPerChar: 0.9,
    usesOpenAiVocabulary: false,
    accuracy: 'estimate',
    region: 'global',
  },
  {
    id: 'deepseek-v4-flash',
    name: 'DeepSeek-V4-Flash',
    provider: 'DeepSeek',
    inputPer1M: 0.14,
    outputPer1M: 0.28,
    latinFactor: 1,
    cjkTokensPerChar: 0.6,
    usesOpenAiVocabulary: false,
    accuracy: 'estimate',
    region: 'apac',
  },
  {
    id: 'qwen3.7-plus',
    name: 'Qwen3.7-Plus',
    provider: 'Alibaba',
    inputPer1M: 2 / 7.25,
    outputPer1M: 8 / 7.25,
    latinFactor: 1,
    cjkTokensPerChar: 0.58,
    usesOpenAiVocabulary: false,
    accuracy: 'estimate',
    region: 'apac',
  },
]

export interface CostEstimate {
  model: ModelPricing
  /** Input tokens under this model's own vocabulary. */
  tokens: number
  /** Output tokens under this model's own vocabulary. */
  outputTokens: number
  /** Input + output cost for a single call, in USD. */
  costUsd: number
  formatted: string
}

/** What a prompt looks like to a tokenizer, independent of which model prices it. */
export interface TokenProfile {
  /** Exact count under the active OpenAI encoding. */
  openAiTokens: number
  chineseChars: number
  nonChineseTokens: number
}

/**
 * Token count for one model. OpenAI models use the real encoder result; others
 * keep the exact non-CJK count and estimate only the CJK characters, so an
 * all-English prompt is never handed a phantom discount.
 */
export function tokensForModel(profile: TokenProfile, model: ModelPricing): number {
  if (model.usesOpenAiVocabulary) return profile.openAiTokens

  return Math.round(
    profile.nonChineseTokens * model.latinFactor +
      profile.chineseChars * model.cjkTokensPerChar,
  )
}

/**
 * Cost of one call per model, cheapest first.
 *
 * `outputTokens` is an absolute count rather than a ratio: completions are
 * billed at 3–5x the input rate, so leaving them out understates real spend.
 * Output is assumed to have the same language mix as the prompt, so it scales
 * by the same vocabulary ratio.
 */
export function estimateCosts(
  profile: TokenProfile,
  currency: Currency,
  outputTokens = 0,
): CostEstimate[] {
  return MODELS.map((model) => {
    const scaledInput = tokensForModel(profile, model)
    const ratio =
      profile.openAiTokens > 0 ? scaledInput / profile.openAiTokens : model.latinFactor
    const scaledOutput = Math.round(outputTokens * ratio)
    const costUsd =
      (scaledInput / 1_000_000) * model.inputPer1M +
      (scaledOutput / 1_000_000) * model.outputPer1M

    return {
      model,
      tokens: scaledInput,
      outputTokens: scaledOutput,
      costUsd,
      formatted: formatCost(costUsd, currency),
    }
  }).sort((a, b) => a.costUsd - b.costUsd)
}

export function findBestValue(estimates: CostEstimate[]): CostEstimate | null {
  if (estimates.length === 0) return null
  return estimates[0]
}

/** Spread between the cheapest and priciest model for the same prompt. */
export function costSpread(estimates: CostEstimate[]): number | null {
  if (estimates.length < 2) return null
  const cheapest = estimates[0].costUsd
  const priciest = estimates[estimates.length - 1].costUsd
  if (cheapest <= 0) return null
  return priciest / cheapest
}

export function chineseInflationRate(
  openAiTokens: number,
  efficientTokens: number,
): number | null {
  if (openAiTokens === 0) return null
  return Math.round(((openAiTokens - efficientTokens) / openAiTokens) * 100)
}
