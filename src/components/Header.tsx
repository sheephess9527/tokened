import { useI18n } from '../i18n'
import { LanguageSwitcher } from './LanguageSwitcher'
import styles from './Header.module.css'

const GITHUB_URL = 'https://github.com/sheephess9527/tokened'

export function Header() {
  const { t } = useI18n()

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="#" className={styles.logo}>
          <span className={styles.logoMark}>◆</span>
          {t.brand}
        </a>

        <nav className={styles.nav}>
          <a href="#docs">{t.nav.docs}</a>
          <a href="#pricing">{t.nav.pricing}</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            {t.nav.github}
          </a>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  )
}