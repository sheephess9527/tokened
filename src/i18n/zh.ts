import type { Locale } from './en'

export const zh = {
  brand: 'tokened.uk',
  common: {
    copy: '复制',
    copied: '已复制',
    backToTop: '回到顶部',
  },
  contact: {
    title: '联系我们',
    subtitle:
      '对 Beta 资格、Gateway 或企业方案感兴趣？直接发邮件即可，无需表单或第三方配置。',
    emailHint: '点击邮箱地址即可打开邮件客户端。',
    ctaBeta: '加入 Beta 等待名单',
    ctaGateway: 'Gateway Beta',
    ctaEnterprise: '企业咨询',
  },
  nav: {
    menu: '菜单',
    demo: '演示',
    howItWorks: '原理',
    features: '功能',
    pricing: '定价',
    faq: '问答',
    blog: '指南',
    integration: '接入',
    github: 'GitHub',
  },
  blog: {
    title: '指南与洞察',
    subtitle: '面向开发者与团队的实用 LLM Token 知识。',
    indexDescription:
      '关于中文 Token 成本、Prompt 缓存、GDPR/PIPL 合规与 LLM API 优化的文章。',
    backHome: '返回首页',
    backBlog: '返回指南列表',
    readMore: '阅读全文',
    tryTool: '用免费 Token 分析器试试你自己的 Prompt。',
    tryToolBtn: '打开分析工具',
  },
  trust: {
    items: [
      '100% 浏览器本地运行 — Prompt 不上传',
      '无需注册或 API Key',
      'OpenAI 精确分词器（gpt-tokenizer）',
      'GDPR & PIPL 合规友好设计',
    ],
  },
  stats: {
    title: '为什么 LLM Token 计算很重要',
    items: [
      {
        value: '9',
        label: '模型对比',
        desc: 'GPT-5.4、Claude 4.6、Gemini 3.5、DeepSeek-V4、Qwen3.7 等同屏比价。',
      },
      {
        value: '100%',
        label: '本地处理',
        desc: '分词在浏览器完成，服务器不存储任何 Prompt。',
      },
      {
        value: '45%',
        label: '中文节省空间',
        desc: '相比 OpenAI cl100k_base，中文高效模型典型可少 45% Token。',
      },
      {
        value: '¥0',
        label: '免费起步',
        desc: '完整 Demo 永久免费。付费方案筹备中 — 加入等待名单。',
      },
    ],
  },
  howItWorks: {
    title: '工作原理',
    subtitle: '三步完成。无需注册。数据不离开你的设备。',
    steps: {
      step1: {
        num: '1',
        title: '粘贴 LLM Prompt',
        desc: '支持系统提示词、RAG 上下文、对话模板 — 英文、中文或混合均可。',
      },
      step2: {
        num: '2',
        title: '查看 Token 分解',
        desc: '实时分词色块、Token 总数、中文膨胀率（相对 OpenAI 基线）。',
      },
      step3: {
        num: '3',
        title: '对比模型成本',
        desc: '美元 / 英镑 / 人民币即时估价，一眼找到最省钱的模型。',
      },
    },
  },
  postDemo: {
    title: '想用到生产环境？',
    desc: '免费分析器现已可用。Tokened Gateway（缓存、路由、合规代理）在路线图中 — 加入等待名单获取 Beta 资格。',
    ctaBeta: '加入 Beta 等待名单',
    ctaPricing: '查看定价',
    ctaGateway: '查看 Gateway 规划',
  },
  useCases: {
    title: '谁在用 Tokened？',
    subtitle: 'Token 可视化如何在真实场景中省钱、降风险。',
    cases: {
      c1: {
        stat: '最高省 45% Token',
        title: '中文产品团队',
        desc: '上线前对比 OpenAI vs DeepSeek/Qwen。同一段中文在 cl100k_base 上可能多花 2 倍 Token。',
      },
      c2: {
        stat: '上线前成本审计',
        title: '创业团队 & 独立开发者',
        desc: '用真实 Prompt 估算月 API 账单，避免上线后账单「惊喜」。',
      },
      c3: {
        stat: 'GDPR & PIPL 友好',
        title: '欧盟 / 英国 / 中国团队',
        desc: 'Prompt 发往美国模型前先本地审计。PII 预检功能将在下一版本推出。',
      },
    },
  },
  resources: {
    title: '指南与洞察',
    subtitle: '实用的 LLM Token 知识 — 更多文章持续更新。',
    articles: {
      a1: {
        title: '为什么中文 Prompt 在 OpenAI 上更费 Token？',
        desc: 'OpenAI cl100k_base 每个汉字约 1–3 个 Token。DeepSeek 和 Qwen 词表更高效 — 同一段中文通常可少 40–60% Token。',
        readTime: '3 分钟阅读',
      },
      a2: {
        title: 'Prompt 缓存如何削减 API 支出',
        desc: '每次请求重复发送相同系统 Prompt 是纯浪费。边缘缓存可去重 — 对话密集型应用预估最高省 40%。',
        readTime: '4 分钟阅读',
      },
      a3: {
        title: 'GDPR & PIPL：为什么本地 Token 分析很重要',
        desc: '含个人信息的 Prompt 发往美国托管模型有合规风险。本地分词意味着数据不离开浏览器。',
        readTime: '3 分钟阅读',
      },
    },
  },
  faq: {
    title: '常见问题',
    subtitle: '关于 LLM Token、隐私与产品路线的常见疑问。',
    items: [
      {
        q: '我的 Prompt 会发送到你们服务器吗？',
        a: '不会。所有 Token 计算在浏览器本地通过 gpt-tokenizer 完成。我们不存储、记录或传输你的 Prompt。',
      },
      {
        q: 'Token 计数准确吗？',
        a: 'OpenAI 模型（cl100k_base、o200k_base）为精确值。Claude、Gemini、DeepSeek、Qwen 为基于公开分词行为的估算 — 请以服务商账单为准。',
      },
      {
        q: 'Tokened 和加密货币 Token 有关吗？',
        a: '无关。Tokened 专指大模型 API Token — OpenAI、Anthropic 等用于计量和计费的文本处理单位。',
      },
      {
        q: 'Tokened Gateway 什么时候上线？',
        a: 'Gateway（api.tokened.uk）在路线图第三阶段。加入 Beta 等待名单可在代理内测开放时第一时间收到通知。',
      },
      {
        q: '开发者版现在能购买吗？',
        a: '还不能。目前仅免费本地分析器可用。开发者版与企业版仍在规划中，价格待定。加入等待名单可优先获取内测资格。',
      },
      {
        q: '如何在应用中集成分词？',
        a: '使用 npm install gpt-tokenizer（TypeScript）或 pip install tiktoken（Python）。见「接入」区块的复制粘贴示例。',
      },
    ],
  },
  hero: {
    title: '每一枚 LLM Token 都是成本。',
    subtitle:
      '实时分析 LLM Prompt 在各模型下的真实消耗，降低 API 成本，满足 GDPR 与 PIPL 合规要求。',
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
      o200k_base: 'OpenAI o200k — GPT-5.x / GPT-4o',
      cl100k_base: 'OpenAI cl100k — GPT-4 / 旧版',
      p50k_base: 'OpenAI p50k — 更早模型',
      chinese_estimate: '中文高效估算',
    },
    samplePrompt: `你是一名技术助手。请用简洁的中文总结以下技术文档，并估算单次 API 调用的 Token 成本。

---
## API Gateway 架构

网关在 Cloudflare Workers 边缘运行，代理 OpenAI 兼容请求，缓存相同 Prompt，并在数据到达美国托管模型前拦截 PII。缓存命中时典型延迟低于 50ms。

Core components: routing layer, edge cache, and compliance interception. Mixed 中英文 prompts often cost 2× more tokens on OpenAI cl100k_base than on DeepSeek or Qwen3.7.
---`,
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
    loading: '正在分析 Token…',
    clear: '清空',
    loadSample: '加载示例',
  },
  gatewayBeta: {
    badge: 'Beta 申请开放',
    title: 'Tokened Gateway — 即插即用 LLM 代理',
    subtitle:
      '将 OpenAI Base URL 替换为 api.tokened.uk，即享缓存、智能路由与合规拦截。目前正在开发中 — 申请早期 Beta 资格。',
    features: [
      '兼容 OpenAI SDK — 只需修改一个环境变量',
      '相同 Prompt 边缘缓存（预估最高省 40%）',
      '数据到达美国模型前自动 PII 检测',
      '按成本策略路由至 GPT、Claude、DeepSeek 或 Qwen',
    ],
    code: 'OPENAI_BASE_URL=https://api.tokened.uk/v1',
    note: 'Gateway 尚未上线。加入等待名单，Beta 开放时第一时间通知你。',
  },
  waitlist: {
    title: '加入等待名单',
    subtitle:
      '开发者工具与 Gateway Beta 上线时第一时间通知你。配置 Formspree 后直接提交，否则打开邮件客户端。',
    email: '工作邮箱',
    interest: '我感兴趣的是',
    interests: {
      developer: '开发者版（Prompt 优化 & API）',
      gateway: 'Gateway Beta（api.tokened.uk 代理）',
      enterprise: '企业版（SSO、团队、定制 SLA）',
    },
    message: '介绍你的使用场景（可选）',
    messagePlaceholder: '例如：我们每天处理 5 万次 Prompt，需要成本可视化…',
    submit: '提交申请',
    submitting: '提交中…',
    successFormspree: '已加入等待名单！Beta 开放时我们将邮件通知你。',
    successMailto:
      '正在打开邮件客户端… 请完成发送以加入。如未自动打开，请发邮件至 hello@tokened.uk。',
    mailtoHint:
      '提示：在 .env 中设置 VITE_FORMSPREE_ENDPOINT 可直接提交表单，无需邮件客户端。',
    error: '提交失败，请重试或直接发邮件至 hello@tokened.uk。',
    privacy: '我们仅用你的邮箱联系 Tokened 相关事宜，绝不发送垃圾邮件。',
  },
  saas: {
    title: '规划中：生产级 LLM 基础设施',
    subtitle: '路线图功能 — 为超越免费工具、需要规模化部署的团队提供缓存、路由与合规代理。',
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
    howItWorks: '工作原理',
    faq: '常见问题',
    resources: '指南',
    integration: '接入',
    waitlist: '等待名单',
    blog: '指南',
  },
} satisfies Locale