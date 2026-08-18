import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import { CONTACT_EMAIL, MAILTO_CONTACT } from '../lib/contact'
import styles from './Footer.module.css'

export function Footer() {
  const { t } = useI18n()
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brandBlock}>
            <span className={styles.brand}>{t.brand}</span>
            <span className={styles.tagline}>{t.footer.tagline}</span>
          </div>

          <div className={styles.contact}>
            <p className={styles.contactLabel}>{t.footer.contact}</p>
            <a href={MAILTO_CONTACT} className={styles.email}>
              {CONTACT_EMAIL}
            </a>
          </div>

          <nav className={styles.links}>
            <Link to="/#how">{t.footer.howItWorks}</Link>
            <Link to="/#docs">{t.footer.integration}</Link>
            <Link to="/blog">{t.footer.blog}</Link>
            <Link to="/#roadmap">{t.footer.roadmap}</Link>
            <Link to="/#waitlist">{t.footer.waitlist}</Link>
            <Link to="/#faq">{t.footer.faq}</Link>
            <Link to="/#privacy">{t.footer.privacy}</Link>
            <Link to="/#terms">{t.footer.terms}</Link>
          </nav>
        </div>

        <p className={styles.about}>{t.footer.about}</p>

        <div className={styles.bottom}>
          <span className={styles.rights}>
            © {year} tokened.uk. {t.footer.rights}
          </span>
        </div>
      </div>
    </footer>
  )
}