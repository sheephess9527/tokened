import { useEffect, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  getDictionary,
  I18nContext,
  preferredLanguage,
  readLanguageChoice,
  storeLanguageChoice,
  type Language,
} from '../i18n'
import { HREFLANG, languageFromPath, localizePath } from '../i18n/paths'

interface I18nProviderProps {
  children: ReactNode
}

/**
 * Language is read from the URL, never from state: `/zh/blog` is Chinese for
 * everyone, including crawlers and the prerenderer, and switching language is
 * a navigation rather than a hidden preference.
 */
export function I18nProvider({ children }: I18nProviderProps) {
  const { pathname, search, hash } = useLocation()
  const navigate = useNavigate()
  const lang = languageFromPath(pathname)

  useEffect(() => {
    document.documentElement.lang = HREFLANG[lang]
  }, [lang])

  // Only from the English root, only for a Chinese browser, and only until the
  // visitor picks a language themselves. Deep links from search are never
  // redirected — the URL they chose is the URL they get.
  useEffect(() => {
    if (pathname !== '/') return
    if (readLanguageChoice() !== null) return
    if (preferredLanguage() !== 'zh') return
    navigate(`/zh${search}${hash}`, { replace: true })
  }, [pathname, search, hash, navigate])

  const setLang = (next: Language) => {
    if (next === lang) return
    storeLanguageChoice(next)
    navigate(`${localizePath(pathname, next)}${search}${hash}`)
  }

  return (
    <I18nContext.Provider value={{ lang, t: getDictionary(lang), setLang }}>
      {children}
    </I18nContext.Provider>
  )
}
