import { useLocation, useParams } from 'react-router-dom'
import { getArticle } from '../data/articles'
import { BackToTop } from '../components/BackToTop'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { JsonLd } from '../components/JsonLd'
import { usePageMeta } from '../hooks/usePageMeta'
import { useI18n } from '../i18n'
import { LocalLink } from '../components/LocalLink'
import { getRouteMeta } from '../lib/routeMeta'
import {
  blogPostingSchema,
  breadcrumbSchema,
  graph,
  organizationSchema,
} from '../lib/structuredData'
import { NotFound } from './NotFound'
import styles from './Blog.module.css'

export function BlogArticle() {
  const { slug } = useParams<{ slug: string }>()
  const { pathname } = useLocation()
  const { lang, t } = useI18n()
  const article = slug ? getArticle(slug) : undefined

  usePageMeta(getRouteMeta(pathname))

  if (!article) return <NotFound />

  return (
    <>
      <JsonLd
        data={graph(
          organizationSchema(),
          blogPostingSchema(article, lang),
          breadcrumbSchema([
            { name: t.blog.backHome, path: '/' },
            { name: t.blog.title, path: '/blog' },
            { name: article.title[lang], path: `/blog/${article.slug}` },
          ], lang),
        )}
      />
      <Header />
      <main id="main" className={styles.page}>
        <article className={styles.article}>
          <LocalLink to="/blog" className={styles.back}>
            ← {t.blog.backBlog}
          </LocalLink>
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
            <LocalLink to="/#tool" className={styles.ctaBtn}>
              {t.blog.tryToolBtn}
            </LocalLink>
          </div>
        </article>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}