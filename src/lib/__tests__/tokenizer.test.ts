import { describe, expect, it } from 'vitest'
import {
  analyze,
  baselineEncodingFor,
  countChineseChars,
  DEFAULT_ENCODING,
  emptyAnalysis,
  estimateChineseEfficientTokens,
  hasChinese,
  isOpenAiEncoding,
  loadEncoding,
} from '../tokenizer'

describe('Chinese detection', () => {
  it('counts CJK characters and ignores everything else', () => {
    expect(countChineseChars('hello')).toBe(0)
    expect(countChineseChars('中文测试')).toBe(4)
    expect(countChineseChars('mixed 中文 text 内容!')).toBe(4)
  })

  it('does not treat CJK punctuation as a character', () => {
    expect(countChineseChars('，。！')).toBe(0)
  })

  it('reports presence consistently with the count', () => {
    expect(hasChinese('plain ascii')).toBe(false)
    expect(hasChinese('has 中 inside')).toBe(true)
  })
})

describe('estimateChineseEfficientTokens', () => {
  it('is a no-op for text with no Chinese', () => {
    expect(estimateChineseEfficientTokens('hello world', 42)).toBe(42)
  })

  it('is zero for empty text regardless of the baseline', () => {
    expect(estimateChineseEfficientTokens('', 99)).toBe(0)
  })

  it('predicts fewer tokens than the OpenAI baseline for Chinese text', () => {
    const text = '中文测试内容'.repeat(20)
    expect(estimateChineseEfficientTokens(text, 200)).toBeLessThan(200)
  })

  it('never returns a negative count when the baseline is implausibly low', () => {
    expect(estimateChineseEfficientTokens('中文', 0)).toBeGreaterThanOrEqual(0)
  })
})

describe('encoding selection', () => {
  it('treats every OpenAI encoding as exact and the estimate as not', () => {
    expect(isOpenAiEncoding('o200k_base')).toBe(true)
    expect(isOpenAiEncoding('cl100k_base')).toBe(true)
    expect(isOpenAiEncoding('chinese_estimate')).toBe(false)
  })

  it('backs the Chinese estimate with the default OpenAI encoding', () => {
    expect(baselineEncodingFor('chinese_estimate')).toBe(DEFAULT_ENCODING)
    expect(baselineEncodingFor('p50k_base')).toBe('p50k_base')
  })

  it('caches an encoding so repeat loads share one instance', async () => {
    const [a, b] = await Promise.all([
      loadEncoding('cl100k_base'),
      loadEncoding('cl100k_base'),
    ])
    expect(a).toBe(b)
  })
})

describe('analyze', () => {
  it('returns a zeroed result for empty text without loading an encoding', async () => {
    expect(await analyze({ text: '', tokenizerId: 'o200k_base', wantSpans: true })).toEqual(
      emptyAnalysis(),
    )
  })

  it('counts tokens and characters in a single pass', async () => {
    const result = await analyze({
      text: 'Hello world',
      tokenizerId: 'o200k_base',
      wantSpans: false,
    })
    expect(result.tokenCount).toBeGreaterThan(0)
    expect(result.charCount).toBe('Hello world'.length)
    expect(result.openAiBaseline).toBe(result.tokenCount)
    expect(result.pricingBaseline).toBe(result.tokenCount)
    expect(result.spans).toEqual([])
  })

  it('prices the Chinese estimate off the OpenAI baseline, not the estimate', async () => {
    const text = '中文测试内容需要更多的字符来产生差异'
    const result = await analyze({ text, tokenizerId: 'chinese_estimate', wantSpans: false })

    expect(result.tokenCount).toBe(result.chineseEfficient)
    expect(result.tokenCount).toBeLessThan(result.openAiBaseline)
    expect(result.pricingBaseline).toBe(result.openAiBaseline)
  })

  it('emits one span per token, in order, that reassembles the input', async () => {
    const text = 'The quick brown fox'
    const result = await analyze({ text, tokenizerId: 'o200k_base', wantSpans: true })

    expect(result.spans).toHaveLength(result.tokenCount)
    expect(result.spans.map((s) => s.tokenIndex)).toEqual(
      result.spans.map((_, i) => i),
    )
    expect(result.spans.map((s) => s.text).join('')).toBe(text)
    expect(result.spansTruncated).toBe(false)
  })

  it('caps spans at the limit and flags the truncation', async () => {
    const result = await analyze({
      text: 'token '.repeat(400),
      tokenizerId: 'o200k_base',
      wantSpans: true,
      spanLimit: 10,
    })

    expect(result.spans).toHaveLength(10)
    expect(result.spansTruncated).toBe(true)
    // The count itself must stay exact even though the preview is clipped.
    expect(result.tokenCount).toBeGreaterThan(10)
  })

  it('shows each Chinese character as its own block in estimate mode', async () => {
    const result = await analyze({
      text: '中文abc',
      tokenizerId: 'chinese_estimate',
      wantSpans: true,
    })

    expect(result.spans.slice(0, 2).map((s) => s.text)).toEqual(['中', '文'])
    expect(result.spans.map((s) => s.text).join('')).toBe('中文abc')
  })

  it('produces different counts for different encodings of the same text', async () => {
    const text = 'Tokenization differs between vocabularies. 中文内容也一样。'
    const [o200k, p50k] = await Promise.all([
      analyze({ text, tokenizerId: 'o200k_base', wantSpans: false }),
      analyze({ text, tokenizerId: 'p50k_base', wantSpans: false }),
    ])
    expect(o200k.tokenCount).not.toBe(p50k.tokenCount)
  })
})
