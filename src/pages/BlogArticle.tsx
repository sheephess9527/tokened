import { Link, Navigate, useParams } from 'react-router-dom'
import { getArticle } from '../data/articles'
import { BackToTop } from '../components/BackToTop'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { usePageMeta } from '../hooks/usePageMeta'
import { useI18n } from '../i18n'
import styles from './Blog.module.css'

export function BlogArticle() {
  const { slug } = useParams<{ slug: string }>()
  const { lang, t } = useI18n()
  const article = slug ? getArticle(slug) : undefined

  usePageMeta({
    title: article ? `${article.title[lang]} | Tokened` : 'Tokened',
    description: article?.description[lang],
  })

  if (!article) return <Navigate to="/blog" replace />

  return (
    <>
      <Header />
      <main className={styles.page}>
        <article className={styles.article}>
          <Link to="/blog" className={styles.back}>
            ← {t.blog.backBlog}
          </Link>
          <span className={styles.meta}>
            {article.readTime[lang]} · {article.published}
          </span>
          <h1>{article.title[lang]}</h1>
          <p className={styles.lead}>{article.description[lang]}</p>

          {article.sections.map((section) => (
            <section key={section.heading.en} className={styles.section}>
              <h2>{section.heading[lang]}</h2>
              {section.paragraphs.map((p) => (
                <p key={p.en}>{p[lang]}</p>
              ))}
            </section>
          ))}

          <div className={styles.ctaBox}>
            <p>{t.blog.tryTool}</p>
            <a href="/#tool" className={styles.ctaBtn}>
              {t.blog.tryToolBtn}
            </a>
          </div>
        </article>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}