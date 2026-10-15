import { useI18n } from '../i18n'
import styles from './SkipLink.module.css'

export function SkipLink() {
  const { t } = useI18n()
  return (
    <a href="#main" className={styles.link}>
      {t.common.skipToContent}
    </a>
  )
}
