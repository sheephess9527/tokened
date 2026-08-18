import { useEffect, useState, type ReactNode } from 'react'
import {
  detectLanguage,
  getDictionary,
  I18nContext,
  persistLanguage,
  type Language,
} from '../i18n'

interface I18nProviderProps {
  children: ReactNode
}

const HTML_LANG: Record<Language, string> = { en: 'en', zh: 'zh-CN' }

export function I18nProvider({ children }: I18nProviderProps) {
  const [lang, setLang] = useState<Language>(detectLanguage)

  // Covers the detected language too — a zh visitor previously got Chinese
  // copy served under `<html lang="en">` until they touched the switcher.
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang]
  }, [lang])

  const selectLang = (next: Language) => {
    setLang(next)
    persistLanguage(next)
  }

  return (
    <I18nContext.Provider
      value={{
        lang,
        t: getDictionary(lang),
        setLang: selectLang,
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}
