import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { ARTICLES } from './src/data/articles.js'

const SITE_URL = 'https://tokened.uk'
// Each BPE rank table is ~0.5–2MB. Isolating each one — and the shared
// tokenizer runtime — means a visitor downloads only the encoding they
// actually select, and none of them before the first paint.
const chunkGroups = {
  groups: [
    { name: 'tokenizer-o200k_base', test: /gpt-tokenizer[\\/].*o200k_base/, priority: 30 },
    { name: 'tokenizer-cl100k_base', test: /gpt-tokenizer[\\/].*cl100k_base/, priority: 30 },
    { name: 'tokenizer-p50k_base', test: /gpt-tokenizer[\\/].*[pr]50k_base/, priority: 30 },
    { name: 'tokenizer-core', test: /gpt-tokenizer[\\/]esm[\\/](?!bpeRanks|encoding)/, priority: 40, minSize: 0, minShareCount: 2 },
    { name: 'router', test: /react-router/, priority: 10 },
  ],
}

const SITE_TITLE = 'Tokened — Guides & Insights'
const SITE_DESCRIPTION =
  'LLM token efficiency, prompt cost control and compliance notes from tokened.uk.'
const SITE_TITLE_ZH = 'Tokened — 指南与洞察'
const SITE_DESCRIPTION_ZH = '来自 tokened.uk 的 LLM Token 效率、成本控制与合规实践笔记。'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** `2026-06-24` → RFC-822, which is what RSS readers expect. */
function rfc822(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString()
}

const HREFLANG = { en: 'en', zh: 'zh-Hans' } as const
const localized = (path: string, lang: 'en' | 'zh') =>
  lang === 'en' ? path : path === '/' ? '/zh' : `/zh${path}`

function sitemapXml(): string {
  const today = new Date().toISOString().slice(0, 10)
  const pages = [
    { path: '/', lastmod: today, changefreq: 'weekly', priority: '1.0' },
    { path: '/blog', lastmod: today, changefreq: 'weekly', priority: '0.8' },
    ...ARTICLES.map((article) => ({
      path: `/blog/${article.slug}`,
      lastmod: article.published,
      changefreq: 'monthly',
      priority: '0.7',
    })),
  ]

  // Each URL declares both translations, so neither language competes with the
  // other for the same query.
  const body = pages
    .flatMap((page) =>
      (['en', 'zh'] as const).map((lang) => {
        const alternates = (['en', 'zh'] as const)
          .map(
            (other) =>
              `    <xhtml:link rel="alternate" hreflang="${HREFLANG[other]}" href="${SITE_URL}${localized(page.path, other)}" />`,
          )
          .join('\n')

        return (
          `  <url>\n    <loc>${SITE_URL}${localized(page.path, lang)}</loc>\n` +
          `    <lastmod>${page.lastmod}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n` +
          `    <priority>${page.priority}</priority>\n${alternates}\n  </url>`
        )
      }),
    )
    .join('\n')

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    `${body}\n</urlset>\n`
  )
}

function feedXml(lang: 'en' | 'zh'): string {
  const items = ARTICLES.map((article) => {
    const url = `${SITE_URL}${localized(`/blog/${article.slug}`, lang)}`
    const body = article.sections
      .map(
        (section) =>
          `<h2>${escapeXml(section.heading[lang])}</h2>` +
          section.paragraphs.map((p) => `<p>${escapeXml(p[lang])}</p>`).join(''),
      )
      .join('')

    return (
      `    <item>\n      <title>${escapeXml(article.title[lang])}</title>\n` +
      `      <link>${url}</link>\n      <guid isPermaLink="true">${url}</guid>\n` +
      `      <pubDate>${rfc822(article.published)}</pubDate>\n` +
      `      <description>${escapeXml(article.description[lang])}</description>\n` +
      `      <content:encoded><![CDATA[${body}]]></content:encoded>\n    </item>`
    )
  }).join('\n')

  const latest = ARTICLES.reduce(
    (newest, article) => (article.published > newest ? article.published : newest),
    ARTICLES[0]?.published ?? new Date().toISOString().slice(0, 10),
  )

  const self = lang === 'en' ? '/feed.xml' : '/zh/feed.xml'
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">\n` +
    `  <channel>\n    <title>${escapeXml(lang === 'en' ? SITE_TITLE : SITE_TITLE_ZH)}</title>\n` +
    `    <link>${SITE_URL}${localized('/blog', lang)}</link>\n` +
    `    <description>${escapeXml(lang === 'en' ? SITE_DESCRIPTION : SITE_DESCRIPTION_ZH)}</description>\n` +
    `    <language>${lang === 'en' ? 'en' : 'zh-CN'}</language>\n    <lastBuildDate>${rfc822(latest)}</lastBuildDate>\n` +
    `    <atom:link href="${SITE_URL}${self}" rel="self" type="application/rss+xml" />\n` +
    `${items}\n  </channel>\n</rss>\n`
  )
}

