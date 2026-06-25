import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import { LanguageSwitcher } from './LanguageSwitcher'
import styles from './Header.module.css'

const GITHUB_URL = 'https://github.com/sheephess9527/tokened'

export function Header() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} onClick={close}>
          <span className={styles.logoMark}>◆</span>
          {t.brand}
        </Link>

        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={open}
          aria-label={t.nav.menu}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.menuIcon} data-open={open} />
        </button>

        <nav className={`${styles.nav} ${open ? styles.navOpen : ''}`}>
          <a href="/#tool" onClick={close}>
            {t.nav.demo}
          </a>
          <a href="/#how" onClick={close}>
            {t.nav.howItWorks}
          </a>
          <a href="/#features" onClick={close}>
            {t.nav.features}
          </a>
          <Link to="/blog" onClick={close}>
            {t.nav.blog}
          </Link>
          <a href="/#pricing" onClick={close}>
            {t.nav.pricing}
          </a>
          <a href="/#faq" onClick={close}>
            {t.nav.faq}
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.github}
            onClick={close}
          >
            {t.nav.github}
          </a>
          <LanguageSwitcher />
        </nav>
      </div>
      {open && <button type="button" className={styles.backdrop} aria-label={t.nav.menu} onClick={close} />}
    </header>
  )
}