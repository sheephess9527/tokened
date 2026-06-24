import { useI18n } from '../i18n'
import styles from './Pricing.module.css'

export function Pricing() {
  const { t } = useI18n()
  const tiers = [
    t.pricing.tiers.free,
    t.pricing.tiers.developer,
    t.pricing.tiers.enterprise,
  ]

  return (
    <section className={styles.section} id="pricing">
      <div className={styles.inner}>
        <h2>{t.pricing.title}</h2>
        <p className={styles.subtitle}>{t.pricing.subtitle}</p>

        <div className={styles.grid}>
          {tiers.map((tier, i) => (
            <article
              key={tier.name}
              className={i === 1 ? `${styles.card} ${styles.cardFeatured}` : styles.card}
            >
              {'badge' in tier && tier.badge && (
                <span className={styles.badge}>{tier.badge}</span>
              )}
              <h3>{tier.name}</h3>
              <div className={styles.price}>
                <span className={styles.amount}>{tier.price}</span>
                {tier.period && <span className={styles.period}>{tier.period}</span>}
              </div>
              <ul className={styles.features}>
                {tier.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <button type="button" className={i === 1 ? styles.ctaPrimary : styles.cta}>
                {tier.cta}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}