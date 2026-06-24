import { Link } from 'react-router-dom'
import { ARTICLES } from '../data/articles'
import { useI18n } from '../i18n'
import styles from './Resources.module.css'

export function Resources() {
  const { lang, t } = useI18n()

  return (
    <section className={styles.section} id="resources">
      <div className={styles.inner}>
        <h2>{t.resources.title}</h2>
        <p className={styles.subtitle}>{t.resources.subtitle}</p>
        <div className={styles.grid}>
          {ARTICLES.map((article) => (
            <Link
              key={article.slug}
              to={`/blog/${article.slug}`}
              className={styles.card}
            >
              <span className={styles.time}>{article.readTime[lang]}</span>
              <h3>{article.title[lang]}</h3>
              <p>{article.description[lang]}</p>
              <span className={styles.readMore}>{t.blog.readMore} →</span>
            </Link>
          ))}
        </div>
        <div className={styles.viewAll}>
          <Link to="/blog">{t.blog.title} →</Link>
        </div>
      </div>
    </section>
  )
}