import { useEffect, useState } from 'react'
import {
  countTokens,
  isOpenAiEncoding,
  tokenizeToSpans,
  type TokenSpan,
  type TokenizerId,
} from '../lib/tokenizer'

interface TokenAnalysisResult {
  tokenCount: number
  /** cl100k count — used for Chinese inflation comparison */
  openAiBaseline: number
  /** Active OpenAI encoding count, or cl100k when Chinese estimate is selected */
  pricingBaseline: number
  chineseEfficient: number
  spans: TokenSpan[]
  loading: boolean
}

export function useTokenAnalysis(
  prompt: string,
  tokenizerId: TokenizerId,
  showBlocks: boolean,
): TokenAnalysisResult {
  const [result, setResult] = useState<TokenAnalysisResult>({
    tokenCount: 0,
    openAiBaseline: 0,
    pricingBaseline: 0,
    chineseEfficient: 0,
    spans: [],
    loading: true,
  })

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      setResult((prev) => ({ ...prev, loading: true }))

      const [tokenCount, openAiBaseline, chineseEfficient, spans] =
        await Promise.all([
          countTokens(prompt, tokenizerId),
          countTokens(prompt, 'cl100k_base'),
          countTokens(prompt, 'chinese_estimate'),
          showBlocks && prompt
            ? tokenizeToSpans(prompt, tokenizerId)
            : Promise.resolve([]),
        ])

      if (!cancelled) {
        const pricingBaseline = isOpenAiEncoding(tokenizerId)
          ? tokenCount
          : openAiBaseline
        setResult({
          tokenCount,
          openAiBaseline,
          pricingBaseline,
          chineseEfficient,
          spans,
          loading: false,
        })
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [prompt, tokenizerId, showBlocks])

  return result
}