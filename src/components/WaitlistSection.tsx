import { useI18n } from '../i18n'
import { SimpleContact } from './SimpleContact'
import styles from './WaitlistSection.module.css'

export function WaitlistSection() {
  const { t } = useI18n()

  return (
    <section className={styles.section} id="waitlist">
      <div className={styles.inner}>
        <h2>{t.contact.title}</h2>
        <p className={styles.desc}>{t.contact.subtitle}</p>
        <SimpleContact />
      </div>
    </section>
  )
}