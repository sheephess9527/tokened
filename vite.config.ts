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

/** Generated from the article list so new posts can never be forgotten. */
function sitemap(): Plugin {
  return {
    name: 'tokened-sitemap',
    apply: 'build',
    generateBundle() {
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

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sitemap()],
  build: {
    // The BPE rank tables are megabytes of pure data by nature and are loaded
    // lazily, so the default 500kB warning would fire on every build.
    chunkSizeWarningLimit: 2500,
    rollupOptions: { output: { advancedChunks: chunkGroups } },
  },
  // ES-module workers keep their dynamic imports split; the default worker
  // format would inline every encoding into one file.
  worker: {
    format: 'es',
    rollupOptions: { output: { advancedChunks: chunkGroups } },
  },
})
