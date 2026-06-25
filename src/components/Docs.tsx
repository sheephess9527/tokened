import { useI18n } from '../i18n'
import { CodeBlock } from './CodeBlock'
import styles from './Docs.module.css'

const NPM_IMPORT = `import { encode } from 'gpt-tokenizer'\nconst tokens = encode(prompt).length`
const PYTHON_IMPORT = `import tiktoken\nenc = tiktoken.get_encoding("cl100k_base")\nlen(enc.encode(prompt))`

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
            <CodeBlock code={t.docs.npm.install} />
            <CodeBlock code={NPM_IMPORT} />
          </article>

          <article className={styles.card}>
            <h3>{t.docs.python.title}</h3>
            <CodeBlock code={t.docs.python.install} />
            <CodeBlock code={PYTHON_IMPORT} />
          </article>
        </div>
      </div>
    </section>
  )
}