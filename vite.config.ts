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

function sitemapXml(): string {
  const today = new Date().toISOString().slice(0, 10)
  const urls = [
    { loc: `${SITE_URL}/`, lastmod: today, changefreq: 'weekly', priority: '1.0' },
    { loc: `${SITE_URL}/blog`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
    ...ARTICLES.map((article) => ({
      loc: `${SITE_URL}/blog/${article.slug}`,
      lastmod: article.published,
      changefreq: 'monthly',
      priority: '0.7',
    })),
  ]

  const body = urls
    .map(
      (url) =>
        `  <url>\n    <loc>${url.loc}</loc>\n    <lastmod>${url.lastmod}</lastmod>\n` +
        `    <changefreq>${url.changefreq}</changefreq>\n    <priority>${url.priority}</priority>\n  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
}

function feedXml(): string {
  const items = ARTICLES.map((article) => {
    const url = `${SITE_URL}/blog/${article.slug}`
    const body = article.sections
      .map(
        (section) =>
          `<h2>${escapeXml(section.heading.en)}</h2>` +
          section.paragraphs.map((p) => `<p>${escapeXml(p.en)}</p>`).join(''),
      )
      .join('')

    return (
      `    <item>\n      <title>${escapeXml(article.title.en)}</title>\n` +
      `      <link>${url}</link>\n      <guid isPermaLink="true">${url}</guid>\n` +
      `      <pubDate>${rfc822(article.published)}</pubDate>\n` +
      `      <description>${escapeXml(article.description.en)}</description>\n` +
      `      <content:encoded><![CDATA[${body}]]></content:encoded>\n    </item>`
    )
  }).join('\n')

  const latest = ARTICLES.reduce(
    (newest, article) => (article.published > newest ? article.published : newest),
    ARTICLES[0]?.published ?? new Date().toISOString().slice(0, 10),
  )

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">\n` +
    `  <channel>\n    <title>${escapeXml(SITE_TITLE)}</title>\n` +
    `    <link>${SITE_URL}/blog</link>\n` +
    `    <description>${escapeXml(SITE_DESCRIPTION)}</description>\n` +
    `    <language>en</language>\n    <lastBuildDate>${rfc822(latest)}</lastBuildDate>\n` +
    `    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />\n` +
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
      this.emitFile({ type: 'asset', fileName: 'feed.xml', source: feedXml() })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), seoAssets()],
  build: {
    // The SSR bundle only exists to be rendered by scripts/prerender.mjs.
    copyPublicDir: !isSsrBuild,
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
