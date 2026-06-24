import { useState, type ReactNode } from 'react'
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

export function I18nProvider({ children }: I18nProviderProps) {
  const [lang, setLangState] = useState<Language>(detectLanguage)

  const setLang = (next: Language) => {
    setLangState(next)
    persistLanguage(next)
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en'
  }

  return (
    <I18nContext.Provider
      value={{
        lang,
        t: getDictionary(lang),
        setLang,
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}