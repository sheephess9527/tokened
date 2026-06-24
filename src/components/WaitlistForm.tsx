import { useState, type FormEvent } from 'react'
import { useI18n } from '../i18n'
import {
  buildWaitlistMailto,
  type WaitlistInterest,
} from '../lib/contact'
import styles from './WaitlistForm.module.css'

interface WaitlistFormProps {
  defaultInterest?: WaitlistInterest
}

export function WaitlistForm({ defaultInterest = 'developer' }: WaitlistFormProps) {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [interest, setInterest] = useState<WaitlistInterest>(defaultInterest)
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const interests: WaitlistInterest[] = ['developer', 'gateway', 'enterprise']

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    const href = buildWaitlistMailto(
      email.trim(),
      interest,
      t.waitlist.interests[interest],
      message,
    )
    window.location.href = href
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className={styles.success}>
        <span className={styles.successIcon} aria-hidden="true">
          ✓
        </span>
        <p>{t.waitlist.success}</p>
        <p className={styles.successEmail}>{email}</p>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span>{t.waitlist.email}</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
        />
      </label>

      <label className={styles.field}>
        <span>{t.waitlist.interest}</span>
        <select
          value={interest}
          onChange={(e) => setInterest(e.target.value as WaitlistInterest)}
        >
          {interests.map((key) => (
            <option key={key} value={key}>
              {t.waitlist.interests[key]}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span>{t.waitlist.message}</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t.waitlist.messagePlaceholder}
          rows={3}
        />
      </label>

      <button type="submit" className={styles.submit}>
        {t.waitlist.submit}
      </button>
      <p className={styles.privacy}>{t.waitlist.privacy}</p>
    </form>
  )
}