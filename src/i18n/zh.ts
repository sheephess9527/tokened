import type { Locale } from './en'

export const zh = {
  brand: 'tokened.uk',
  nav: {
    features: '功能',
    demo: '演示',
    integration: '接入',
    pricing: '定价',
    github: 'GitHub',
  },
  hero: {
    title: '每一枚 Token 都是成本。',
    subtitle:
      '实时分析 Prompt 在各模型下的真实消耗，降低 LLM API 成本，满足 GDPR 与 PIPL 合规要求。',
    tagline: '在下方粘贴 Prompt — 即刻查看分词、费用与节省空间。100% 本地计算。',
    ctaTry: '立即体验 Token 分析',
    ctaBeta: '加入 Beta 等待名单',
    ctaEnterprise: '联系获取企业方案',
  },
  editor: {
    inputLabel: '输入提示词',
    inputPlaceholder:
      '在此粘贴 Prompt… 试试中英文混合，对比不同模型的分词效率。',
    analysisLabel: 'Token 分析',
    tokenizer: '分词器',
    tokenizers: {
      cl100k_base: 'OpenAI (cl100k_base)',
      o200k_base: 'OpenAI (o200k_base)',
      p50k_base: 'OpenAI 旧版 (p50k_base)',
      chinese_estimate: '中文高效估算',
    },
    totalTokens: 'Token 总数',
    chars: '字符数',
    showBlocks: '显示分词',
    hideBlocks: '隐藏分词',
    estCost: '预估成本（单次调用）',
    costChart: '成本对比',
    bestValue: '最省',
    chineseInflation: '中文 Token 膨胀率',
    chineseInflationHint:
      '同一段中文在 DeepSeek/Qwen 上通常比 OpenAI cl100k_base 占用更少 Token。',
    inflationVsOpenAI: '相对 OpenAI 基线',
    currency: '货币',
    currencies: {
      USD: '美元 ($)',
      GBP: '英镑 (£)',
      CNY: '人民币 (¥)',
    },
    accuracy: {
      exact: '精确',
      estimate: '估算',
    },
    empty: '开始输入即可查看实时 Token 分析。',
  },
  saas: {
    title: '企业级大模型成本与合规',
    subtitle: '从免费工具无缝升级到生产级基础设施。',
    features: {
      cache: {
        title: 'AI 缓存代理',
        desc: '在边缘层去重相同 Prompt，最高可削减 40% 冗余 API 支出。',
        icon: '⚡',
      },
      privacy: {
        title: '隐私审计',
        desc: '数据出境前自动检测 PIPL、GDPR 及全球 PII 敏感信息。',
        icon: '🛡️',
      },
      routing: {
        title: '智能模型路由',
        desc: '按成本、延迟或合规策略，在 GPT、Claude、Gemini、DeepSeek、Qwen 间智能调度。',
        icon: '🔀',
      },
    },
  },
  docs: {
    title: '快速接入',
    subtitle: '几分钟完成集成。所有 Token 计算均在浏览器本地运行。',
    intro: '3 分钟快速集成，本地运行，无需上传数据。',
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
    title: '产品路线图',
    subtitle: '目前已上线功能，以及后续规划。',
    phases: {
      phase1: {
        label: '已上线',
        title: 'Token 计算器 & 成本仪表盘',
        items: [
          '实时 Token 分词高亮（OpenAI 分词器）',
          '多模型成本对比（GPT、Claude、Gemini、DeepSeek、Qwen）',
          '中文 Token 膨胀率分析',
          '美元 / 英镑 / 人民币支持',
          '中 / EN 双语界面',
        ],
      },
      phase2: {
        label: '下一阶段',
        title: '开发者版',
        pricingNote: '价格待定 — 加入等待名单优先获取内测',
        items: [
          'PIPL & GDPR 敏感信息预检',
          '一键 Prompt 精简',
          'API 接入 & Webhook',
          '优先模型价格更新',
        ],
      },
      phase3: {
        label: '远期规划',
        title: '企业版 & Tokened Gateway',
        pricingNote: '定制定价 — 企业合作请联系我们',
        items: [
          '即插即用 OpenAI Base URL 代理（api.tokened.uk）',
          '边缘缓存 & 智能模型路由',
          'SSO & 团队工作区',
          '自定义合规规则 & 专属 SLA',
        ],
      },
    },
  },
  pricing: {
    title: '定价',
    subtitle: '完全免费，无需注册。所有 Token 分析均在浏览器本地运行。',
    free: {
      name: '免费版',
      statusLabel: '已上线',
      price: '¥0',
      period: '永久免费',
      features: [
        '无限本地 Token 计算',
        '多模型成本对比',
        '中 / EN 双语界面',
        '中文 Token 膨胀率分析',
      ],
      cta: '立即体验',
    },
    waitlist: {
      title: '想提前体验付费功能？',
      desc: '开发者版与企业版仍在路线图中，暂不可购买。加入等待名单，上线后第一时间通知你。',
      cta: '加入等待名单',
      roadmapLink: '查看完整路线图 →',
    },
  },
  legal: {
    privacyTitle: '隐私政策',
    termsTitle: '服务条款',
    privacy: [
      'tokened.uk 提供浏览器本地的 LLM Token 分析工具。默认情况下，您的 Prompt 完全在浏览器中处理，不会发送至我们的服务器。',
      '如您通过邮件联系我们或加入等待名单，我们仅收集您主动提供的信息（如邮箱地址、留言内容），用于回复您的咨询。',
      '我们不出售个人数据。可能使用匿名化的使用统计以改进产品。',
      '如有 GDPR 或 PIPL 相关请求，请通过下方邮箱联系我们。',
      '最后更新：2026 年 6 月。',
    ],
    terms: [
      'tokened.uk 按"现状"提供信息与开发者工具服务。成本估算基于公开模型定价，仅供参考。',
      '非 OpenAI 模型的 Token 数可能为估算值。生产环境决策前，请以服务商账单为准。',
      '您须自行确保 LLM API 的使用符合适用法律，包括 GDPR 与 PIPL。',
      '我们可能更新本条款。继续使用本站即表示接受当前版本。',
      '最后更新：2026 年 6 月。',
    ],
  },
  footer: {
    tagline: '每一枚 Token 都是成本。',
    rights: '保留所有权利。',
    contact: '有问题或想合作？',
    about:
      '我们是独立新团队，专注 AI Token 成本优化与合规工具，与此前已解散的 TOKENED LIMITED 无关联。',
    privacy: '隐私政策',
    terms: '服务条款',
    roadmap: '路线图',
  },
} satisfies Locale