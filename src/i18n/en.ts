export const en = {
  brand: 'tokened.uk',
  nav: {
    features: 'Features',
    demo: 'Demo',
    integration: 'Integration',
    pricing: 'Pricing',
    github: 'GitHub',
  },
  hero: {
    title: 'Every Token Counts.',
    subtitle:
      'Real-time prompt token analysis across models. Cut LLM API costs. Stay GDPR & PIPL ready.',
    tagline: 'Paste a prompt below — see tokens, costs, and savings instantly. 100% local.',
    ctaTry: 'Try Token Analysis',
    ctaBeta: 'Join Beta Waitlist',
    ctaEnterprise: 'Contact for Enterprise',
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
    costChart: 'Cost comparison',
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
  },
  saas: {
    title: 'Enterprise-grade LLM cost & compliance',
    subtitle: 'Scale from free tools to production-grade infrastructure.',
    features: {
      cache: {
        title: 'AI Cache Proxy',
        desc: 'Deduplicate identical prompts at the edge. Cut redundant API spend by up to 40%.',
        icon: '⚡',
      },
      privacy: {
        title: 'Privacy Audit',
        desc: 'PIPL, GDPR, and global PII detection before data leaves your region.',
        icon: '🛡️',
      },
      routing: {
        title: 'Smart Model Routing',
        desc: 'Route by cost, latency, or compliance policy across GPT, Claude, Gemini, DeepSeek, and Qwen.',
        icon: '🔀',
      },
    },
  },
  docs: {
    title: 'Quick Start',
    subtitle: 'Integrate in minutes. All token counting runs locally in the browser.',
    intro: '3-minute integration. Runs locally — your prompts never leave the browser.',
    npm: {
      title: 'npm / TypeScript',
      install: 'npm install gpt-tokenizer',
    },
    python: {
      title: 'Python',
      install: 'pip install tiktoken',
    },
  },
  roadmap: {
    title: 'Roadmap',
    subtitle: 'What is live today, and what is coming next.',
    phases: {
      phase1: {
        label: 'Live now',
        title: 'Token calculator & cost dashboard',
        items: [
          'Real-time token highlighting (OpenAI tokenizers)',
          'Multi-model cost comparison (GPT, Claude, Gemini, DeepSeek, Qwen)',
          'Chinese token inflation insights',
          'USD / GBP / CNY support',
          'EN / 中文 bilingual UI',
        ],
      },
      phase2: {
        label: 'Next',
        title: 'Privacy audit & prompt optimization',
        items: [
          'PIPL & GDPR PII pre-check',
          'One-click prompt slimming',
          'Beta API access for registered users',
        ],
      },
      phase3: {
        label: 'Future',
        title: 'Tokened Gateway',
        items: [
          'Drop-in OpenAI base URL proxy (api.tokened.uk)',
          'Edge caching & smart model routing',
          'Team workspaces & compliance policies',
        ],
      },
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
          'Chinese token inflation insights',
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
  legal: {
    privacyTitle: 'Privacy Policy',
    termsTitle: 'Terms of Service',
    privacy: [
      'tokened.uk provides browser-local LLM token analysis tools. By default, your prompts are processed entirely in your browser and are not sent to our servers.',
      'If you contact us by email or join our waitlist, we collect only the information you provide (e.g. email address, message content) to respond to your inquiry.',
      'We do not sell personal data. We may use anonymized usage analytics to improve the product.',
      'For GDPR or PIPL-related requests, contact us at the email below.',
      'Last updated: June 2026.',
    ],
    terms: [
      'tokened.uk is provided "as is" for informational and developer tooling purposes. Cost estimates are approximate and based on publicly available model pricing.',
      'Token counts for non-OpenAI models may be estimates. Always verify against your provider\'s billing dashboard before making production decisions.',
      'You are responsible for ensuring your use of LLM APIs complies with applicable laws, including GDPR and PIPL.',
      'We may update these terms. Continued use of the site constitutes acceptance of the current version.',
      'Last updated: June 2026.',
    ],
  },
  footer: {
    tagline: 'Every token counts.',
    rights: 'All rights reserved.',
    contact: 'Questions or partnership?',
    about:
      'We are an independent team focused on AI token cost optimization and compliance tooling. We are not affiliated with the previously dissolved TOKENED LIMITED.',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    roadmap: 'Roadmap',
  },
}

export type Locale = {
  brand: string
  nav: {
    features: string
    demo: string
    integration: string
    pricing: string
    github: string
  }
  hero: {
    title: string
    subtitle: string
    tagline: string
    ctaTry: string
    ctaBeta: string
    ctaEnterprise: string
  }
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
    costChart: string
    bestValue: string
    chineseInflation: string
    chineseInflationHint: string
    inflationVsOpenAI: string
    currency: string
    currencies: Record<string, string>
    accuracy: Record<string, string>
    empty: string
  }
  saas: {
    title: string
    subtitle: string
    features: Record<string, { title: string; desc: string; icon: string }>
  }
  docs: {
    title: string
    subtitle: string
    intro: string
    npm: { title: string; install: string }
    python: { title: string; install: string }
  }
  roadmap: {
    title: string
    subtitle: string
    phases: Record<
      string,
      { label: string; title: string; items: string[] }
    >
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
  legal: {
    privacyTitle: string
    termsTitle: string
    privacy: string[]
    terms: string[]
  }
  footer: {
    tagline: string
    rights: string
    contact: string
    about: string
    privacy: string
    terms: string
    roadmap: string
  }
}