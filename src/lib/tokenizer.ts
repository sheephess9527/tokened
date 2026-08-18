export type TokenizerId =
  | 'cl100k_base'
  | 'o200k_base'
  | 'p50k_base'
  | 'chinese_estimate'

export type OpenAiEncodingId = Exclude<TokenizerId, 'chinese_estimate'>

/** Encoding used as the "OpenAI baseline" when the Chinese estimate is selected. */
export const DEFAULT_ENCODING: OpenAiEncodingId = 'o200k_base'

/** Upper bound on rendered token blocks — a long prompt would otherwise emit tens of thousands of DOM nodes. */
export const SPAN_LIMIT = 1500

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

const loaders: Record<OpenAiEncodingId, () => Promise<EncodingApi>> = {
  cl100k_base: () => import('gpt-tokenizer/encoding/cl100k_base'),
  o200k_base: () => import('gpt-tokenizer/encoding/o200k_base'),
  p50k_base: () => import('gpt-tokenizer/encoding/p50k_base'),
}

const encodingCache = new Map<OpenAiEncodingId, EncodingApi>()
const inflight = new Map<OpenAiEncodingId, Promise<EncodingApi>>()

/**
 * Encodings are ~1MB+ of BPE data each, so every one is loaded on demand and
 * never bundled into the initial payload. Concurrent callers share one request.
 */
export async function loadEncoding(
  tokenizerId: OpenAiEncodingId,
): Promise<EncodingApi> {
  const cached = encodingCache.get(tokenizerId)
  if (cached) return cached

  const pending = inflight.get(tokenizerId)
  if (pending) return pending

  const loader = loaders[tokenizerId] ?? loaders[DEFAULT_ENCODING]
  const promise = loader()
    .then((encoding) => {
      encodingCache.set(tokenizerId, encoding)
      return encoding
    })
    .finally(() => {
      inflight.delete(tokenizerId)
    })

  inflight.set(tokenizerId, promise)
  return promise
}

/** Resolve the OpenAI encoding that backs pricing and the Chinese comparison. */
export function baselineEncodingFor(tokenizerId: TokenizerId): OpenAiEncodingId {
  return isOpenAiEncoding(tokenizerId)
    ? (tokenizerId as OpenAiEncodingId)
    : DEFAULT_ENCODING
}

const CHINESE_CHAR_RE = /[\u4e00-\u9fff\u3400-\u4dbf]/
const CHINESE_CHAR_GLOBAL_RE = /[\u4e00-\u9fff\u3400-\u4dbf]/g

export function countChineseChars(text: string): number {
  return text.match(CHINESE_CHAR_GLOBAL_RE)?.length ?? 0
}

export function hasChinese(text: string): boolean {
  return CHINESE_CHAR_RE.test(text)
}

/**
 * Heuristic count for CJK-optimised vocabularies (DeepSeek / Qwen), derived
 * from an OpenAI count that has already been computed — never re-encodes.
 */
export function estimateChineseEfficientTokens(
  text: string,
  openAiCount: number,
): number {
  if (!text) return 0

  const chineseCount = countChineseChars(text)
  if (chineseCount === 0) return openAiCount

  const chineseEfficient = Math.ceil(chineseCount * 0.55)
  const nonChineseTokens = Math.max(0, openAiCount - Math.ceil(chineseCount * 1.8))
  return chineseEfficient + nonChineseTokens
}

export interface AnalysisRequest {
  text: string
  tokenizerId: TokenizerId
  wantSpans: boolean
  spanLimit?: number
}

export interface AnalysisResult {
  /** Token count under the selected tokenizer. */
  tokenCount: number
  /** Count under the backing OpenAI encoding — the Chinese-inflation reference. */
  openAiBaseline: number
  /** Count fed into per-model pricing (models apply their own multiplier). */
  pricingBaseline: number
  chineseEfficient: number
  chineseChars: number
  charCount: number
  spans: TokenSpan[]
  /** True when spans were cut off at the limit. */
  spansTruncated: boolean
}

const EMPTY_RESULT: AnalysisResult = {
  tokenCount: 0,
  openAiBaseline: 0,
  pricingBaseline: 0,
  chineseEfficient: 0,
  chineseChars: 0,
  charCount: 0,
  spans: [],
  spansTruncated: false,
}

export function emptyAnalysis(): AnalysisResult {
  return { ...EMPTY_RESULT, spans: [] }
}

/**
 * Every metric the UI needs from a single encode pass. The previous
 * implementation encoded the same text four times per keystroke.
 */
export async function analyze({
  text,
  tokenizerId,
  wantSpans,
  spanLimit = SPAN_LIMIT,
}: AnalysisRequest): Promise<AnalysisResult> {
  if (!text) return emptyAnalysis()

  const baselineId = baselineEncodingFor(tokenizerId)
  const encoding = await loadEncoding(baselineId)
  const tokenIds = encoding.encode(text)
  const openAiBaseline = tokenIds.length
  const chineseEfficient = estimateChineseEfficientTokens(text, openAiBaseline)
  const usesOpenAi = isOpenAiEncoding(tokenizerId)
  const tokenCount = usesOpenAi ? openAiBaseline : chineseEfficient

  let spans: TokenSpan[] = []
  let spansTruncated = false

  if (wantSpans) {
    if (usesOpenAi) {
      const shown = Math.min(tokenIds.length, spanLimit)
      spansTruncated = shown < tokenIds.length
      spans = new Array(shown)
      for (let i = 0; i < shown; i++) {
        spans[i] = { text: encoding.decode([tokenIds[i]]), tokenIndex: i }
      }
    } else {
      const approximate = approximateChineseSpans(text, encoding, spanLimit)
      spans = approximate.spans
      spansTruncated = approximate.truncated
    }
  }

  return {
    tokenCount,
    openAiBaseline,
    pricingBaseline: usesOpenAi ? tokenCount : openAiBaseline,
    chineseEfficient,
    chineseChars: countChineseChars(text),
    charCount: text.length,
    spans,
    spansTruncated,
  }
}

/**
 * CJK-vocabulary preview: each Chinese character is shown as one token, runs of
 * other text keep their real BPE split.
 */
function approximateChineseSpans(
  text: string,
  encoding: EncodingApi,
  spanLimit: number,
): { spans: TokenSpan[]; truncated: boolean } {
  const spans: TokenSpan[] = []
  let tokenIndex = 0
  let buffer = ''

  const flush = (): boolean => {
    if (!buffer) return true
    for (const id of encoding.encode(buffer)) {
      if (spans.length >= spanLimit) return false
      spans.push({ text: encoding.decode([id]), tokenIndex })
      tokenIndex++
    }
    buffer = ''
    return true
  }

  for (const char of text) {
    if (CHINESE_CHAR_RE.test(char)) {
      if (!flush()) return { spans, truncated: true }
      if (spans.length >= spanLimit) return { spans, truncated: true }
      spans.push({ text: char, tokenIndex })
      tokenIndex++
    } else {
      buffer += char
      if (buffer.length >= 256 && !flush()) return { spans, truncated: true }
    }
  }

  if (!flush()) return { spans, truncated: true }
  return { spans, truncated: false }
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
