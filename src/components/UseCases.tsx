import { useI18n } from '../i18n'
import styles from './UseCases.module.css'

export function UseCases() {
  const { t } = useI18n()
  const cases = [t.useCases.cases.c1, t.useCases.cases.c2, t.useCases.cases.c3]

  return (
    <section className={styles.section} id="use-cases">
      <div className={styles.inner}>
        <h2>{t.useCases.title}</h2>
        <p className={styles.subtitle}>{t.useCases.subtitle}</p>
        <div className={styles.grid}>
          {cases.map((c) => (
            <article key={c.title} className={styles.card}>
              <span className={styles.stat}>{c.stat}</span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}