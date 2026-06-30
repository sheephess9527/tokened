import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { BlogIndex } from './pages/BlogIndex'
import { BlogArticle } from './pages/BlogArticle'
import { I18nProvider } from './providers/I18nProvider'
import { Analytics } from './components/Analytics'

function App() {
  return (
    <I18nProvider>
      <Analytics />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  )
}

export default App