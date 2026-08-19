import { useEffect, useRef, useState } from 'react'
import { runAnalysis } from '../lib/analysisClient'
import {
  emptyAnalysis,
  type AnalysisResult,
  type TokenizerId,
} from '../lib/tokenizer'

/** Typing is far faster than tokenizing, so coalesce keystrokes. */
const DEBOUNCE_MS = 140

export interface TokenAnalysisState extends AnalysisResult {
  /** No result has been produced yet — the panel has nothing to show. */
  loading: boolean
  /** A newer result is on its way; the numbers below are one revision stale. */
  stale: boolean
}

export function useTokenAnalysis(
  prompt: string,
  tokenizerId: TokenizerId,
  showBlocks: boolean,
): TokenAnalysisState {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [stale, setStale] = useState(true)
  const requestRef = useRef(0)
  // The first analysis has nothing to coalesce — the prompt is already there
  // when the editor mounts, so waiting out the debounce just delays the number.
  const hasResultRef = useRef(false)

  useEffect(() => {
    if (!prompt) {
      requestRef.current++
      setResult(emptyAnalysis())
      setStale(false)
      return
    }

    setStale(true)
    const requestId = ++requestRef.current

    const timer = window.setTimeout(() => {
      void runAnalysis({ text: prompt, tokenizerId, wantSpans: showBlocks })
        .then((next) => {
          if (requestRef.current !== requestId) return
          hasResultRef.current = true
          setResult(next)
          setStale(false)
        })
        .catch(() => {
          if (requestRef.current !== requestId) return
          setStale(false)
        })
    }, hasResultRef.current ? DEBOUNCE_MS : 0)

    return () => window.clearTimeout(timer)
  }, [prompt, tokenizerId, showBlocks])

  return {
    ...(result ?? emptyAnalysis()),
    loading: result === null,
    stale,
  }
}
