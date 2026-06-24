import { useI18n } from '../i18n'
import styles from './Roadmap.module.css'

export function Roadmap() {
  const { t } = useI18n()
  const phases = [
    t.roadmap.phases.phase1,
    t.roadmap.phases.phase2,
    t.roadmap.phases.phase3,
  ]

  return (
    <section className={styles.section} id="roadmap">
      <div className={styles.inner}>
        <h2>{t.roadmap.title}</h2>
        <p className={styles.subtitle}>{t.roadmap.subtitle}</p>

        <div className={styles.grid}>
          {phases.map((phase, i) => (
            <article
              key={phase.title}
              className={i === 0 ? `${styles.card} ${styles.cardLive}` : styles.card}
            >
              <span className={styles.label}>{phase.label}</span>
              <h3>{phase.title}</h3>
              <ul>
                {phase.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}