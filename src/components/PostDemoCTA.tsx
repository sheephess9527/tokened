import { useI18n } from '../i18n'
import { MAILTO_BETA } from '../lib/contact'
import styles from './PostDemoCTA.module.css'

export function PostDemoCTA() {
  const { t } = useI18n()

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.glow} aria-hidden="true" />
        <h2>{t.postDemo.title}</h2>
        <p>{t.postDemo.desc}</p>
        <div className={styles.actions}>
          <a href={MAILTO_BETA} className={styles.primary} target="_blank" rel="noopener noreferrer">
            {t.postDemo.ctaBeta}
          </a>
          <a href="#pricing" className={styles.secondary}>
            {t.postDemo.ctaPricing}
          </a>
          <a href="#roadmap" className={styles.ghost}>
            {t.postDemo.ctaGateway}
          </a>
        </div>
      </div>
    </section>
  )
}