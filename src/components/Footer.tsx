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
            <a href="#how">{t.footer.howItWorks}</a>
            <a href="#docs">{t.footer.integration}</a>
            <a href="#resources">{t.footer.resources}</a>
            <a href="#roadmap">{t.footer.roadmap}</a>
            <a href="#faq">{t.footer.faq}</a>
            <a href="#privacy">{t.footer.privacy}</a>
            <a href="#terms">{t.footer.terms}</a>
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