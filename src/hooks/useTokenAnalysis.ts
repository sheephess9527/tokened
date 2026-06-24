import { useEffect, useState } from 'react'
import {
  countTokens,
  tokenizeToSpans,
  type TokenSpan,
  type TokenizerId,
} from '../lib/tokenizer'

interface TokenAnalysisResult {
  tokenCount: number
  openAiBaseline: number
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
        setResult({ tokenCount, openAiBaseline, chineseEfficient, spans, loading: false })
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [prompt, tokenizerId, showBlocks])

  return result
}