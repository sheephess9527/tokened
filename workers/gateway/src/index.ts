export interface Env {
  OPENAI_API_KEY: string
  OPENAI_BASE_URL?: string
  CACHE_TTL_SECONDS?: string
  PII_BLOCK?: string
}

const DEFAULT_UPSTREAM = 'https://api.openai.com'

const PII_PATTERNS: { name: string; regex: RegExp }[] = [
  { name: 'email', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/ },
  { name: 'uk_ni', regex: /\b[A-Z]{2}\d{6}[A-Z]?\b/i },
  { name: 'uk_postcode', regex: /\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/i },
  { name: 'cn_id', regex: /\b\d{17}[\dXx]\b/ },
  { name: 'cn_mobile', regex: /\b1[3-9]\d{9}\b/ },
  { name: 'credit_card', regex: /\b(?:\d[ -]*?){13,19}\b/ },
]

function corsHeaders(origin: string | null): HeadersInit {
  return {
    'Access-Control-Allow-Origin': origin ?? '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, X-Tokened-Skip-PII, X-Tokened-Cache',
    'Access-Control-Expose-Headers':
      'X-Tokened-Cache, X-Tokened-PII-Warning, X-Tokened-Gateway',
  }
}

function detectPii(text: string): string[] {
  const found: string[] = []
  for (const { name, regex } of PII_PATTERNS) {
    if (regex.test(text)) found.push(name)
  }
  return found
}

function extractTexts(body: unknown): string {
  if (!body || typeof body !== 'object') return ''
  const messages = (body as { messages?: { content?: string }[] }).messages
  if (!Array.isArray(messages)) return JSON.stringify(body)
  return messages.map((m) => m.content ?? '').join('\n')
}

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    const origin = request.headers.get('Origin')
    const headers = corsHeaders(origin)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers })
    }

    if (url.pathname === '/' || url.pathname === '/health') {
      return Response.json(
        {
          service: 'tokened-gateway',
          version: '0.1.0-beta',
          status: 'ok',
          endpoints: ['/v1/chat/completions', '/v1/embeddings'],
          docs: 'https://tokened.uk/#gateway-beta',
        },
        { headers: { ...headers, 'X-Tokened-Gateway': 'beta' } },
      )
    }

    if (!url.pathname.startsWith('/v1/')) {
      return Response.json({ error: 'Not found' }, { status: 404, headers })
    }

    if (!env.OPENAI_API_KEY && !request.headers.get('Authorization')) {
      return Response.json(
        {
          error:
            'Gateway requires OPENAI_API_KEY secret or client Authorization header',
        },
        { status: 503, headers },
      )
    }

    if (request.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405, headers })
    }

    const rawBody = await request.text()
    let parsed: unknown
    try {
      parsed = JSON.parse(rawBody)
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400, headers })
    }

    const skipPii = request.headers.get('X-Tokened-Skip-PII') === 'true'
    const piiFound = skipPii ? [] : detectPii(extractTexts(parsed))

    if (piiFound.length > 0 && env.PII_BLOCK === 'true') {
      return Response.json(
        {
          error: 'PII detected in request',
          types: piiFound,
          hint: 'Redact sensitive data or set X-Tokened-Skip-PII: true after review',
        },
        { status: 422, headers: { ...headers, 'X-Tokened-PII-Warning': piiFound.join(',') } },
      )
    }

    const upstream = (env.OPENAI_BASE_URL ?? DEFAULT_UPSTREAM).replace(/\/$/, '')
    const upstreamUrl = `${upstream}${url.pathname}${url.search}`

    const useCache = request.headers.get('X-Tokened-Cache') !== 'false'
    const cacheKey = useCache ? await sha256(`${upstreamUrl}:${rawBody}`) : null

    if (cacheKey) {
      const cache = caches.default
      const cacheRequest = new Request(`https://tokened.cache/${cacheKey}`)
      const cached = await cache.match(cacheRequest)
      if (cached) {
        const res = new Response(cached.body, cached)
        res.headers.set('X-Tokened-Cache', 'HIT')
        res.headers.set('X-Tokened-Gateway', 'beta')
        if (piiFound.length) res.headers.set('X-Tokened-PII-Warning', piiFound.join(','))
        return res
      }
    }

    const clientAuth = request.headers.get('Authorization')
    const upstreamResponse = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: clientAuth ?? `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: rawBody,
    })

    const responseBody = await upstreamResponse.text()
    const responseHeaders = new Headers(upstreamResponse.headers)
    responseHeaders.set('X-Tokened-Cache', 'MISS')
    responseHeaders.set('X-Tokened-Gateway', 'beta')
    if (piiFound.length) responseHeaders.set('X-Tokened-PII-Warning', piiFound.join(','))
    Object.entries(headers).forEach(([k, v]) => responseHeaders.set(k, v))

    const response = new Response(responseBody, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    })

    if (cacheKey && upstreamResponse.ok) {
      const ttl = parseInt(env.CACHE_TTL_SECONDS ?? '3600', 10)
      const cacheResponse = response.clone()
      cacheResponse.headers.set('Cache-Control', `max-age=${ttl}`)
      ctx.waitUntil(caches.default.put(new Request(`https://tokened.cache/${cacheKey}`), cacheResponse))
    }

    return response
  },
}