import { useI18n } from '../i18n'
import styles from './Docs.module.css'

export function Docs() {
  const { t } = useI18n()

  return (
    <section className={styles.section} id="docs">
      <div className={styles.inner}>
        <h2>{t.docs.title}</h2>
        <p className={styles.subtitle}>{t.docs.subtitle}</p>
        <p className={styles.intro}>{t.docs.intro}</p>

        <div className={styles.grid}>
          <article className={styles.card}>
            <h3>{t.docs.npm.title}</h3>
            <pre className={styles.code}>
              <code>{t.docs.npm.install}</code>
            </pre>
            <pre className={styles.code}>
              <code>{`import { encode } from 'gpt-tokenizer'\nconst tokens = encode(prompt).length`}</code>
            </pre>
          </article>

          <article className={styles.card}>
            <h3>{t.docs.python.title}</h3>
            <pre className={styles.code}>
              <code>{t.docs.python.install}</code>
            </pre>
            <pre className={styles.code}>
              <code>{`import tiktoken\nenc = tiktoken.get_encoding("cl100k_base")\nlen(enc.encode(prompt))`}</code>
            </pre>
          </article>
        </div>
      </div>
    </section>
  )
}