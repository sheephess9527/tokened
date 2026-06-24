import { useI18n } from '../i18n'
import { MAILTO_BETA, MAILTO_ENTERPRISE } from '../lib/contact'
import styles from './Pricing.module.css'

export function Pricing() {
  const { t } = useI18n()
  const tiers = [
    { ...t.pricing.tiers.free, href: '#tool', external: false, primary: false },
    { ...t.pricing.tiers.developer, href: MAILTO_BETA, external: true, primary: true },
    { ...t.pricing.tiers.enterprise, href: MAILTO_ENTERPRISE, external: true, primary: false },
  ]

  return (
    <section className={styles.section} id="pricing">
      <div className={styles.inner}>
        <h2>{t.pricing.title}</h2>
        <p className={styles.subtitle}>{t.pricing.subtitle}</p>

        <div className={styles.grid}>
          {tiers.map((tier) => (
            <article
              key={tier.name}
              className={tier.primary ? `${styles.card} ${styles.cardFeatured}` : styles.card}
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
              <a
                href={tier.href}
                className={tier.primary ? styles.ctaPrimary : styles.cta}
                {...(tier.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {tier.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}