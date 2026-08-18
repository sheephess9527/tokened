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

**`sitemap.xml` is generated at build time** from `src/data/articles.ts`, so adding
an article is enough to get it indexed.

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

`npm run lint` runs oxlint.

## Roadmap

- **Phase 1** (current): Local token counting + cost comparison
- **Phase 2**: PII detection (PIPL/GDPR) + prompt optimization
- **Phase 3**: Tokened Gateway (`api.tokened.uk`)

## License

MIT
