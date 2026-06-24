# tokened.uk

Global LLM token cost calculator, optimizer, and compliance platform.

**Every Token Counts.** Optimize LLM prompts, reduce costs, and ensure compliance globally.

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

## Roadmap

- **Phase 1** (current): Local token counting + cost comparison
- **Phase 2**: PII detection (PIPL/GDPR) + prompt optimization
- **Phase 3**: Tokened Gateway (`api.tokened.uk`)

## License

MIT