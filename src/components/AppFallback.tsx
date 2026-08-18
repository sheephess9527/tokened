import { useI18n } from '../i18n'
import styles from './AppFallback.module.css'

export function RouteLoading() {
  const { t } = useI18n()
  return (
    <div className={styles.spinner} role="status" aria-live="polite">
      {t.common.loading}
    </div>
  )
}

interface RouteErrorProps {
  onRetry: () => void
}

export function RouteError({ onRetry }: RouteErrorProps) {
  const { t } = useI18n()
  return (
    <div className={styles.wrap} role="alert">
      <h1 className={styles.title}>{t.common.errorTitle}</h1>
      <p className={styles.body}>{t.common.errorBody}</p>
      <button
        type="button"
        className={styles.action}
        onClick={() => {
          onRetry()
          window.location.reload()
        }}
      >
        {t.common.errorRetry}
      </button>
    </div>
  )
}
