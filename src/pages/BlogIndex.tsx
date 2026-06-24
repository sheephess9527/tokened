import { Link } from 'react-router-dom'
import { ARTICLES } from '../data/articles'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { usePageMeta } from '../hooks/usePageMeta'
import { useI18n } from '../i18n'
import styles from './Blog.module.css'

export function BlogIndex() {
  const { lang, t } = useI18n()

  usePageMeta({
    title: lang === 'zh' ? '指南与洞察 | Tokened' : 'Guides & Insights | Tokened',
    description: t.blog.indexDescription,
  })

  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.inner}>
          <Link to="/" className={styles.back}>
            ← {t.blog.backHome}
          </Link>
          <h1>{t.blog.title}</h1>
          <p className={styles.subtitle}>{t.blog.subtitle}</p>

          <div className={styles.grid}>
            {ARTICLES.map((article) => (
              <Link
                key={article.slug}
                to={`/blog/${article.slug}`}
                className={styles.card}
              >
                <span className={styles.time}>
                  {article.readTime[lang]} · {article.published}
                </span>
                <h2>{article.title[lang]}</h2>
                <p>{article.description[lang]}</p>
                <span className={styles.readMore}>{t.blog.readMore} →</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}