# tokened.uk

Global LLM token cost calculator, optimizer, and compliance platform.

**Every Token Counts.** Optimize LLM prompts, reduce costs, and ensure compliance globally.

## Features

- Dual-pane interactive token editor with live token-block highlighting
- OpenAI tokenizer support (`o200k_base`, `cl100k_base`, `p50k_base`) via `gpt-tokenizer`
- Chinese token efficiency comparison (DeepSeek / Qwen estimate)
- Multi-model cost comparison (GPT-5.x, Claude, Gemini, DeepSeek, Qwen)
- Usage assumptions — output tokens per call and calls per month feed a projected monthly cost
- Shareable links: tokenizer, currency, and usage assumptions are encoded in the query string
- Multi-currency support (USD, GBP, CNY)
- EN / 中文 language switcher
- Dark minimalist developer-focused UI

## Tech Stack

- React 19 + TypeScript + Vite
- CSS Modules (no Tailwind)
- `gpt-tokenizer` — browser-local token counting (privacy-first)

## Architecture notes

**Routes are prerendered to static HTML.** `npm run build` runs a second, SSR
build of `src/entry-server.tsx` and `scripts/prerender.mjs` writes a real file
for `/`, `/blog`, every article and `404.html`, each with its own title,
canonical and Open Graph tags. `src/lib/routeMeta.ts` is the single source of
those tags, shared by the prerender and by `usePageMeta` at runtime, so the
static HTML and client-side navigation cannot drift apart. The browser hydrates
that markup rather than rebuilding it, so anything read from `localStorage` or
the query string is applied after hydration instead of during render.

Because every route is a real file there is no SPA catch-all in `_redirects`:
an unknown path falls through to `404.html` and gets a 404 status instead of the
landing page under a misleading 200.

Pages are prerendered in English. A visitor whose browser is set to Chinese sees
the English markup until hydration swaps it — the cost of serving both languages
from one URL. Splitting them onto `/` and `/zh` with `hreflang` alternates would
remove that, at the price of a URL change.

**Tokenization runs in a Web Worker.** `src/workers/tokenizer.worker.ts` owns the
encoders; `src/lib/analysisClient.ts` is the main-thread client, with request ids
so stale responses are discarded and a main-thread fallback wherever module
workers are unavailable. `analyze()` derives every metric the UI needs — token
count, OpenAI baseline, Chinese estimate, and token spans — from a single encode
pass, and `useTokenAnalysis` debounces keystrokes on top of that.

**Encodings are never in the initial payload.** Each BPE rank table is 0.5–2MB, so
`vite.config.ts` isolates each one, plus the shared tokenizer runtime, into its own
chunk (`build.rollupOptions.output.advancedChunks`). Nothing tokenizer-related is
requested until the first analysis runs, and only the selected encoding is fetched.

**Routes are code-split.** The blog and 404 pages load on demand; the landing page
ships without them.

**`sitemap.xml` and `feed.xml` are generated at build time** from
`src/data/articles.ts`, so adding an article is enough to get it indexed and
into the RSS feed.

**Fonts are self-hosted** under `public/fonts` (regenerate with
`node scripts/fetch-fonts.mjs`). With no third-party origins left, `public/_headers`
can enforce a Content-Security-Policy with `script-src 'self'` and no wildcards.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
npm run preview
```

```bash
npm test          # vitest
npm run lint      # oxlint
```

CI runs lint, tests and the build on every push and pull request.

## Roadmap

- **Phase 1** (current): Local token counting + cost comparison
- **Phase 2**: PII detection (PIPL/GDPR) + prompt optimization
- **Phase 3**: Tokened Gateway (`api.tokened.uk`)

## License

MIT
