/**
 * Turns the SPA shell into real static pages.
 *
 * Without this the served HTML is an empty `<div id="root">`, so every word of
 * copy, every FAQ answer and every article body exists only after JavaScript
 * runs. Each route below is rendered to markup and written to its own file;
 * the client hydrates that markup instead of rebuilding it.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const SSR_ENTRY = pathToFileURL(join(ROOT, 'dist-ssr/entry-server.js')).href

const { render, PRERENDER_PATHS, absoluteUrl } = await import(SSR_ENTRY)
const HREFLANG = { en: 'en', zh: 'zh-Hans' }

const template = await readFile(join(DIST, 'index.html'), 'utf8')

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** Rewrite one `<meta>`/`<title>`/`<link>` value already present in the shell. */
function setTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html
}

/**
 * hreflang has to be in the served markup, not added by script: a crawler that
 * never runs JavaScript is exactly the audience it exists for.
 */
function alternateLinks(alternates) {
  if (!alternates) return ''
  const links = Object.entries(alternates).map(
    ([lang, path]) =>
      `    <link rel="alternate" hreflang="${HREFLANG[lang]}" href="${absoluteUrl(path)}" />`,
  )
  if (alternates.en) {
    links.push(
      `    <link rel="alternate" hreflang="x-default" href="${absoluteUrl(alternates.en)}" />`,
    )
  }
  return links.join('\n') + '\n'
}

function applyMeta(html, meta, url) {
  const title = escapeHtml(meta.title)
  const description = escapeHtml(meta.description ?? '')
  const robots = meta.noindex ? 'noindex, follow' : 'index, follow'

  let out = html
  out = out.replace('<html lang="en">', `<html lang="${HREFLANG[meta.lang ?? 'en']}">`)
  if (meta.lang === 'zh') {
    out = out.replace('href="/feed.xml"', 'href="/zh/feed.xml"')
  }
  out = out.replace(
    /<link rel="canonical" href="[^"]*" \/>\n/,
    (match) => match + alternateLinks(meta.alternates),
  )
  out = setTag(out, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
  out = setTag(
    out,
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${url}" />`,
  )
  out = setTag(
    out,
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="description" content="${description}" />`,
  )
  out = setTag(
    out,
    /<meta name="robots" content="[^"]*" \/>/,
    `<meta name="robots" content="${robots}" />`,
  )
  out = setTag(
    out,
    /<meta property="og:title" content="[\s\S]*?" \/>/,
    `<meta property="og:title" content="${title}" />`,
  )
  out = setTag(
    out,
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta property="og:description" content="${description}" />`,
  )
  out = setTag(
    out,
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${url}" />`,
  )
  out = setTag(
    out,
    /<meta property="og:type" content="[^"]*" \/>/,
    `<meta property="og:type" content="${meta.type ?? 'website'}" />`,
  )
  out = setTag(
    out,
    /<meta property="og:locale" content="[^"]*" \/>/,
    `<meta property="og:locale" content="${meta.lang === 'zh' ? 'zh_CN' : 'en_GB'}" />`,
  )
  out = setTag(
    out,
    /<meta name="twitter:title" content="[\s\S]*?" \/>/,
    `<meta name="twitter:title" content="${title}" />`,
  )
  out = setTag(
    out,
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="twitter:description" content="${description}" />`,
  )
  return out
}

const SITE_URL = 'https://tokened.uk'
const NOT_FOUND_PATH = '/404'

async function emit(route, outFile) {
  const { html, meta } = await render(route)
  const url = absoluteUrl(route)

  let page = applyMeta(template, meta, url)
  page = page.replace('<div id="root"></div>', `<div id="root">${html}</div>`)

  await mkdir(dirname(outFile), { recursive: true })
  await writeFile(outFile, page)
  console.log(`prerendered ${route.padEnd(32)} ${(page.length / 1024).toFixed(1)} kB`)
}

for (const route of PRERENDER_PATHS) {
  await emit(route, route === '/' ? join(DIST, 'index.html') : join(DIST, route, 'index.html'))
}

// Every real route above is now a file on disk, so anything left over is
// genuinely missing: Cloudflare Pages serves this with a 404 status instead of
// handing back the landing page under a 200.
await emit(NOT_FOUND_PATH, join(DIST, '404.html'))

console.log(`\n${PRERENDER_PATHS.length + 1} pages written to dist/`)
