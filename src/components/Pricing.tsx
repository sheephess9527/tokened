import { useI18n } from '../i18n'
import styles from './Pricing.module.css'

export function Pricing() {
  const { t } = useI18n()
  const free = t.pricing.free
  const waitlist = t.pricing.waitlist

  return (
    <section className={styles.section} id="pricing">
      <div className={styles.inner}>
        <h2>{t.pricing.title}</h2>
        <p className={styles.subtitle}>{t.pricing.subtitle}</p>

        <article className={styles.card}>
          <span className={styles.badgeLive}>{free.statusLabel}</span>
          <h3>{free.name}</h3>
          <div className={styles.price}>
            <span className={styles.amount}>{free.price}</span>
            <span className={styles.period}>{free.period}</span>
          </div>
          <ul className={styles.features}>
            {free.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <a href="#tool" className={styles.ctaPrimary}>
            {free.cta}
          </a>
        </article>

        <div className={styles.waitlist}>
          <h3>{waitlist.title}</h3>
          <p>{waitlist.desc}</p>
          <div className={styles.waitlistActions}>
            <a href="#waitlist" className={styles.ctaSecondary}>
              {waitlist.cta}
            </a>
            <a href="#roadmap" className={styles.roadmapLink}>
              {waitlist.roadmapLink}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}