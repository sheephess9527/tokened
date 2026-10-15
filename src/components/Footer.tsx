import { useI18n } from '../i18n'
import { LocalLink } from './LocalLink'
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
            <LocalLink to="/#how">{t.footer.howItWorks}</LocalLink>
            <LocalLink to="/#docs">{t.footer.integration}</LocalLink>
            <LocalLink to="/blog">{t.footer.blog}</LocalLink>
            <LocalLink to="/#roadmap">{t.footer.roadmap}</LocalLink>
            <LocalLink to="/#waitlist">{t.footer.waitlist}</LocalLink>
            <LocalLink to="/#faq">{t.footer.faq}</LocalLink>
            <LocalLink to="/#privacy">{t.footer.privacy}</LocalLink>
            <LocalLink to="/#terms">{t.footer.terms}</LocalLink>
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