import { useState } from 'react'
import { useI18n } from '../i18n'
import styles from './FAQ.module.css'

export function FAQ() {
  const { t } = useI18n()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className={styles.section} id="faq">
      <div className={styles.inner}>
        <h2>{t.faq.title}</h2>
        <p className={styles.subtitle}>{t.faq.subtitle}</p>
        <div className={styles.list}>
          {t.faq.items.map((item, i) => {
            const isOpen = openIndex === i
            const panelId = `faq-answer-${i}`
            const buttonId = `faq-question-${i}`
            return (
              <article key={item.q} className={styles.item}>
                <h3 className={styles.heading}>
                  <button
                    id={buttonId}
                    type="button"
                    className={styles.question}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span>{item.q}</span>
                    <span className={styles.icon} aria-hidden="true">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                </h3>
                {/* Kept mounted so crawlers and find-in-page still see answers. */}
                <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
                  <p className={styles.answer}>{item.a}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}