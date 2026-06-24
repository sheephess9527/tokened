import type { Locale } from './en'

export const zh: Locale = {
  brand: 'tokened.uk',
  nav: {
    docs: '文档',
    pricing: '定价',
    github: 'GitHub',
  },
  hero: {
    title: '每一枚 Token 都是成本。',
    subtitle: '精简大模型提示词，全球化降低成本与合规风险。',
    tagline: '一眼看清：你的 Prompt 在各模型里怎么分词、要花多少钱。',
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
    detectPii: '检测敏感信息',
    optimize: '一键优化',
    comingSoon: '第二阶段上线',
  },
  saas: {
    title: '企业级大模型成本与合规',
    subtitle: '从免费工具无缝升级到生产级基础设施。',
    features: {
      cache: {
        title: 'AI 缓存代理',
        desc: '在边缘层去重相同 Prompt，最高可削减 40% 冗余 API 支出。',
      },
      privacy: {
        title: '隐私审计',
        desc: '数据出境前自动检测 PIPL、GDPR 及全球 PII 敏感信息。',
      },
      routing: {
        title: '智能模型路由',
        desc: '按成本、延迟或合规策略，在 GPT、Claude、Gemini、DeepSeek、Qwen 间智能调度。',
      },
    },
  },
  docs: {
    title: '快速接入',
    subtitle: '几分钟完成集成。所有 Token 计算均在浏览器本地运行。',
    npm: {
      title: 'npm / TypeScript',
      install: 'npm install gpt-tokenizer',
    },
    python: {
      title: 'Python',
      install: 'pip install tiktoken',
    },
    gateway: {
      title: 'Tokened Gateway（即将推出）',
      desc: '将 OpenAI Base URL 替换为 api.tokened.uk，即享缓存、路由与合规拦截。',
    },
  },
  pricing: {
    title: '简单透明的定价',
    subtitle: '免费起步，随 Prompt 规模扩展。',
    tiers: {
      free: {
        name: '免费版',
        price: '¥0',
        period: '永久免费',
        features: [
          '无限本地 Token 计算',
          '多模型成本对比',
          '中 / EN 双语界面',
          '基础 PII 预检（即将推出）',
        ],
        cta: '立即开始',
      },
      developer: {
        name: '开发者版',
        price: '¥139',
        period: '/ 月',
        features: [
          '无限次 Prompt 优化',
          'PIPL & GDPR 审计报告',
          'API 接入 & Webhook',
          '优先模型价格更新',
        ],
        cta: '加入候补',
        badge: '热门',
      },
      enterprise: {
        name: '企业版',
        price: '定制',
        period: '',
        features: [
          'Tokened Gateway 代理',
          'SSO & 团队工作区',
          '自定义合规规则',
          '专属支持与 SLA',
        ],
        cta: '联系销售',
      },
    },
  },
  footer: {
    tagline: '每一枚 Token 都是成本。',
    rights: '保留所有权利。',
  },
}