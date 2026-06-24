import { Header } from './components/Header'
import { TrustBar } from './components/TrustBar'
import { TokenEditor } from './components/TokenEditor'
import { PostDemoCTA } from './components/PostDemoCTA'
import { Stats } from './components/Stats'
import { HowItWorks } from './components/HowItWorks'
import { SaasPitch } from './components/SaasPitch'
import { UseCases } from './components/UseCases'
import { Docs } from './components/Docs'
import { Resources } from './components/Resources'
import { Roadmap } from './components/Roadmap'
import { Pricing } from './components/Pricing'
import { WaitlistSection } from './components/WaitlistSection'
import { FAQ } from './components/FAQ'
import { Legal } from './components/Legal'
import { Footer } from './components/Footer'
import { SeoJsonLd } from './components/SeoJsonLd'
import { I18nProvider } from './providers/I18nProvider'

function App() {
  return (
    <I18nProvider>
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
    </I18nProvider>
  )
}

export default App