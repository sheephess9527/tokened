import { Header } from '../components/Header'
import { TrustBar } from '../components/TrustBar'
import { TokenEditor } from '../components/TokenEditor'
import { PostDemoCTA } from '../components/PostDemoCTA'
import { Stats } from '../components/Stats'
import { HowItWorks } from '../components/HowItWorks'
import { SaasPitch } from '../components/SaasPitch'
import { UseCases } from '../components/UseCases'
import { Docs } from '../components/Docs'
import { Resources } from '../components/Resources'
import { Roadmap } from '../components/Roadmap'
import { Pricing } from '../components/Pricing'
import { WaitlistSection } from '../components/WaitlistSection'
import { FAQ } from '../components/FAQ'
import { Legal } from '../components/Legal'
import { Footer } from '../components/Footer'
import { SeoJsonLd } from '../components/SeoJsonLd'
import { usePageMeta } from '../hooks/usePageMeta'
import { useI18n } from '../i18n'

export function LandingPage() {
  const { lang } = useI18n()

  usePageMeta({
    title:
      lang === 'zh'
        ? 'Tokened | LLM Token 优化与成本控制平台'
        : 'Tokened | LLM Token Analysis & Cost Optimization',
    description:
      lang === 'zh'
        ? '实时 LLM Token 分析与成本优化，多模型对比，100% 浏览器本地运行。'
        : 'Real-time LLM token analysis and cost optimization. Multi-model comparison. 100% browser-local.',
  })

  return (
    <>
      <SeoJsonLd />
      <Header />
      <TrustBar />
      <main>
        <TokenEditor />
        <PostDemoCTA />
        <Stats />
        <HowItWorks />
        <SaasPitch />
        <UseCases />
        <Docs />
        <Resources />
        <Roadmap />
        <Pricing />
        <WaitlistSection />
        <FAQ />
        <Legal />
      </main>
      <Footer />
    </>
  )
}