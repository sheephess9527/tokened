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
      en: 'How Much Do Chinese Prompts Really Cost on OpenAI? (Measured)',
      zh: '中文 Prompt 在 OpenAI 上到底多花多少 Token？（实测）',
    },
    description: {
      en: 'Measured: cl100k_base spends ~1.10 tokens per Chinese character, o200k_base only ~0.64. Where the Chinese token penalty still bites, and where the real saving comes from today.',
      zh: '实测：cl100k_base 每个汉字约 1.10 个 Token，o200k_base 只要 ~0.64。中文 Token 惩罚今天还剩多少，真正的省钱空间又在哪里。',
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
            en: 'The Chinese token penalty is real, but it is a cl100k_base problem. Measured on ordinary prose, cl100k_base — the tokenizer behind GPT-4-era deployments — spends about 1.10 tokens per Chinese character. o200k_base, used by GPT-5.x and GPT-4o, spends about 0.64. A CJK-optimised vocabulary such as DeepSeek-V4-Flash or Qwen3.7-Plus lands near 0.6.',
            zh: '中文的 Token 惩罚确实存在，但它主要是 cl100k_base 的问题。在普通散文上实测，GPT-4 时代所用的 cl100k_base 每个汉字约需 1.10 个 Token；GPT-5.x 与 GPT-4o 使用的 o200k_base 约为 0.64；而 DeepSeek-V4-Flash、Qwen3.7-Plus 这类面向中文优化的词表大约在 0.6。',
          },
          {
            en: 'So switching a Chinese workload from GPT-4-era models to a CJK-optimised one still cuts roughly 40% of the token count, but moving from o200k_base saves only around 10%. English text is unaffected either way: no vocabulary gives you a discount on ASCII.',
            zh: '因此，把中文任务从 GPT-4 时代的模型换到中文优化词表，仍能省下约 40% 的 Token；但如果你已经在用 o200k_base，这一项只剩 10% 左右。英文文本则完全不受影响——没有哪个词表能让 ASCII 变便宜。',
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
            en: 'The bigger lever today is price per token, not token count. DeepSeek-V4-Flash lists at $0.14 per million input tokens against $2.50 for GPT-5.4 — roughly 18x, dwarfing any tokenizer difference. So: 1. Audit prompts with a local tokenizer before shipping, and check which encoding you are actually on. 2. Compare on total cost, not token count. 3. Trim system prompts — redundant instructions multiply across every call.',
            zh: '今天更大的杠杆是单价，而不是 Token 数量。DeepSeek-V4-Flash 的输入价是每百万 Token $0.14，GPT-5.4 是 $2.50——约 18 倍差距，远超任何分词器差异。所以：1. 上线前用本地分词器审计 Prompt，并确认你实际用的是哪个编码。2. 用总成本而不是 Token 数量做对比。3. 精简系统 Prompt——冗余指令会在每次调用中成倍放大。',
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