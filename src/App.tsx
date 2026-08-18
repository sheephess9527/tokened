import { lazy, Suspense, type ReactNode } from 'react'
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

interface AppProps {
  /** The prerenderer swaps in a StaticRouter; the browser uses BrowserRouter. */
  router?: (children: ReactNode) => ReactNode
}

const browserRouter = (children: ReactNode) => <BrowserRouter>{children}</BrowserRouter>

function App({ router = browserRouter }: AppProps) {
  return (
    <I18nProvider>
      {router(
        <>
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
        </>,
      )}
    </I18nProvider>
  )
}

export default App
