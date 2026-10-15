import { Writable } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import { ARTICLES } from './data/articles'
import { LANGUAGES } from './i18n'
import { localizePath } from './i18n/paths'
import { getRouteMeta } from './lib/routeMeta'
export { absoluteUrl } from './lib/site'
import type { PageMeta } from './hooks/usePageMeta'

const NEUTRAL_PATHS = ['/', '/blog', ...ARTICLES.map((a) => `/blog/${a.slug}`)]

/** Every path the build emits as static HTML — each route in each language. */
export const PRERENDER_PATHS: string[] = LANGUAGES.flatMap((lang) =>
  NEUTRAL_PATHS.map((path) => localizePath(path, lang)),
)

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
        meta: getRouteMeta(url),
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
