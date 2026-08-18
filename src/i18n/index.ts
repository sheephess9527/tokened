import { createContext, useContext } from 'react'
import { en, type Locale } from './en'
import { zh } from './zh'

export const LANGUAGES = ['en', 'zh'] as const

export type Language = (typeof LANGUAGES)[number]

const dictionaries: Record<Language, Locale> = { en, zh }

export function getDictionary(lang: Language): Locale {
  return dictionaries[lang]
}

/**
 * Only used to offer a one-time redirect from the English root; the rendered
 * language always comes from the URL. Returns null when the browser gives no
 * clear preference.
 */
export function preferredLanguage(): Language | null {
  if (typeof navigator === 'undefined') return null
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : null
}

const CHOICE_KEY = 'tokened-lang'

/** An explicit choice from the switcher, which outranks the browser hint. */
export function readLanguageChoice(): Language | null {
  try {
    const stored = localStorage.getItem(CHOICE_KEY)
    return stored === 'en' || stored === 'zh' ? stored : null
  } catch {
    return null
  }
}

export function storeLanguageChoice(lang: Language): void {
  try {
    localStorage.setItem(CHOICE_KEY, lang)
  } catch {
    /* storage unavailable */
  }
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