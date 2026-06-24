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

/** Prices in USD per 1M tokens (input / output) — MVP snapshot */
export const MODELS: ModelPricing[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    inputPer1M: 2.5,
    outputPer1M: 10,
    tokenMultiplier: 1,
    accuracy: 'exact',
    region: 'global',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    provider: 'OpenAI',
    inputPer1M: 0.15,
    outputPer1M: 0.6,
    tokenMultiplier: 1,
    accuracy: 'exact',
    region: 'global',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    inputPer1M: 3,
    outputPer1M: 15,
    tokenMultiplier: 1.02,
    accuracy: 'estimate',
    region: 'global',
  },
  {
    id: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    inputPer1M: 1.25,
    outputPer1M: 5,
    tokenMultiplier: 0.98,
    accuracy: 'estimate',
    region: 'global',
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek-V3',
    provider: 'DeepSeek',
    inputPer1M: 0.27,
    outputPer1M: 1.1,
    tokenMultiplier: 0.62,
    accuracy: 'estimate',
    region: 'apac',
  },
  {
    id: 'qwen-plus',
    name: 'Qwen-Plus',
    provider: 'Alibaba',
    inputPer1M: 0.4,
    outputPer1M: 1.2,
    tokenMultiplier: 0.58,
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