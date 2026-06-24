import { useI18n } from '../i18n'
import styles from './TrustBar.module.css'

export function TrustBar() {
  const { t } = useI18n()

  return (
    <section className={styles.bar} aria-label="Trust signals">
      <div className={styles.inner}>
        {t.trust.items.map((item) => (
          <div key={item} className={styles.item}>
            <span className={styles.dot} aria-hidden="true" />
            {item}
          </div>
        ))}
      </div>
    </section>
  )
}