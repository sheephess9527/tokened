import { useState, type FormEvent } from 'react'
import { useI18n } from '../i18n'
import {
  buildWaitlistMailto,
  type WaitlistInterest,
} from '../lib/contact'
import { hasFormspree, submitWaitlist } from '../lib/formspree'
import styles from './WaitlistForm.module.css'

interface WaitlistFormProps {
  defaultInterest?: WaitlistInterest
}

export function WaitlistForm({ defaultInterest = 'developer' }: WaitlistFormProps) {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [interest, setInterest] = useState<WaitlistInterest>(defaultInterest)
  const [message, setMessage] = useState('')
  const [company, setCompany] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const interests: WaitlistInterest[] = ['developer', 'gateway', 'enterprise']
  const useFormspree = hasFormspree()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || submitting) return

    if (company.trim()) {
      // Honeypot field filled in — silently treat as success without submitting.
      setSubmitted(true)
      return
    }

    setSubmitting(true)
    setError(null)

    const interestLabel = t.waitlist.interests[interest]
    const subject =
      interest === 'gateway'
        ? 'Tokened Gateway Beta Application'
        : interest === 'enterprise'
          ? 'Tokened Enterprise Inquiry'
          : 'Tokened Developer Waitlist'

    try {
      if (useFormspree) {
        await submitWaitlist({
          email: email.trim(),
          interest: interestLabel,
          message: message.trim(),
          subject,
        })
        setSubmitted(true)
      } else {
        window.location.href = buildWaitlistMailto(
          email.trim(),
          interest,
          interestLabel,
          message,
        )
        setSubmitted(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.waitlist.error)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className={styles.success}>
        <span className={styles.successIcon} aria-hidden="true">
          ✓
        </span>
        <p>{useFormspree ? t.waitlist.successFormspree : t.waitlist.successMailto}</p>
        <p className={styles.successEmail}>{email}</p>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {!useFormspree && (
        <p className={styles.hint}>{t.waitlist.mailtoHint}</p>
      )}

      <label className={styles.honeypot} aria-hidden="true">
        Company
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </label>

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

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? t.waitlist.submitting : t.waitlist.submit}
      </button>
      <p className={styles.privacy}>{t.waitlist.privacy}</p>
    </form>
  )
}