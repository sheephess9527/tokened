export const SITE_URL = 'https://tokened.uk'
export const SITE_NAME = 'Tokened'
export const OG_IMAGE = `${SITE_URL}/og-image.png`

/**
 * The single source of every URL this site declares about itself.
 *
 * Each prerendered route is written as `<path>/index.html`, which Cloudflare
 * Pages serves with a trailing slash — a request for `/zh` 308-redirects to
 * `/zh/`. Declared URLs must therefore be the final ones: Google ignores
 * hreflang targets that redirect, which would quietly undo the bilingual
 * setup, and a sitemap full of redirecting URLs is reported as "page with
 * redirect" instead of being indexed.
 */
export function absoluteUrl(path = '/'): string {
  if (!path || path === '/') return `${SITE_URL}/`

  // Leave file-like paths such as /404.html or /feed.xml alone.
  const isFile = /\.[a-z0-9]+$/i.test(path)
  const normalized = isFile || path.endsWith('/') ? path : `${path}/`
  return `${SITE_URL}${normalized}`
}
