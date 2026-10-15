import { useMemo } from 'react'
import { useI18n } from '../i18n'
import { costSpread, estimateCosts, MODELS } from '../lib/pricing'
import styles from './Stats.module.css'

/** A representative all-English prompt — the spread barely moves with size. */
const SAMPLE_PROFILE = {
  openAiTokens: 1000,
  chineseChars: 0,
  nonChineseTokens: 1000,
}

export function Stats() {
  const { t } = useI18n()

  // Derived from the model table rather than typed into the copy, so these
  // numbers cannot drift when a model is added, removed or repriced.
  const facts = useMemo(() => {
    const spread = costSpread(estimateCosts(SAMPLE_PROFILE, 'USD'))
    return {
      '{models}': String(MODELS.length),
      '{spread}': spread ? `${Math.round(spread)}×` : '—',
    }
  }, [])

  const fill = (value: string) => facts[value as keyof typeof facts] ?? value

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2>{t.stats.title}</h2>
        <div className={styles.grid}>
          {t.stats.items.map((item) => (
            <article key={item.label} className={styles.card}>
              <span className={styles.value}>{fill(item.value)}</span>
              <span className={styles.label}>{item.label}</span>
              <p className={styles.desc}>{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
