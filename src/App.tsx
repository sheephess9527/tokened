import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { AppFallbackBoundary } from './components/AppFallbackBoundary'
import { RouteLoading } from './components/AppFallback'
import { SkipLink } from './components/SkipLink'
import { I18nProvider } from './providers/I18nProvider'

// Blog routes are secondary — keep them out of the landing-page bundle.
const BlogIndex = lazy(() =>
  import('./pages/BlogIndex').then((m) => ({ default: m.BlogIndex })),
)
const BlogArticle = lazy(() =>
  import('./pages/BlogArticle').then((m) => ({ default: m.BlogArticle })),
)
const NotFound = lazy(() =>
  import('./pages/NotFound').then((m) => ({ default: m.NotFound })),
)

function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <SkipLink />
        <AppFallbackBoundary>
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/blog/:slug" element={<BlogArticle />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AppFallbackBoundary>
      </BrowserRouter>
    </I18nProvider>
  )
}

export default App
