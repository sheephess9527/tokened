import { useState } from 'react'
import { useI18n } from '../i18n'
import { copyToClipboard } from '../lib/clipboard'
import styles from './CodeBlock.module.css'

interface CodeBlockProps {
  code: string
}

type CopyState = 'idle' | 'copied' | 'failed'

export function CodeBlock({ code }: CodeBlockProps) {
  const { t } = useI18n()
  const [copyState, setCopyState] = useState<CopyState>('idle')

  const copy = async () => {
    const ok = await copyToClipboard(code)
    setCopyState(ok ? 'copied' : 'failed')
    window.setTimeout(() => setCopyState('idle'), 2000)
  }

  const copyLabel =
    copyState === 'copied'
      ? t.common.copied
      : copyState === 'failed'
        ? t.common.copyFailed
        : t.common.copy

  return (
    <div className={styles.wrap}>
      <pre className={styles.code}>
        <code>{code}</code>
      </pre>
      <button
        type="button"
        className={`${styles.copyBtn}${copyState === 'failed' ? ` ${styles.copyBtnFailed}` : ''}`}
        onClick={copy}
      >
        {copyLabel}
      </button>
    </div>
  )
}