export interface Article {
  slug: string
  readTime: { en: string; zh: string }
  title: { en: string; zh: string }
  description: { en: string; zh: string }
  published: string
  sections: {
    heading: { en: string; zh: string }
    paragraphs: { en: string; zh: string }[]
  }[]
}

export const ARTICLES: Article[] = [
  {
    slug: 'chinese-token-cost',
    readTime: { en: '5 min read', zh: '5 分钟阅读' },
    title: {
      en: 'Why Chinese Prompts Cost More on OpenAI (And How to Fix It)',
      zh: '为什么中文 Prompt 在 OpenAI 上更费 Token？如何优化？',
    },
    description: {
      en: 'Deep dive into Chinese token inflation on cl100k_base vs DeepSeek and Qwen. Real savings strategies for bilingual LLM apps.',
      zh: '深度解析中文在 cl100k_base 上的 Token 膨胀，对比 DeepSeek/Qwen，并提供可落地的省钱策略。',
    },
    published: '2026-06-24',
    sections: [
      {
        heading: {
          en: 'The hidden tax on Chinese text',
          zh: '中文文本的隐藏成本',
        },
        paragraphs: [
          {
            en: 'OpenAI models use the cl100k_base tokenizer, which was optimised primarily for English. A single Chinese character often consumes 1.5–3 tokens, while the same semantic content on DeepSeek-V3 or Qwen may use only 0.5–1 token per character.',
            zh: 'OpenAI 模型使用主要为英文优化的 cl100k_base 分词器。一个汉字常常占用 1.5–3 个 Token，而相同语义在 DeepSeek-V3 或 Qwen 上可能只需 0.5–1 个 Token。',
          },
          {
            en: 'For a bilingual product with 10,000 daily API calls, this difference can translate to hundreds of dollars per month — without changing your application logic at all.',
            zh: '对于一个每天 1 万次 API 调用的双语产品，这种差异每月可能意味着数百美元的额外支出——而应用逻辑完全不用改。',
          },
        ],
      },
      {
        heading: {
          en: 'What you can do today',
          zh: '今天就能做的事',
        },
        paragraphs: [
          {
            en: '1. Audit prompts with a local tokenizer before shipping. 2. Move Chinese-heavy workloads to DeepSeek or Qwen where quality allows. 3. Trim system prompts — redundant instructions multiply across every call.',
            zh: '1. 上线前用本地分词器审计 Prompt。2. 在质量允许时将中文密集任务迁移到 DeepSeek 或 Qwen。3. 精简系统 Prompt — 冗余指令会在每次调用中成倍放大。',
          },
          {
            en: 'Tokened.uk runs entirely in your browser so you can compare models side-by-side without sending data to our servers.',
            zh: 'Tokened.uk 完全在浏览器运行，你可以并排对比各模型，无需把数据发到我们的服务器。',
          },
        ],
      },
    ],
  },
  {
    slug: 'prompt-caching-savings',
    readTime: { en: '4 min read', zh: '4 分钟阅读' },
    title: {
      en: 'How Prompt Caching Can Cut LLM API Spend by 40%',
      zh: 'Prompt 缓存如何削减最高 40% 的 LLM API 支出',
    },
    description: {
      en: 'Identical system prompts resent on every request are wasted spend. Learn how edge caching and Tokened Gateway solve this.',
      zh: '每次请求重复发送相同系统 Prompt 是纯粹浪费。了解边缘缓存与 Tokened Gateway 如何解决。',
    },
    published: '2026-06-24',
    sections: [
      {
        heading: {
          en: 'The duplication problem',
          zh: '重复发送问题',
        },
        paragraphs: [
          {
            en: 'Most chat apps send the full system prompt on every message. If your system prompt is 800 tokens and you handle 100k messages per day, you are paying for 80 million duplicate tokens daily — only the last user message actually changed.',
            zh: '大多数对话应用每条消息都发送完整系统 Prompt。若系统 Prompt 为 800 Token、日处理 10 万条消息，你每天为 8000 万重复 Token 买单——真正变化的只有最后一条用户消息。',
          },
        ],
      },
      {
        heading: {
          en: 'Cache at the edge',
          zh: '在边缘层缓存',
        },
        paragraphs: [
          {
            en: 'Tokened Gateway (beta) deduplicates identical prompt prefixes at the proxy layer. Point OPENAI_BASE_URL to api.tokened.uk and identical requests hit cache before reaching the provider.',
            zh: 'Tokened Gateway（Beta）在代理层对相同 Prompt 前缀去重。将 OPENAI_BASE_URL 指向 api.tokened.uk，相同请求在到达模型商之前即命中缓存。',
          },
          {
            en: 'For read-heavy workloads (support bots, documentation Q&A), teams typically see 25–40% cost reduction in early tests.',
            zh: '对于读多写少的场景（客服机器人、文档问答），早期测试通常可见 25–40% 的成本下降。',
          },
        ],
      },
    ],
  },
  {
    slug: 'gdpr-pipl-local-analysis',
    readTime: { en: '4 min read', zh: '4 分钟阅读' },
    title: {
      en: 'GDPR, PIPL, and Why Local Token Analysis Matters',
      zh: 'GDPR、PIPL 与为什么本地 Token 分析很重要',
    },
    description: {
      en: 'Sending prompts with PII to US-hosted LLMs creates compliance risk. Local-first tooling is the safest first step.',
      zh: '将含个人信息的 Prompt 发往美国托管的大模型存在合规风险。本地优先工具是最安全的第一步。',
    },
    published: '2026-06-24',
    sections: [
      {
        heading: {
          en: 'Data leaves your control fast',
          zh: '数据很快脱离你的控制',
        },
        paragraphs: [
          {
            en: 'When a developer pastes a customer email, UK postcode, or Chinese national ID into ChatGPT for "quick debugging", that data may be processed in the US under a different legal framework than GDPR or PIPL expects.',
            zh: '当开发者把客户邮箱、英国邮编或中国身份证号贴进 ChatGPT「快速调试」时，这些数据可能在美国处理，与 GDPR 或 PIPL 的要求不在同一法律框架下。',
          },
        ],
      },
      {
        heading: {
          en: 'Local-first is step one',
          zh: '本地优先是第一步',
        },
        paragraphs: [
          {
            en: 'Tokened counts tokens entirely in-browser — your prompt never touches our servers. Upcoming PII pre-check will flag sensitive patterns before you send anything upstream.',
            zh: 'Tokened 完全在浏览器内分词 — Prompt 不会触及我们的服务器。即将推出的 PII 预检将在数据上行前标记敏感模式。',
          },
          {
            en: 'Gateway adds a compliance layer: intercept, redact, or block prompts containing regulated data before they cross borders.',
            zh: 'Gateway 将增加合规层：在数据跨境前拦截、脱敏或阻断含监管数据的 Prompt。',
          },
        ],
      },
    ],
  },
]

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug)
}