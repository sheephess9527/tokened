import { useI18n } from '../i18n'
import styles from './HowItWorks.module.css'

export function HowItWorks() {
  const { t } = useI18n()
  const steps = [t.howItWorks.steps.step1, t.howItWorks.steps.step2, t.howItWorks.steps.step3]

  return (
    <section className={styles.section} id="how">
      <div className={styles.inner}>
        <h2>{t.howItWorks.title}</h2>
        <p className={styles.subtitle}>{t.howItWorks.subtitle}</p>
        <div className={styles.steps}>
          {steps.map((step) => (
            <article key={step.title} className={styles.step}>
              <span className={styles.num}>{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}