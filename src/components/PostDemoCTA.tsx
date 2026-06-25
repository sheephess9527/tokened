import { useI18n } from '../i18n'

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
          <a href="#waitlist" className={styles.primary}>
            {t.postDemo.ctaBeta}
          </a>
          <a href="#pricing" className={styles.secondary}>
            {t.postDemo.ctaPricing}
          </a>
        </div>
      </div>
    </section>
  )
}