import type { Currency } from './currency'
import { formatCost } from './currency'

export interface ModelPricing {
  id: string
  name: string
  provider: string
  inputPer1M: number
  outputPer1M: number
  /** Token count multiplier vs cl100k_base (1 = same) */
  tokenMultiplier: number
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
    tokenMultiplier: 1,
    accuracy: 'exact',
    region: 'global',
  },
  {
    id: 'gpt-5.4-mini',
    name: 'GPT-5.4 mini',
    provider: 'OpenAI',
    inputPer1M: 0.75,
    outputPer1M: 3,
    tokenMultiplier: 1,
    accuracy: 'exact',
    region: 'global',
  },
  {
    id: 'gpt-5.4-nano',
    name: 'GPT-5.4 nano',
    provider: 'OpenAI',
    inputPer1M: 0.2,
    outputPer1M: 0.8,
    tokenMultiplier: 1,
    accuracy: 'exact',
    region: 'global',
  },
  {
    id: 'claude-sonnet-4.6',
    name: 'Claude Sonnet 4.6',
    provider: 'Anthropic',
    inputPer1M: 3,
    outputPer1M: 15,
    tokenMultiplier: 1.02,
    accuracy: 'estimate',
    region: 'global',
  },
  {
    id: 'claude-haiku-4.5',
    name: 'Claude Haiku 4.5',
    provider: 'Anthropic',
    inputPer1M: 1,
    outputPer1M: 5,
    tokenMultiplier: 1.02,
    accuracy: 'estimate',
    region: 'global',
  },
  {
    id: 'gemini-3.5-flash',
    name: 'Gemini 3.5 Flash',
    provider: 'Google',
    inputPer1M: 1.5,
    outputPer1M: 9,
    tokenMultiplier: 0.98,
    accuracy: 'estimate',
    region: 'global',
  },
  {
    id: 'gemini-3.1-pro',
    name: 'Gemini 3.1 Pro',
    provider: 'Google',
    inputPer1M: 2,
    outputPer1M: 12,
    tokenMultiplier: 0.98,
    accuracy: 'estimate',
    region: 'global',
  },
  {
    id: 'deepseek-v4-flash',
    name: 'DeepSeek-V4-Flash',
    provider: 'DeepSeek',
    inputPer1M: 0.14,
    outputPer1M: 0.28,
    tokenMultiplier: 0.58,
    accuracy: 'estimate',
    region: 'apac',
  },
  {
    id: 'qwen3.7-plus',
    name: 'Qwen3.7-Plus',
    provider: 'Alibaba',
    inputPer1M: 2 / 7.25,
    outputPer1M: 8 / 7.25,
    tokenMultiplier: 0.55,
    accuracy: 'estimate',
    region: 'apac',
  },
]

export interface CostEstimate {
  model: ModelPricing
  tokens: number
  inputCostUsd: number
  formatted: string
}

export function estimateCosts(
  baseTokens: number,
  currency: Currency,
  assumeOutputRatio = 0,
): CostEstimate[] {
  return MODELS.map((model) => {
    const tokens = Math.round(baseTokens * model.tokenMultiplier)
    const inputCostUsd = (tokens / 1_000_000) * model.inputPer1M
    const outputCostUsd =
      (tokens * assumeOutputRatio) / 1_000_000 * model.outputPer1M
    const totalUsd = inputCostUsd + outputCostUsd

    return {
      model,
      tokens,
      inputCostUsd: totalUsd,
      formatted: formatCost(totalUsd, currency),
    }
  }).sort((a, b) => a.inputCostUsd - b.inputCostUsd)
}

export function findBestValue(estimates: CostEstimate[]): CostEstimate | null {
  if (estimates.length === 0) return null
  return estimates[0]
}

export function chineseInflationRate(
  openAiTokens: number,
  efficientTokens: number,
): number | null {
  if (openAiTokens === 0) return null
  return Math.round(((openAiTokens - efficientTokens) / openAiTokens) * 100)
}