/**
 * sitemap.xml and feed.xml are generated from the article list, so publishing a
 * post cannot silently skip either one.
 */
function seoAssets(): Plugin {
  return {
    name: 'tokened-seo-assets',
    apply: 'build',
    // The SSR build is a means to an end; only the client output is deployed.
    applyToEnvironment: (environment) => environment.name === 'client',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml() })
      this.emitFile({ type: 'asset', fileName: 'feed.xml', source: feedXml('en') })
      this.emitFile({ type: 'asset', fileName: 'zh/feed.xml', source: feedXml('zh') })
    },
  }
}

/** Prerendered pages, which the prerender script writes after the build. */
const PAGE_URLS = [
  ...(['en', 'zh'] as const).flatMap((lang) => [
    localized('/', lang),
    localized('/blog', lang),
    ...ARTICLES.map((article) => localized(`/blog/${article.slug}`, lang)),
  ]),
  '/404.html',
]

/**
 * The BPE tables stay out of the precache and are cached on first use instead,
 * so installing the worker never downloads megabytes of vocabulary a visitor
 * may never ask for. Everything else in the bundle is small and always needed.
 */
const ENCODING_ASSET = /tokenizer-\w+_base-/

function serviceWorker(): Plugin {
  return {
    name: 'tokened-service-worker',
    apply: 'build',
    applyToEnvironment: (environment) => environment.name === 'client',
    generateBundle(_options, bundle) {
      const assets = Object.values(bundle)
        .filter((item) => /\.(js|css)$/.test(item.fileName))
        .filter((item) => !ENCODING_ASSET.test(item.fileName))
        .map((item) => `/${item.fileName}`)

      const precache = [
        ...PAGE_URLS,
        ...assets.sort(),
        '/fonts/inter-latin.woff2',
        '/fonts/jetbrains-mono-latin.woff2',
        '/site.webmanifest',
        '/icon-192.png',
      ]

      const version = createHash('sha256')
        .update(precache.join('\n'))
        .digest('hex')
        .slice(0, 12)

      const template = readFileSync(
        fileURLToPath(new URL('./scripts/sw-template.js', import.meta.url)),
        'utf8',
      )

      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: template
          .replaceAll('__VERSION__', version)
          .replaceAll('__PRECACHE__', JSON.stringify(precache, null, 2)),
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), seoAssets(), serviceWorker()],
  build: {
    // The SSR bundle only exists to be rendered by scripts/prerender.mjs.
    copyPublicDir: !isSsrBuild,
    // Route CSS must not be split. Pages are prerendered, so their markup
    // paints before the lazy route chunk (and its stylesheet) arrives — the
    // blog index measured a 0.34 CLS painting unstyled and then reflowing.
    // The whole stylesheet is ~36kB, so one file for every page is the cheap
    // and drift-proof fix.
    cssCodeSplit: false,
    // The BPE rank tables are megabytes of pure data by nature and are loaded
    // lazily, so the default 500kB warning would fire on every build.
    chunkSizeWarningLimit: 2500,
    rollupOptions: { output: { codeSplitting: chunkGroups } },
  },
  // ES-module workers keep their dynamic imports split; the default worker
  // format would inline every encoding into one file.
  worker: {
    format: 'es',
    rollupOptions: { output: { codeSplitting: chunkGroups } },
  },
}))
