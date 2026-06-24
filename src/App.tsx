import { Header } from './components/Header'
import { TokenEditor } from './components/TokenEditor'
import { SaasPitch } from './components/SaasPitch'
import { Docs } from './components/Docs'
import { Pricing } from './components/Pricing'
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
        <Pricing />
      </main>
      <Footer />
    </I18nProvider>
  )
}

export default App