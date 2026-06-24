export const en = {
  brand: 'tokened.uk',
  nav: {
    demo: 'Demo',
    howItWorks: 'How it works',
    features: 'Features',
    pricing: 'Pricing',
    faq: 'FAQ',
    blog: 'Guides',
    integration: 'Integration',
    github: 'GitHub',
  },
  blog: {
    title: 'Guides & Insights',
    subtitle: 'Practical LLM token knowledge for developers and teams.',
    indexDescription:
      'Articles on Chinese token costs, prompt caching, GDPR/PIPL compliance, and LLM API optimization.',
    backHome: 'Back to home',
    backBlog: 'Back to guides',
    readMore: 'Read article',
    tryTool: 'Try the free token analyzer on your own prompts.',
    tryToolBtn: 'Open token tool',
  },
  trust: {
    items: [
      '100% browser-local — prompts never uploaded',
      'No account or API key required',
      'OpenAI-accurate tokenizers (gpt-tokenizer)',
      'GDPR & PIPL aware by design',
    ],
  },
  stats: {
    title: 'Why LLM token math matters',
    items: [
      {
        value: '6+',
        label: 'Models compared',
        desc: 'GPT-4o, Claude, Gemini, DeepSeek, Qwen and more side by side.',
      },
      {
        value: '100%',
        label: 'Local processing',
        desc: 'Token counting runs in your browser. Zero server-side prompt storage.',
      },
      {
        value: '45%',
        label: 'Chinese savings',
        desc: 'Typical token reduction vs OpenAI cl100k_base when using Chinese-efficient models.',
      },
      {
        value: '$0',
        label: 'To get started',
        desc: 'Full demo free forever. Paid plans coming — join the waitlist.',
      },
    ],
  },
  howItWorks: {
    title: 'How it works',
    subtitle: 'Three steps. No signup. Your prompt stays on your device.',
    steps: {
      step1: {
        num: '1',
        title: 'Paste your LLM prompt',
        desc: 'Drop in any system prompt, RAG context, or chat template — English, 中文, or mixed.',
      },
      step2: {
        num: '2',
        title: 'See token breakdown',
        desc: 'Watch real-time token blocks, total count, and Chinese inflation vs OpenAI baseline.',
      },
      step3: {
        num: '3',
        title: 'Compare model costs',
        desc: 'Instant per-call cost estimates in USD, GBP, or CNY. Pick the most efficient model.',
      },
    },
  },
  postDemo: {
    title: 'Ready to use this in production?',
    desc: 'The free analyzer is live today. Tokened Gateway — caching, routing, and compliance proxy — is on the roadmap. Join the waitlist for beta access.',
    ctaBeta: 'Join beta waitlist',
    ctaPricing: 'View pricing',
    ctaGateway: 'See Gateway roadmap',
  },
  useCases: {
    title: 'Who uses Tokened?',
    subtitle: 'Real scenarios where token visibility saves money and reduces risk.',
    cases: {
      c1: {
        stat: 'Up to 45% fewer tokens',
        title: 'Chinese product teams',
        desc: 'Compare OpenAI vs DeepSeek/Qwen before committing to a model. One Chinese prompt can cost 2× the tokens on cl100k_base.',
      },
      c2: {
        stat: 'Pre-launch cost audit',
        title: 'Startups & indie devs',
        desc: 'Estimate monthly API spend from your actual prompts before you ship — no surprises on the billing dashboard.',
      },
      c3: {
        stat: 'GDPR & PIPL ready',
        title: 'EU / UK / China teams',
        desc: 'Audit prompts locally before they hit a US-hosted model. Planned PII pre-check coming in the next release.',
      },
    },
  },
  resources: {
    title: 'Guides & insights',
    subtitle: 'Practical LLM token knowledge — more articles coming soon.',
    articles: {
      a1: {
        title: 'Why Chinese prompts cost more on OpenAI',
        desc: 'OpenAI cl100k_base treats each Chinese character as 1–3 tokens. DeepSeek and Qwen use more efficient vocabularies — often 40–60% fewer tokens for the same text.',
        readTime: '3 min read',
      },
      a2: {
        title: 'How prompt caching can cut API spend',
        desc: 'Identical system prompts resent on every request are pure waste. Edge caching deduplicates them — we estimate up to 40% savings for chat-heavy apps.',
        readTime: '4 min read',
      },
      a3: {
        title: 'GDPR & PIPL: why local token analysis matters',
        desc: 'Sending prompts with PII to US-hosted models raises compliance risk. Counting tokens locally means your data never leaves the browser.',
        readTime: '3 min read',
      },
    },
  },
  faq: {
    title: 'FAQ',
    subtitle: 'Common questions about LLM tokens, privacy, and our roadmap.',
    items: [
      {
        q: 'Is my prompt sent to your servers?',
        a: 'No. All token counting runs locally in your browser using the gpt-tokenizer library. We do not store, log, or transmit your prompts.',
      },
      {
        q: 'How accurate are the token counts?',
        a: 'OpenAI models (cl100k_base, o200k_base) are exact. Claude, Gemini, DeepSeek, and Qwen counts are estimates based on published tokenizer behaviour — always verify against your provider billing.',
      },
      {
        q: 'Is Tokened related to cryptocurrency tokens?',
        a: 'No. Tokened is exclusively about LLM API tokens — the units OpenAI, Anthropic, and others use to measure and charge for text processing.',
      },
      {
        q: 'When will Tokened Gateway launch?',
        a: 'Gateway (api.tokened.uk) is in Phase 3 of our roadmap. Join the beta waitlist to get notified when the proxy beta opens.',
      },
      {
        q: 'Is the Developer plan available to buy?',
        a: 'Not yet. Only the free local analyzer is live. Developer and Enterprise tiers are planned — pricing TBD. Join the waitlist for early access.',
      },
      {
        q: 'How do I integrate token counting in my app?',
        a: 'Use npm install gpt-tokenizer (TypeScript) or pip install tiktoken (Python). See the Integration section for copy-paste examples.',
      },
    ],
  },
  hero: {
    title: 'Every LLM Token Counts.',
    subtitle:
      'Real-time LLM prompt token analysis across models. Cut API costs. Stay GDPR & PIPL ready.',
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
    loading: 'Analyzing tokens…',
  },
  gatewayBeta: {
    badge: 'Beta applications open',
    title: 'Tokened Gateway — drop-in LLM proxy',
    subtitle:
      'Swap your OpenAI base URL to api.tokened.uk and get caching, smart routing, and compliance interception. Currently in development — apply for early beta access.',
    features: [
      'Compatible with OpenAI SDK — change one env variable',
      'Edge cache for identical prompts (est. up to 40% savings)',
      'PII detection before data reaches US-hosted models',
      'Route to GPT, Claude, DeepSeek, or Qwen by cost policy',
    ],
    code: 'OPENAI_BASE_URL=https://api.tokened.uk/v1',
    note: 'Gateway is not live yet. Join the waitlist to be first in line when the beta opens.',
  },
  waitlist: {
    title: 'Join the waitlist',
    subtitle:
      'Get notified when Developer tools and Gateway beta launch. Submits via Formspree when configured, otherwise opens your email client.',
    email: 'Work email',
    interest: 'I am interested in',
    interests: {
      developer: 'Developer plan (prompt optimization & API)',
      gateway: 'Gateway beta (api.tokened.uk proxy)',
      enterprise: 'Enterprise (SSO, teams, custom SLA)',
    },
    message: 'Tell us about your use case (optional)',
    messagePlaceholder: 'e.g. We process 50k prompts/day and need cost visibility…',
    submit: 'Submit application',
    submitting: 'Submitting…',
    successFormspree: 'You are on the list! We will email you when beta opens.',
    successMailto:
      'Opening your email client… Complete the send to join. If it does not open, email hello@tokened.uk directly.',
    mailtoHint:
      'Tip: set VITE_FORMSPREE_ENDPOINT in .env for direct form submission without email client.',
    error: 'Submission failed. Please try again or email hello@tokened.uk.',
    privacy: 'We only use your email to contact you about Tokened. No spam, ever.',
  },
  saas: {
    title: 'Planned: production-grade LLM infrastructure',
    subtitle: 'On the roadmap — caching, routing, and compliance proxy for teams scaling beyond the free tool.',
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
        title: 'Developer plan',
        pricingNote: 'Pricing TBD — join the waitlist for early access',
        items: [
          'PIPL & GDPR PII pre-check',
          'One-click prompt slimming',
          'API access & webhooks',
          'Priority model price updates',
        ],
      },
      phase3: {
        label: 'Future',
        title: 'Enterprise & Tokened Gateway',
        pricingNote: 'Custom pricing — contact us for enterprise',
        items: [
          'Drop-in OpenAI base URL proxy (api.tokened.uk)',
          'Edge caching & smart model routing',
          'SSO & team workspaces',
          'Custom compliance rules & dedicated SLA',
        ],
      },
    },
  },
  pricing: {
    title: 'Pricing',
    subtitle: '100% free, no account required. All token analysis runs locally in your browser.',
    free: {
      name: 'Free',
      statusLabel: 'Available now',
      price: '$0',
      period: 'forever',
      features: [
        'Unlimited local token counting',
        'Multi-model cost comparison',
        'EN / 中文 UI',
        'Chinese token inflation insights',
      ],
      cta: 'Try it now',
    },
    waitlist: {
      title: 'Want paid features early?',
      desc: 'Developer and Enterprise plans are on the roadmap — not available to purchase yet. Join the waitlist and we will notify you when they launch.',
      cta: 'Join waitlist',
      roadmapLink: 'See the full roadmap →',
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
    howItWorks: 'How it works',
    faq: 'FAQ',
    resources: 'Guides',
    integration: 'Integration',
    waitlist: 'Waitlist',
    blog: 'Guides',
  },
}

