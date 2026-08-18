import { Header } from '../components/Header'
import { TrustBar } from '../components/TrustBar'
import { TokenEditor } from '../components/TokenEditor'
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
import { JsonLd } from '../components/JsonLd'
import { BackToTop } from '../components/BackToTop'
import { useHashScroll } from '../hooks/useHashScroll'
import { usePageMeta } from '../hooks/usePageMeta'
import { useI18n } from '../i18n'
import { getRouteMeta } from '../lib/routeMeta'
import {
  faqSchema,
  graph,
  organizationSchema,
  webApplicationSchema,
} from '../lib/structuredData'

export function LandingPage() {
  const { lang, t } = useI18n()

  useHashScroll()

  const meta = getRouteMeta('/', lang)

  usePageMeta(meta)

  return (
    <>
      <JsonLd
        data={graph(
          organizationSchema(),
          webApplicationSchema(lang, meta.description ?? ''),
          faqSchema(t.faq.items),
        )}
      />
      <Header />
      <TrustBar />
      <main id="main">
        <TokenEditor />
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
      <BackToTop />
    </>
  )
}