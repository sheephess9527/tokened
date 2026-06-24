import { useI18n } from '../i18n'
import { WaitlistForm } from './WaitlistForm'
import styles from './WaitlistSection.module.css'

export function WaitlistSection() {
  const { t } = useI18n()

  return (
    <section className={styles.section} id="waitlist">
      <div className={styles.inner}>
        <div className={styles.gateway} id="gateway-beta">
          <span className={styles.badge}>{t.gatewayBeta.badge}</span>
          <h2>{t.gatewayBeta.title}</h2>
          <p className={styles.desc}>{t.gatewayBeta.subtitle}</p>
          <ul className={styles.features}>
            {t.gatewayBeta.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <pre className={styles.code}>
            <code>{t.gatewayBeta.code}</code>
          </pre>
          <p className={styles.note}>{t.gatewayBeta.note}</p>
        </div>

        <div className={styles.formPanel}>
          <h2>{t.waitlist.title}</h2>
          <p className={styles.formDesc}>{t.waitlist.subtitle}</p>
          <WaitlistForm defaultInterest="gateway" />
        </div>
      </div>
    </section>
  )
}