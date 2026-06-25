import { useI18n } from '../i18n'
import {
  CONTACT_EMAIL,
  MAILTO_BETA,
  MAILTO_CONTACT,
  MAILTO_ENTERPRISE,
  MAILTO_GATEWAY,
} from '../lib/contact'
import styles from './SimpleContact.module.css'

export function SimpleContact() {
  const { t } = useI18n()

  const buttons = [
    { href: MAILTO_BETA, label: t.contact.ctaBeta, primary: true },
    { href: MAILTO_GATEWAY, label: t.contact.ctaGateway, primary: false },
    { href: MAILTO_ENTERPRISE, label: t.contact.ctaEnterprise, primary: false },
  ]

  return (
    <div className={styles.contact}>
      <a href={MAILTO_CONTACT} className={styles.email}>
        {CONTACT_EMAIL}
      </a>
      <p className={styles.hint}>{t.contact.emailHint}</p>
      <div className={styles.actions}>
        {buttons.map((btn) => (
          <a
            key={btn.label}
            href={btn.href}
            className={btn.primary ? styles.primary : styles.secondary}
          >
            {btn.label}
          </a>
        ))}
      </div>
    </div>
  )
}