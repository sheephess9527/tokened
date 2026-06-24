import { useI18n } from '../i18n'
import styles from './SaasPitch.module.css'

export function SaasPitch() {
  const { t } = useI18n()
  const features = [
    t.saas.features.cache,
    t.saas.features.privacy,
    t.saas.features.routing,
  ]

  return (
    <section className={styles.section} id="saas">
      <div className={styles.inner}>
        <h2>{t.saas.title}</h2>
        <p className={styles.subtitle}>{t.saas.subtitle}</p>
        <div className={styles.grid}>
          {features.map((f) => (
            <article key={f.title} className={styles.card}>
              <div className={styles.glow} />
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}