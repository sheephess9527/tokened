import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import { LanguageSwitcher } from './LanguageSwitcher'
import styles from './Header.module.css'

const GITHUB_URL = 'https://github.com/sheephess9527/tokened'

export function Header() {
  const { t } = useI18n()

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>◆</span>
          {t.brand}
        </Link>

        <nav className={styles.nav}>
          <a href="/#tool">{t.nav.demo}</a>
          <a href="/#how">{t.nav.howItWorks}</a>
          <a href="/#features">{t.nav.features}</a>
          <Link to="/blog">{t.nav.blog}</Link>
          <a href="/#pricing">{t.nav.pricing}</a>
          <a href="/#faq">{t.nav.faq}</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={styles.github}>
            {t.nav.github}
          </a>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  )
}