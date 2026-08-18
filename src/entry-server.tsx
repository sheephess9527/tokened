import { Writable } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import { ARTICLES } from './data/articles'
import { getRouteMeta } from './lib/routeMeta'
import type { PageMeta } from './hooks/usePageMeta'

/** Every path the build emits as static HTML, derived from the article list. */
export const PRERENDER_PATHS: string[] = [
  '/',
  '/blog',
  ...ARTICLES.map((article) => `/blog/${article.slug}`),
]

export interface RenderResult {
  html: string
  meta: PageMeta
}

const RENDER_TIMEOUT_MS = 20_000

/**
 * Renders one route to static HTML. `onAllReady` is what makes this work with
 * the lazily-imported route components — it waits for every Suspense boundary
 * to resolve instead of emitting the loading fallback.
 */
export function render(url: string): Promise<RenderResult> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    const sink = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(Buffer.from(chunk))
        callback()
      },
    })

    sink.on('finish', () => {
      resolve({
        html: Buffer.concat(chunks).toString('utf8'),
        meta: getRouteMeta(url, 'en'),
      })
    })

    const { pipe, abort } = renderToPipeableStream(
      <App
        router={(children) => <StaticRouter location={url}>{children}</StaticRouter>}
      />,
      {
        onAllReady() {
          pipe(sink)
        },
        onError(error) {
          reject(error)
        },
      },
    )

    const timer = setTimeout(() => {
      abort(new Error(`Prerender of ${url} timed out`))
      reject(new Error(`Prerender of ${url} timed out`))
    }, RENDER_TIMEOUT_MS)
    sink.on('finish', () => clearTimeout(timer))
  })
}
