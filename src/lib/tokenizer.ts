import * as cl100k from 'gpt-tokenizer/encoding/cl100k_base'

export type TokenizerId =
  | 'cl100k_base'
  | 'o200k_base'
  | 'p50k_base'
  | 'chinese_estimate'

export function isOpenAiEncoding(tokenizerId: TokenizerId): boolean {
  return tokenizerId !== 'chinese_estimate'
}

export interface TokenSpan {
  text: string
  tokenIndex: number
}

interface EncodingApi {
  encode: (text: string) => number[]
  decode: (tokens: Iterable<number>) => string
}

const encodingCache = new Map<TokenizerId, EncodingApi>()
encodingCache.set('cl100k_base', cl100k)

const lazyLoaders: Record<
  Exclude<TokenizerId, 'cl100k_base' | 'chinese_estimate'>,
  () => Promise<EncodingApi>
> = {
  o200k_base: async () => {
    const mod = await import('gpt-tokenizer/encoding/o200k_base')
    return mod
  },
  p50k_base: async () => {
    const mod = await import('gpt-tokenizer/encoding/p50k_base')
    return mod
  },
}

export async function loadEncoding(
  tokenizerId: Exclude<TokenizerId, 'chinese_estimate'>,
): Promise<EncodingApi> {
  const cached = encodingCache.get(tokenizerId)
  if (cached) return cached

  const loader = lazyLoaders[tokenizerId as keyof typeof lazyLoaders]
  if (!loader) return cl100k

  const encoding = await loader()
  encodingCache.set(tokenizerId, encoding)
  return encoding
}

/** Preload default tokenizer on idle */
export function preloadDefaultEncoding() {
  void loadEncoding('o200k_base')
}

const CHINESE_CHAR_RE = /[\u4e00-\u9fff\u3400-\u4dbf]/

export function countChineseChars(text: string): number {
  const matches = text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g)
  return matches?.length ?? 0
}

export function hasChinese(text: string): boolean {
  return CHINESE_CHAR_RE.test(text)
}

export async function countTokens(
  text: string,
  tokenizerId: TokenizerId,
): Promise<number> {
  if (!text) return 0

  if (tokenizerId === 'chinese_estimate') {
    return estimateChineseEfficientTokens(text)
  }

  const encoding = await loadEncoding(tokenizerId)
  return encoding.encode(text).length
}

export function estimateChineseEfficientTokens(text: string): number {
  if (!text) return 0

  const chineseCount = countChineseChars(text)
  const openAiCount = cl100k.encode(text).length
  if (chineseCount === 0) return openAiCount

  const chineseEfficient = Math.ceil(chineseCount * 0.55)
  const nonChineseTokens = Math.max(0, openAiCount - Math.ceil(chineseCount * 1.8))
  return chineseEfficient + nonChineseTokens
}

export async function tokenizeToSpans(
  text: string,
  tokenizerId: TokenizerId,
): Promise<TokenSpan[]> {
  if (!text) return []

  if (tokenizerId === 'chinese_estimate') {
    return approximateChineseSpans(text)
  }

  const encoding = await loadEncoding(tokenizerId)
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