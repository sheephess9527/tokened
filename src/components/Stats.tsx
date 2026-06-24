import { useI18n } from '../i18n'
import styles from './Stats.module.css'

export function Stats() {
  const { t } = useI18n()

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2>{t.stats.title}</h2>
        <div className={styles.grid}>
          {t.stats.items.map((item) => (
            <article key={item.label} className={styles.card}>
              <span className={styles.value}>{item.value}</span>
              <span className={styles.label}>{item.label}</span>
              <p className={styles.desc}>{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}