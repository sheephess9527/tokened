import { useState } from 'react'
import { useI18n } from '../i18n'
import styles from './CodeBlock.module.css'

interface CodeBlockProps {
  code: string
}

export function CodeBlock({ code }: CodeBlockProps) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className={styles.wrap}>
      <pre className={styles.code}>
        <code>{code}</code>
      </pre>
      <button type="button" className={styles.copyBtn} onClick={copy}>
        {copied ? t.common.copied : t.common.copy}
      </button>
    </div>
  )
}