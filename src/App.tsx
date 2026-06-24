import { Header } from './components/Header'
import { TokenEditor } from './components/TokenEditor'
import { SaasPitch } from './components/SaasPitch'
import { Docs } from './components/Docs'
import { Roadmap } from './components/Roadmap'
import { Pricing } from './components/Pricing'
import { Legal } from './components/Legal'
import { Footer } from './components/Footer'
import { I18nProvider } from './providers/I18nProvider'

function App() {
  return (
    <I18nProvider>
      <Header />
      <main>
        <TokenEditor />
        <SaasPitch />
        <Docs />
        <Roadmap />
        <Pricing />
        <Legal />
      </main>
      <Footer />
    </I18nProvider>
  )
}

export default App