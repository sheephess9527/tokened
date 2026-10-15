import { useEffect, useState } from 'react'
import { useI18n } from '../i18n'
import { scrollBehavior } from '../lib/motion'
import styles from './BackToTop.module.css'

export function BackToTop() {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      className={styles.btn}
      aria-label={t.common.backToTop}
      onClick={() => window.scrollTo({ top: 0, behavior: scrollBehavior() })}
    >
      ↑
    </button>
  )
}