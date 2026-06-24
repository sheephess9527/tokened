import { useI18n } from '../i18n'
import styles from './Resources.module.css'

export function Resources() {
  const { t } = useI18n()
  const articles = [t.resources.articles.a1, t.resources.articles.a2, t.resources.articles.a3]

  return (
    <section className={styles.section} id="resources">
      <div className={styles.inner}>
        <h2>{t.resources.title}</h2>
        <p className={styles.subtitle}>{t.resources.subtitle}</p>
        <div className={styles.grid}>
          {articles.map((article) => (
            <article key={article.title} className={styles.card}>
              <span className={styles.time}>{article.readTime}</span>
              <h3>{article.title}</h3>
              <p>{article.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}