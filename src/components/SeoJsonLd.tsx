import { useI18n } from '../i18n'

const SITE_URL = 'https://tokened.uk'

export function SeoJsonLd() {
  const { lang } = useI18n()

  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Tokened',
    url: SITE_URL,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      lang === 'zh'
        ? 'LLM Token 分析与成本优化工具，支持多模型对比与中文分词效率分析'
        : 'LLM token analysis and cost optimization tool with multi-model comparison',
    inLanguage: lang === 'zh' ? 'zh-CN' : 'en',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}