import * as cl100k from 'gpt-tokenizer/encoding/cl100k_base'
import * as o200k from 'gpt-tokenizer/encoding/o200k_base'
import * as p50k from 'gpt-tokenizer/encoding/p50k_base'

export type TokenizerId =
  | 'cl100k_base'
  | 'o200k_base'
  | 'p50k_base'
  | 'chinese_estimate'

export interface TokenSpan {
  text: string
  tokenIndex: number
}

interface EncodingApi {
  encode: (text: string) => number[]
  decode: (tokens: Iterable<number>) => string
}

const ENCODINGS: Record<
  Exclude<TokenizerId, 'chinese_estimate'>,
  EncodingApi
> = {
  cl100k_base: cl100k,
  o200k_base: o200k,
  p50k_base: p50k,
}

const CHINESE_CHAR_RE = /[\u4e00-\u9fff\u3400-\u4dbf]/

export function countChineseChars(text: string): number {
  const matches = text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g)
  return matches?.length ?? 0
}

export function hasChinese(text: string): boolean {
  return CHINESE_CHAR_RE.test(text)
}

function getEncoding(tokenizerId: Exclude<TokenizerId, 'chinese_estimate'>) {
  return ENCODINGS[tokenizerId]
}

export function countTokens(text: string, tokenizerId: TokenizerId): number {
  if (!text) return 0

  if (tokenizerId === 'chinese_estimate') {
    return estimateChineseEfficientTokens(text)
  }

  return getEncoding(tokenizerId).encode(text).length
}

/** Approximate DeepSeek/Qwen-style efficiency for Chinese-heavy text */
export function estimateChineseEfficientTokens(text: string): number {
  if (!text) return 0

  const chineseCount = countChineseChars(text)
  const openAiCount = cl100k.encode(text).length
  if (chineseCount === 0) return openAiCount

  const chineseEfficient = Math.ceil(chineseCount * 0.55)
  const nonChineseTokens = Math.max(0, openAiCount - Math.ceil(chineseCount * 1.8))
  return chineseEfficient + nonChineseTokens
}

export function tokenizeToSpans(
  text: string,
  tokenizerId: TokenizerId,
): TokenSpan[] {
  if (!text) return []

  if (tokenizerId === 'chinese_estimate') {
    return approximateChineseSpans(text)
  }

  const encoding = getEncoding(tokenizerId)
  const tokenIds = encoding.encode(text)

  return tokenIds.map((id, index) => ({
    text: encoding.decode([id]),
    tokenIndex: index,
  }))
}

function approximateChineseSpans(text: string): TokenSpan[] {
  const spans: TokenSpan[] = []
  let tokenIndex = 0
  let buffer = ''

  for (const char of text) {
    if (CHINESE_CHAR_RE.test(char)) {
      if (buffer) {
        const ids = cl100k.encode(buffer)
        for (const id of ids) {
          spans.push({ text: cl100k.decode([id]), tokenIndex })
          tokenIndex++
        }
        buffer = ''
      }
      spans.push({ text: char, tokenIndex })
      tokenIndex++
    } else {
      buffer += char
    }
  }

  if (buffer) {
    const ids = cl100k.encode(buffer)
    for (const id of ids) {
      spans.push({ text: cl100k.decode([id]), tokenIndex })
      tokenIndex++
    }
  }

  return spans
}

export const TOKEN_COLORS = [
  '#7C3AED',
  '#06B6D4',
  '#10B981',
  '#F59E0B',
  '#EC4899',
  '#8B5CF6',
  '#14B8A6',
  '#F97316',
]

export function colorForToken(index: number): string {
  return TOKEN_COLORS[index % TOKEN_COLORS.length]
}