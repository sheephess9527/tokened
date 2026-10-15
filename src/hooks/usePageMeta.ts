import { useEffect } from 'react'
import { absoluteUrl, OG_IMAGE, SITE_NAME } from '../lib/site'
import type { Language } from '../i18n'
import { HREFLANG } from '../i18n/paths'

export interface PageMeta {
  title: string
  description?: string
  /** Canonical path, e.g. `/blog/slug`. Defaults to the current pathname. */
  path?: string
  type?: 'website' | 'article'
  lang?: Language
  noindex?: boolean
  /** Language-tagged paths for this page, emitted as hreflang alternates. */
  alternates?: Partial<Record<Language, string>>
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = href
}

const ALTERNATE_SELECTOR = 'link[rel="alternate"][hreflang]'

/** Tells search engines the two language versions are the same page. */
function syncAlternates(alternates: Partial<Record<Language, string>>) {
  document.head.querySelectorAll(ALTERNATE_SELECTOR).forEach((node) => node.remove())

  const entries = Object.entries(alternates).filter(([, path]) => path) as [
    Language,
    string,
  ][]
  if (entries.length === 0) return

  for (const [language, path] of entries) {
    const link = document.createElement('link')
    link.rel = 'alternate'
    link.hreflang = HREFLANG[language]
    link.href = absoluteUrl(path)
    document.head.appendChild(link)
  }

  const fallback = alternates.en
  if (!fallback) return
  const xDefault = document.createElement('link')
  xDefault.rel = 'alternate'
  xDefault.hreflang = 'x-default'
  xDefault.href = absoluteUrl(fallback)
  document.head.appendChild(xDefault)
}

/**
 * Keeps title, canonical, Open Graph and Twitter tags in sync as the SPA
 * navigates — crawlers and link unfurlers only ever see the live document head.
 */
export function usePageMeta({
  title,
  description,
  path,
  type = 'website',
  lang = 'en',
  noindex = false,
  alternates,
}: PageMeta) {
  // Pulled apart so a freshly built `alternates` object does not re-run the
  // effect on every render.
  const enAlternate = alternates?.en
  const zhAlternate = alternates?.zh

  useEffect(() => {
    const url = absoluteUrl(path ?? window.location.pathname)

    document.title = title
    upsertCanonical(url)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:image', OG_IMAGE)
    upsertMeta('property', 'og:locale', lang === 'zh' ? 'zh_CN' : 'en_GB')
    upsertMeta('property', 'og:locale:alternate', lang === 'zh' ? 'en_GB' : 'zh_CN')
    syncAlternates({ en: enAlternate, zh: zhAlternate })
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:image', OG_IMAGE)
    upsertMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow')

    if (description) {
      upsertMeta('name', 'description', description)
      upsertMeta('property', 'og:description', description)
      upsertMeta('name', 'twitter:description', description)
    }
  }, [title, description, path, type, lang, noindex, enAlternate, zhAlternate])
}
