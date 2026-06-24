import { useI18n } from '../i18n'
import { MAILTO_BETA, MAILTO_ENTERPRISE } from '../lib/contact'
import styles from './Pricing.module.css'

export function Pricing() {
  const { t } = useI18n()

  const tiers = [
    {
      key: 'free',
      tier: t.pricing.tiers.free,
      href: '#tool',
      external: false,
    },
    {
      key: 'developer',
      tier: t.pricing.tiers.developer,
      href: MAILTO_BETA,
      external: true,
    },
    {
      key: 'enterprise',
      tier: t.pricing.tiers.enterprise,
      href: MAILTO_ENTERPRISE,
      external: true,
    },
  ]

  return (
    <section className={styles.section} id="pricing">
      <div className={styles.inner}>
        <h2>{t.pricing.title}</h2>
        <p className={styles.subtitle}>{t.pricing.subtitle}</p>

        <div className={styles.grid}>
          {tiers.map(({ key, tier, href, external }) => {
            const isLive = tier.status === 'live'
            return (
              <article
                key={key}
                className={
                  isLive
                    ? `${styles.card} ${styles.cardLive}`
                    : `${styles.card} ${styles.cardPlanned}`
                }
              >
                <span
                  className={isLive ? styles.badgeLive : styles.badgePlanned}
                >
                  {tier.statusLabel}
                </span>
                <h3>{tier.name}</h3>
                <div className={styles.price}>
                  <span className={styles.amount}>{tier.price}</span>
                  {tier.period && (
                    <span className={styles.period}>{tier.period}</span>
                  )}
                </div>
                <ul className={styles.features}>
                  {tier.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a
                  href={href}
                  className={isLive ? styles.ctaPrimary : styles.cta}
                  {...(external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {tier.cta}
                </a>
              </article>
            )
          })}
        </div>

        <p className={styles.disclaimer}>{t.pricing.disclaimer}</p>
      </div>
    </section>
  )
}