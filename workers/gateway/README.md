# Tokened Gateway (Cloudflare Worker)

OpenAI-compatible proxy with response caching and PII pre-check.

## Features (beta)

- `POST /v1/chat/completions` — proxy to OpenAI
- `POST /v1/embeddings` — proxy to OpenAI
- Response cache (`X-Tokened-Cache: HIT|MISS`)
- PII warning headers (`X-Tokened-PII-Warning`)
- Optional PII block (`PII_BLOCK=true`)

## Setup

```bash
cd workers/gateway
npm install
npx wrangler secret put OPENAI_API_KEY
npm run dev
```

## Deploy to api.tokened.uk

1. `npm run deploy`
2. In Cloudflare Dashboard → Workers → tokened-gateway → Settings → Domains
3. Add custom domain `api.tokened.uk`
4. Or add route in `wrangler.toml`:

```toml
routes = [{ pattern = "api.tokened.uk/*", zone_name = "tokened.uk" }]
```

## Client usage

```bash
curl https://api.tokened.uk/v1/chat/completions \
  -H "Authorization: Bearer YOUR_OPENAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]}'
```

Or in your app:

```env
OPENAI_BASE_URL=https://api.tokened.uk/v1
```

Note: Gateway uses Worker-level `OPENAI_API_KEY` secret. Client Authorization header is forwarded in future versions; MVP uses server-side key.