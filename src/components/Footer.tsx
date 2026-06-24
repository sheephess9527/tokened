import { useI18n } from '../i18n'
import styles from './Footer.module.css'

export function Footer() {
  const { t } = useI18n()
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.brand}>{t.brand}</span>
        <span className={styles.tagline}>{t.footer.tagline}</span>
        <span className={styles.rights}>
          © {year} tokened.uk. {t.footer.rights}
        </span>
      </div>
    </footer>
  )
}