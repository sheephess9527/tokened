import type { Language } from './index'

/**
 * Language lives in the URL rather than in localStorage: it makes each
 * translation separately crawlable and linkable, and it makes the rendered
 * language a pure function of the location, so prerendered HTML and the
 * hydrated app can never disagree.
 */
export const LANG_PREFIX: Record<Language, string> = { en: '', zh: '/zh' }

export const HREFLANG: Record<Language, string> = { en: 'en', zh: 'zh-Hans' }

export function languageFromPath(pathname: string): Language {
  return pathname === '/zh' || pathname.startsWith('/zh/') ? 'zh' : 'en'
}

/** `/zh/blog` → `/blog`. Language-neutral paths always start with `/`. */
export function stripLanguage(pathname: string): string {
  if (pathname === '/zh') return '/'
  if (pathname.startsWith('/zh/')) return pathname.slice('/zh'.length)
  return pathname || '/'
}

/**
 * `/blog` + `zh` → `/zh/blog`. Accepts a hash suffix so in-page anchors stay
 * on the reader's own language (`/#tool` → `/zh#tool`).
 */
export function localizePath(path: string, lang: Language): string {
  const [pathname, hash = ''] = path.split('#')
  const neutral = stripLanguage(pathname || '/')
  const prefix = LANG_PREFIX[lang]
  const localized = neutral === '/' ? prefix || '/' : `${prefix}${neutral}`
  return hash ? `${localized}#${hash}` : localized
}
