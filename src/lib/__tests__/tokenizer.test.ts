import { describe, expect, it } from 'vitest'
import {
  analyze,
  baselineEncodingFor,
  countChineseChars,
  DEFAULT_ENCODING,
  emptyAnalysis,
  CJK_EFFICIENT_TOKENS_PER_CHAR,
  estimateChineseEfficientTokens,
  hasChinese,
  profileScripts,
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

describe('profileScripts', () => {
  it('counts non-CJK text exactly and CJK characters separately', async () => {
    const encoding = await loadEncoding('o200k_base')
    const profile = profileScripts('Hello world 中文测试', encoding)

    expect(profile.chineseChars).toBe(4)
    expect(profile.nonChineseTokens).toBe(encoding.encode('Hello world ').length)
  })

  it('reports no CJK characters for plain text, keeping its full token count', async () => {
    const encoding = await loadEncoding('o200k_base')
    const text = 'The quick brown fox jumps over the lazy dog.'
    const profile = profileScripts(text, encoding)

    expect(profile.chineseChars).toBe(0)
    expect(profile.nonChineseTokens).toBe(encoding.encode(text).length)
  })

  it('is empty for empty text', async () => {
    const encoding = await loadEncoding('o200k_base')
    expect(profileScripts('', encoding)).toEqual({ chineseChars: 0, nonChineseTokens: 0 })
  })
})

describe('estimateChineseEfficientTokens', () => {
  it('leaves text with no CJK completely alone', () => {
    expect(
      estimateChineseEfficientTokens({ chineseChars: 0, nonChineseTokens: 42 }),
    ).toBe(42)
  })

  it('is zero for empty text', () => {
    expect(
      estimateChineseEfficientTokens({ chineseChars: 0, nonChineseTokens: 0 }),
    ).toBe(0)
  })

  it('prices CJK characters below one token each', () => {
    const estimate = estimateChineseEfficientTokens({
      chineseChars: 100,
      nonChineseTokens: 0,
    })
    expect(estimate).toBe(Math.round(100 * CJK_EFFICIENT_TOKENS_PER_CHAR))
    expect(estimate).toBeLessThan(100)
  })

  it('never discounts the non-CJK part of a mixed prompt', async () => {
    // Regression: subtracting `chineseChars * 1.8` from the total used to eat
    // real English tokens, so an English-heavy prompt reported huge savings.
    const text = 'You are a helpful assistant. Summarize this document. 核心组件包括路由层'
    const encoding = await loadEncoding('o200k_base')
    const profile = profileScripts(text, encoding)
    const estimate = estimateChineseEfficientTokens(profile)

    expect(estimate).toBeGreaterThanOrEqual(profile.nonChineseTokens)
  })

  it('claims a saving only where the text is actually Chinese', async () => {
    const encoding = await loadEncoding('o200k_base')
    const english = 'You are a helpful assistant. Summarize this technical document.'
    const chinese = '人工智能大模型的推理成本主要由输入和输出的词元数量决定'

    const englishSaving =
      1 -
      estimateChineseEfficientTokens(profileScripts(english, encoding)) /
        encoding.encode(english).length
    const chineseSaving =
      1 -
      estimateChineseEfficientTokens(profileScripts(chinese, encoding)) /
        encoding.encode(chinese).length

    expect(englishSaving).toBe(0)
    expect(chineseSaving).toBeGreaterThan(0)
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

  it('exposes the script profile so pricing can be vocabulary-aware', async () => {
    const result = await analyze({
      text: 'Hello 中文',
      tokenizerId: 'o200k_base',
      wantSpans: false,
    })
    expect(result.chineseChars).toBe(2)
    expect(result.nonChineseTokens).toBeGreaterThan(0)
    // Encoding the runs separately loses merges across the CJK boundary, so
    // this can equal the whole-text count on very short strings.
    expect(result.nonChineseTokens).toBeLessThanOrEqual(result.openAiBaseline)
  })

  it('prices the Chinese estimate off the OpenAI baseline, not the estimate', async () => {
    const text = '中文测试内容需要更多的字符来产生差异'
    const result = await analyze({ text, tokenizerId: 'chinese_estimate', wantSpans: false })

    expect(result.tokenCount).toBe(result.chineseEfficient)
    expect(result.pricingBaseline).toBe(result.openAiBaseline)
  })

  it('finds no meaningful CJK saving against o200k, but a large one against cl100k', async () => {
    // o200k_base already encodes Chinese at ~0.64 tokens/char, so a
    // CJK-optimised vocabulary barely beats it. The inflation story only holds
    // against the older cl100k_base used by GPT-4-era deployments.
    const text = '人工智能大模型的推理成本主要由输入和输出的词元数量决定'
    const [modern, legacy] = await Promise.all([
      analyze({ text, tokenizerId: 'o200k_base', wantSpans: false }),
      analyze({ text, tokenizerId: 'cl100k_base', wantSpans: false }),
    ])

    const saving = (r: typeof modern) =>
      (r.openAiBaseline - r.chineseEfficient) / r.openAiBaseline

    expect(saving(modern)).toBeLessThan(0.15)
    expect(saving(legacy)).toBeGreaterThan(0.35)
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
