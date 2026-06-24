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
            return (
              <article key={item.q} className={styles.item}>
                <button
                  type="button"
                  className={styles.question}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <span className={styles.icon} aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && <p className={styles.answer}>{item.a}</p>}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}