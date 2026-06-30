import { describe, expect, it } from 'vitest'
import {
  colorForToken,
  countChineseChars,
  countTokens,
  hasChinese,
  isOpenAiEncoding,
  tokenizeToSpans,
  TOKEN_COLORS,
} from './tokenizer'

describe('hasChinese / countChineseChars', () => {
  it('detects Chinese characters', () => {
    expect(hasChinese('hello 世界')).toBe(true)
    expect(hasChinese('hello world')).toBe(false)
  })

  it('counts only Chinese characters', () => {
    expect(countChineseChars('hello 世界')).toBe(2)
    expect(countChineseChars('hello world')).toBe(0)
  })
})

describe('isOpenAiEncoding', () => {
  it('treats chinese_estimate as non-OpenAI', () => {
    expect(isOpenAiEncoding('chinese_estimate')).toBe(false)
  })

  it('treats OpenAI encodings as OpenAI', () => {
    expect(isOpenAiEncoding('cl100k_base')).toBe(true)
    expect(isOpenAiEncoding('o200k_base')).toBe(true)
    expect(isOpenAiEncoding('p50k_base')).toBe(true)
  })
})

describe('countTokens', () => {
  it('returns 0 for empty text', async () => {
    expect(await countTokens('', 'cl100k_base')).toBe(0)
  })

  it('counts tokens with the cl100k_base encoding', async () => {
    const count = await countTokens('hello world', 'cl100k_base')
    expect(count).toBeGreaterThan(0)
  })

  it('lazy-loads the o200k_base encoding', async () => {
    const count = await countTokens('hello world', 'o200k_base')
    expect(count).toBeGreaterThan(0)
  })

  it('uses the Chinese-efficient estimate path', async () => {
    const count = await countTokens('你好世界', 'chinese_estimate')
    expect(count).toBeGreaterThan(0)
  })
})

describe('tokenizeToSpans', () => {
  it('returns an empty array for empty text', async () => {
    expect(await tokenizeToSpans('', 'cl100k_base')).toEqual([])
  })

  it('reconstructs the original text from span text', async () => {
    const spans = await tokenizeToSpans('hello world', 'cl100k_base')
    expect(spans.map((s) => s.text).join('')).toBe('hello world')
  })

  it('assigns one span per Chinese character', async () => {
    const spans = await tokenizeToSpans('你好', 'chinese_estimate')
    const chineseSpans = spans.filter((s) => /[一-鿿]/.test(s.text))
    expect(chineseSpans).toHaveLength(2)
  })
})

describe('colorForToken', () => {
  it('cycles through the palette', () => {
    expect(colorForToken(0)).toBe(TOKEN_COLORS[0])
    expect(colorForToken(TOKEN_COLORS.length)).toBe(TOKEN_COLORS[0])
    expect(colorForToken(TOKEN_COLORS.length + 2)).toBe(TOKEN_COLORS[2])
  })
})
