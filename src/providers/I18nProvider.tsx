import { useEffect, useState, type ReactNode } from 'react'
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
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
  // Pages are prerendered in English, so the first render must match that on
  // both sides. The stored/browser language is applied before the first paint
  // after hydration.
  const [lang, setLang] = useState<Language>('en')

  useIsomorphicLayoutEffect(() => {
    const detected = detectLanguage()
    if (detected !== 'en') setLang(detected)
  }, [])

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
