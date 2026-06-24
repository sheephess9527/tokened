import { useI18n, type Language } from '../i18n'
import styles from './LanguageSwitcher.module.css'

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n()

  const select = (next: Language) => {
    if (next !== lang) setLang(next)
  }

  return (
    <div className={styles.switcher} role="group" aria-label="Language">
      <button
        type="button"
        className={lang === 'en' ? styles.active : ''}
        onClick={() => select('en')}
      >
        EN
      </button>
      <span className={styles.divider}>/</span>
      <button
        type="button"
        className={lang === 'zh' ? styles.active : ''}
        onClick={() => select('zh')}
      >
        中
      </button>
    </div>
  )
}