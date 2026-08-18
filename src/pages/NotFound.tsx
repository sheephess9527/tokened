import { Link } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { usePageMeta } from '../hooks/usePageMeta'
import { useI18n } from '../i18n'
import styles from './NotFound.module.css'

export function NotFound() {
  const { lang, t } = useI18n()

  usePageMeta({
    title: `${t.notFound.title} | Tokened`,
    description: t.notFound.desc,
    lang,
    noindex: true,
  })

  return (
    <>
      <Header />
      <main id="main" className={styles.page}>
        <p className={styles.code}>404</p>
        <h1>{t.notFound.title}</h1>
        <p className={styles.desc}>{t.notFound.desc}</p>
        <Link to="/" className={styles.cta}>
          {t.notFound.cta}
        </Link>
      </main>
      <Footer />
    </>
  )
}
