import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n'
import { LanguageSwitcher } from './LanguageSwitcher'
import styles from './Header.module.css'

const GITHUB_URL = 'https://github.com/sheephess9527/tokened'

export function Header() {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const close = () => setOpen(false)

  // Close the mobile menu on route change so it never covers the new page.
  useEffect(close, [pathname])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      menuBtnRef.current?.focus()
    }

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} onClick={close}>
          <span className={styles.logoMark}>◆</span>
          {t.brand}
        </Link>

        <button
          ref={menuBtnRef}
          type="button"
          className={styles.menuBtn}
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={t.nav.menu}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.menuIcon} data-open={open} />
        </button>

        <nav
          id="primary-nav"
          className={`${styles.nav} ${open ? styles.navOpen : ''}`}
          aria-label={t.brand}
        >
          <Link to="/#tool" onClick={close}>
            {t.nav.demo}
          </Link>
          <Link to="/#how" onClick={close}>
            {t.nav.howItWorks}
          </Link>
          <Link to="/#features" onClick={close}>
            {t.nav.features}
          </Link>
          <Link to="/blog" onClick={close} aria-current={pathname.startsWith('/blog') ? 'page' : undefined}>
            {t.nav.blog}
          </Link>
          <Link to="/#pricing" onClick={close}>
            {t.nav.pricing}
          </Link>
          <Link to="/#faq" onClick={close}>
            {t.nav.faq}
          </Link>
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