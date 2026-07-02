# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Keep this file and README.md up to date.** Whenever you make a change that affects commands, architecture, conventions, or in-progress work, update the relevant section here in the same session — the next Claude instance to open this repo has no memory of this conversation and relies entirely on what's written here.

## What this is

tokened.uk — a client-side LLM token cost calculator/optimizer. Paste a prompt, see a live token breakdown and multi-model cost comparison. All tokenization runs in the browser (privacy pitch: prompts never leave the client). Bilingual (EN/中文). Currently a marketing site + free tool (Phase 1); a Cloudflare Worker gateway (Phase 3, `workers/gateway`) exists as a separate, not-yet-deployed proxy product.

## Commands

```bash
npm install
npm run dev          # vite dev server, http://localhost:5173
npm run build        # tsc -b && vite build
npm run preview
npm run lint         # oxlint
npm test             # vitest run
npm run test:watch   # vitest watch mode
```

Run a single test file: `npx vitest run src/lib/pricing.test.ts`
Run a single test by name: `npx vitest run -t "some test name"`

Gateway worker (separate npm workspace under `workers/gateway`, not installed by root `npm install`):

```bash
npm run gateway:install   # cd workers/gateway && npm install
npm run gateway:dev       # wrangler dev
npm run gateway:deploy    # wrangler deploy
```

CI (`.github/workflows/ci.yml`) runs `npm ci && npm run lint && npm test && npm run build` on push/PR to `main`.

## Architecture

### Tokenizer loading is lazy and chunk-per-encoding — don't undo this

`src/lib/tokenizer.ts` lazy-loads all three OpenAI encodings (`cl100k_base`, `o200k_base`, `p50k_base`) from `gpt-tokenizer` via dynamic `import()`, cached in a `Map` after first load. `vite.config.ts` has a `manualChunks` function that groups each encoding into its own `tokenizer-<name>` chunk by matching the import path — this is load-bearing. Each encoding table is large (~470KB–2MB unminified); if a future change causes them to be statically imported or merged into one chunk, the initial JS bundle balloons back up to several MB (this happened once already — see git history around the `cl100k_base` lazy-load fix). `preloadDefaultEncoding()` (called once in `main.tsx`) warms `o200k_base` + `cl100k_base` via `requestIdleCallback` so the editor feels instant without blocking first paint.

`estimateChineseEfficientTokens` and `tokenizeToSpans`'s Chinese-estimate path both need the `cl100k_base` baseline internally (for the "Chinese token inflation vs OpenAI" stat), so they're `async` and go through `loadEncoding('cl100k_base')` rather than a static import.

### i18n: two full dictionaries, type-checked against each other

`src/i18n/en.ts` defines both the `en` object and the `Locale` type (derived from it). `src/i18n/zh.ts` is declared `satisfies Locale` — this means **the zh dictionary cannot compile if it's missing a key that exists in en**, so translation parity is enforced by `tsc`, not by convention. When adding any new UI copy: add the key + value to `en.ts` (object and `Locale` type), then add the matching key to `zh.ts`; a build/typecheck failure means zh is out of sync.

Language state lives in `I18nProvider` (`src/providers/I18nProvider.tsx`), backed by `localStorage` (`tokened-lang`) with browser-language auto-detect as the default (`detectLanguage()` in `src/i18n/index.ts`). Consume via the `useI18n()` hook (`{ lang, t, setLang }`), never import the dictionaries directly in components.

### Pricing is a hardcoded, dated snapshot

`src/lib/pricing.ts`'s `MODELS` array is manually maintained pricing data (not fetched from anywhere), with a `PRICING_SNAPSHOT_DATE` constant surfaced in the UI via `formatPricingSnapshotDate()` (shown under the cost comparison chart in `TokenEditor`/`CostChart`). When updating model prices, bump `PRICING_SNAPSHOT_DATE` too — it's the site's only signal to users that the numbers might be stale. `tokenMultiplier` on each model approximates how that model's tokenizer compares to `cl100k_base` for cost-estimation purposes; it's a heuristic, not derived from the actual tokenizer.

### Single-page landing site, section-based navigation

There's effectively one real page (`src/pages/LandingPage.tsx`), composed of ~15 section components rendered in sequence inside `<main>`, each with an `id` matching its nav anchor (`#tool`, `#how`, `#features`, `#pricing`, `#faq`, `#waitlist`, etc.). Header/footer links and cross-page links (e.g. from `/blog`) use `/#section-id` hash URLs; `useHashScroll()` handles scrolling to the right section on load/hash change (needed because React Router doesn't do this itself for hash fragments). `/blog` and `/blog/:slug` are the only other real routes, driven by the `ARTICLES` array in `src/data/articles.ts` (each article has both `en` and `zh` copy inline, not routed through the `i18n` dictionaries).

### Contact/waitlist: two parallel implementations, only one is wired up

`SimpleContact.tsx` (mailto-links only, rendered inside `WaitlistSection`) is what's actually live. `WaitlistForm.tsx` (full email/interest/message form, Formspree-backed via `src/lib/formspree.ts`, includes a honeypot field) is **not currently rendered anywhere** — it was superseded by `SimpleContact` in a past "simplify contact UX" change but not deleted. Before extending waitlist/contact functionality, check which of these the current work is actually meant to affect, since editing `WaitlistForm.tsx` alone has no effect on the live site.

### Env-gated third-party integrations follow one pattern

Both Formspree (`src/lib/formspree.ts`) and Plausible analytics (`src/lib/analytics.ts`) follow the same shape: a `VITE_*` env var (see `.env.example`) that's empty/undefined by default, a `has*()` guard function, and the feature no-ops entirely (no network calls, no injected scripts) when unset. Follow this pattern for any new third-party integration rather than hardcoding credentials or always-on scripts — the product's privacy pitch depends on nothing calling out by default.

### CSP allowlist must be updated alongside new external calls

`public/_headers` has a `Content-Security-Policy` covering `script-src`, `style-src`, `font-src`, `connect-src`, etc. If you add a call to a new third-party domain (a new analytics provider, a new form backend, a font host), add it to the matching CSP directive in `public/_headers` or the request will be silently blocked in production (Cloudflare Pages serves this file as-is; there's no CSP enforcement in local `vite dev`, so this class of bug won't show up until deployed).

### Gateway worker is a separate deployable, not part of the Vite build

`workers/gateway` is an independent Cloudflare Worker (own `package.json`, `tsconfig.json`, `wrangler.toml`) implementing an OpenAI-compatible proxy with edge caching and regex-based PII detection (`workers/gateway/src/index.ts`). It's not imported by or built with the main site. Landing-page copy (`SaasPitch`, `Roadmap`, `gatewayBeta` i18n keys) describes it as "not live yet" / in development — keep that framing in sync with actual deployment status if the worker gets deployed to `api.tokened.uk`.

## Testing

Tests live next to source as `*.test.ts` (e.g. `src/lib/pricing.test.ts`), run by vitest with no special config beyond the default (no `vitest.config.ts` — it picks up `vite.config.ts`). Coverage so far is limited to the pure-logic `src/lib/*` modules (tokenizer, pricing, currency); components are untested.
