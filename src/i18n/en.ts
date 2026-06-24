export const en = {
  brand: 'tokened.uk',
  nav: {
    docs: 'Docs',
    pricing: 'Pricing',
    github: 'GitHub',
  },
  hero: {
    title: 'Every Token Counts.',
    subtitle:
      'Optimize LLM prompts, reduce costs, and ensure compliance globally.',
    tagline: 'See how every model tokenizes your prompt — and what it costs.',
  },
  editor: {
    inputLabel: 'Input Prompt',
    inputPlaceholder:
      'Paste your prompt here… Try mixing English and 中文 to compare token efficiency.',
    analysisLabel: 'Token Analysis',
    tokenizer: 'Tokenizer',
    tokenizers: {
      cl100k_base: 'OpenAI (cl100k_base)',
      o200k_base: 'OpenAI (o200k_base)',
      p50k_base: 'OpenAI Legacy (p50k_base)',
      chinese_estimate: 'Chinese-efficient estimate',
    },
    totalTokens: 'Total Tokens',
    chars: 'Characters',
    showBlocks: 'Show Token Blocks',
    hideBlocks: 'Hide Token Blocks',
    estCost: 'Estimated Cost (per call)',
    bestValue: 'Best Value',
    chineseInflation: 'Chinese Token Inflation',
    chineseInflationHint:
      'Same Chinese text often uses fewer tokens on DeepSeek/Qwen than on OpenAI cl100k_base.',
    inflationVsOpenAI: 'vs OpenAI baseline',
    currency: 'Currency',
    currencies: {
      USD: 'USD ($)',
      GBP: 'GBP (£)',
      CNY: 'CNY (¥)',
    },
    accuracy: {
      exact: 'Exact',
      estimate: 'Estimate',
    },
    empty: 'Start typing to see live token analysis.',
    detectPii: 'Detect PII',
    optimize: 'Optimize',
    comingSoon: 'Coming in Phase 2',
  },
  saas: {
    title: 'Enterprise-grade LLM cost & compliance',
    subtitle: 'Scale from free tools to production-grade infrastructure.',
    features: {
      cache: {
        title: 'AI Cache Proxy',
        desc: 'Deduplicate identical prompts at the edge. Cut redundant API spend by up to 40%.',
      },
      privacy: {
        title: 'Privacy Audit',
        desc: 'PIPL, GDPR, and global PII detection before data leaves your region.',
      },
      routing: {
        title: 'Smart Model Routing',
        desc: 'Route by cost, latency, or compliance policy across GPT, Claude, Gemini, DeepSeek, and Qwen.',
      },
    },
  },
  docs: {
    title: 'Quick Start',
    subtitle: 'Integrate in minutes. All token counting runs locally in the browser.',
    npm: {
      title: 'npm / TypeScript',
      install: 'npm install gpt-tokenizer',
    },
    python: {
      title: 'Python',
      install: 'pip install tiktoken',
    },
    gateway: {
      title: 'Tokened Gateway (coming soon)',
      desc: 'Swap your OpenAI base URL to api.tokened.uk for caching, routing, and compliance.',
    },
  },
  pricing: {
    title: 'Simple, transparent pricing',
    subtitle: 'Start free. Scale when your prompts do.',
    tiers: {
      free: {
        name: 'Free',
        price: '$0',
        period: 'forever',
        features: [
          'Unlimited local token counting',
          'Multi-model cost comparison',
          'EN / 中文 UI',
          'Basic PII preview (soon)',
        ],
        cta: 'Get Started',
      },
      developer: {
        name: 'Developer',
        price: '$19',
        period: '/ month',
        features: [
          'Unlimited prompt optimization',
          'PIPL & GDPR audit reports',
          'API access & webhooks',
          'Priority model price updates',
        ],
        cta: 'Join Waitlist',
        badge: 'Popular',
      },
      enterprise: {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        features: [
          'Tokened Gateway proxy',
          'SSO & team workspaces',
          'Custom compliance rules',
          'Dedicated support & SLA',
        ],
        cta: 'Contact Sales',
      },
    },
  },
  footer: {
    tagline: 'Every token counts.',
    rights: 'All rights reserved.',
  },
}

export type Locale = {
  brand: string
  nav: { docs: string; pricing: string; github: string }
  hero: { title: string; subtitle: string; tagline: string }
  editor: {
    inputLabel: string
    inputPlaceholder: string
    analysisLabel: string
    tokenizer: string
    tokenizers: Record<string, string>
    totalTokens: string
    chars: string
    showBlocks: string
    hideBlocks: string
    estCost: string
    bestValue: string
    chineseInflation: string
    chineseInflationHint: string
    inflationVsOpenAI: string
    currency: string
    currencies: Record<string, string>
    accuracy: Record<string, string>
    empty: string
    detectPii: string
    optimize: string
    comingSoon: string
  }
  saas: {
    title: string
    subtitle: string
    features: Record<string, { title: string; desc: string }>
  }
  docs: {
    title: string
    subtitle: string
    npm: { title: string; install: string }
    python: { title: string; install: string }
    gateway: { title: string; desc: string }
  }
  pricing: {
    title: string
    subtitle: string
    tiers: Record<
      string,
      {
        name: string
        price: string
        period: string
        features: string[]
        cta: string
        badge?: string
      }
    >
  }
  footer: { tagline: string; rights: string }
}