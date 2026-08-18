import { useLocation } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { usePageMeta } from '../hooks/usePageMeta'
import { useI18n } from '../i18n'
import { LocalLink } from '../components/LocalLink'
import { getRouteMeta } from '../lib/routeMeta'
import styles from './NotFound.module.css'

export function NotFound() {
  const { t } = useI18n()
  const { pathname } = useLocation()

  usePageMeta(getRouteMeta(pathname))

  return (
    <>
      <Header />
      <main id="main" className={styles.page}>
        <p className={styles.code}>404</p>
        <h1>{t.notFound.title}</h1>
        <p className={styles.desc}>{t.notFound.desc}</p>
        <LocalLink to="/" className={styles.cta}>
          {t.notFound.cta}
        </LocalLink>
      </main>
      <Footer />
    </>
  )
}