export type Locale = {
  brand: string
  nav: {
    demo: string
    howItWorks: string
    features: string
    pricing: string
    faq: string
    blog: string
    integration: string
    github: string
  }
  blog: {
    title: string
    subtitle: string
    indexDescription: string
    backHome: string
    backBlog: string
    readMore: string
    tryTool: string
    tryToolBtn: string
  }
  trust: { items: string[] }
  stats: {
    title: string
    items: { value: string; label: string; desc: string }[]
  }
  howItWorks: {
    title: string
    subtitle: string
    steps: Record<string, { num: string; title: string; desc: string }>
  }
  postDemo: {
    title: string
    desc: string
    ctaBeta: string
    ctaPricing: string
    ctaGateway: string
  }
  useCases: {
    title: string
    subtitle: string
    cases: Record<string, { stat: string; title: string; desc: string }>
  }
  resources: {
    title: string
    subtitle: string
    articles: Record<string, { title: string; desc: string; readTime: string }>
  }
  faq: {
    title: string
    subtitle: string
    items: { q: string; a: string }[]
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
    loading: string
  }
  gatewayBeta: {
    badge: string
    title: string
    subtitle: string
    features: string[]
    code: string
    note: string
  }
  waitlist: {
    title: string
    subtitle: string
    email: string
    interest: string
    interests: Record<string, string>
    message: string
    messagePlaceholder: string
    submit: string
    submitting: string
    successFormspree: string
    successMailto: string
    mailtoHint: string
    error: string
    privacy: string
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
      {
        label: string
        title: string
        pricingNote?: string
        items: string[]
      }
    >
  }
  pricing: {
    title: string
    subtitle: string
    free: {
      name: string
      statusLabel: string
      price: string
      period: string
      features: string[]
      cta: string
    }
    waitlist: {
      title: string
      desc: string
      cta: string
      roadmapLink: string
    }
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
    howItWorks: string
    faq: string
    resources: string
    integration: string
    waitlist: string
    blog: string
  }
}