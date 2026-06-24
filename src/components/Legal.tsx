import { useI18n } from '../i18n'
import styles from './Legal.module.css'

export function Legal() {
  const { t } = useI18n()

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <article className={styles.card} id="privacy">
          <h2>{t.legal.privacyTitle}</h2>
          {t.legal.privacy.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </article>

        <article className={styles.card} id="terms">
          <h2>{t.legal.termsTitle}</h2>
          {t.legal.terms.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </article>
      </div>
    </section>
  )
}