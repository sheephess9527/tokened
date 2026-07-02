# tokened.uk

Global LLM token cost calculator, optimizer, and compliance platform.

**Every Token Counts.** Optimize LLM prompts, reduce costs, and ensure compliance globally.

> Working on this repo with Claude Code? See [`CLAUDE.md`](./CLAUDE.md) for architecture notes and gotchas — keep it updated alongside this file.

## MVP Features

- Dual-pane interactive token editor with live highlighting
- OpenAI tokenizer support (`cl100k_base`, `o200k_base`, `p50k_base`) via `gpt-tokenizer`
- Chinese token efficiency comparison (DeepSeek/Qwen estimate)
- Multi-model cost comparison (GPT-4o, Claude, Gemini, DeepSeek, Qwen)
- Multi-currency support (USD, GBP, CNY)
- EN / 中文 language switcher
- Dark minimalist developer-focused UI

## Tech Stack

- React 19 + TypeScript + Vite
- CSS Modules (no Tailwind)
- `gpt-tokenizer` — browser-local token counting (privacy-first)

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

## Lint & Test

```bash
npm run lint
npm test
```

Unit tests cover the tokenizer, pricing, and currency conversion logic in `src/lib`. CI (`.github/workflows/ci.yml`) runs lint, test, and build on every push/PR to `main`.

## Analytics (optional)

Set `VITE_PLAUSIBLE_DOMAIN` in `.env` to enable cookieless [Plausible](https://plausible.io) analytics. Leave it empty to ship with zero third-party tracking.

## Roadmap

- **Phase 1** (current): Local token counting + cost comparison
- **Phase 2**: PII detection (PIPL/GDPR) + prompt optimization
- **Phase 3**: Tokened Gateway (`api.tokened.uk`)

## License

MIT