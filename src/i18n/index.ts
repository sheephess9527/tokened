import { createContext, useContext } from 'react'
import { en, type Locale } from './en'
import { zh } from './zh'

export type Language = 'en' | 'zh'

const dictionaries: Record<Language, Locale> = { en, zh }

export function getDictionary(lang: Language): Locale {
  return dictionaries[lang]
}

export function detectLanguage(): Language {
  if (typeof window === 'undefined') return 'en'
  const stored = localStorage.getItem('tokened-lang') as Language | null
  if (stored === 'en' || stored === 'zh') return stored
  const nav = navigator.language.toLowerCase()
  return nav.startsWith('zh') ? 'zh' : 'en'
}

export function persistLanguage(lang: Language) {
  localStorage.setItem('tokened-lang', lang)
}

interface I18nContextValue {
  lang: Language
  t: Locale
  setLang: (lang: Language) => void
}

export const I18nContext = createContext<I18nContextValue | null>(null)

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}