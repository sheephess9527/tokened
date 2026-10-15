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

// Every route is registered twice: bare for English and under /zh for Chinese.
function LocalizedRoutes() {
  return (
    <Routes>
      {['', '/zh'].map((prefix) => (
        <Route key={prefix || 'en'}>
          <Route path={`${prefix}/`} element={<LandingPage />} />
          <Route path={`${prefix}/blog`} element={<BlogIndex />} />
          <Route path={`${prefix}/blog/:slug`} element={<BlogArticle />} />
        </Route>
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function App({ router = browserRouter }: AppProps) {
  return router(
    // Inside the router: the active language is derived from the location.
    <I18nProvider>
      <SkipLink />
      <AppFallbackBoundary>
        <Suspense fallback={<RouteLoading />}>
          <LocalizedRoutes />
        </Suspense>
      </AppFallbackBoundary>
    </I18nProvider>,
  )
}

export default App
