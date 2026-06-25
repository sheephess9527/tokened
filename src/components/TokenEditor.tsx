import { useMemo, useState } from 'react'
import { useI18n } from '../i18n'
import { useAnimatedNumber } from '../hooks/useAnimatedNumber'
import { useTokenAnalysis } from '../hooks/useTokenAnalysis'
import type { Currency } from '../lib/currency'
import {
  chineseInflationRate,
  estimateCosts,
  findBestValue,
} from '../lib/pricing'
import { hasChinese, type TokenizerId } from '../lib/tokenizer'
import { CostChart } from './CostChart'
import { TokenHighlight } from './TokenHighlight'
import styles from './TokenEditor.module.css'

const TOKENIZER_OPTIONS: TokenizerId[] = [
  'cl100k_base',
  'o200k_base',
  'p50k_base',
  'chinese_estimate',
]

const CURRENCY_OPTIONS: Currency[] = ['USD', 'GBP', 'CNY']

const SAMPLE_PROMPT =
  'You are a helpful assistant. 请用简洁的中文总结以下技术文档，并估算 API 调用成本。'

export function TokenEditor() {
  const { t } = useI18n()
  const [prompt, setPrompt] = useState(SAMPLE_PROMPT)
  const [tokenizer, setTokenizer] = useState<TokenizerId>('cl100k_base')
  const [currency, setCurrency] = useState<Currency>('USD')
  const [showBlocks, setShowBlocks] = useState(true)

  const { tokenCount, openAiBaseline, chineseEfficient, spans, loading } =
    useTokenAnalysis(prompt, tokenizer, showBlocks)

  const animatedTokens = useAnimatedNumber(tokenCount)

  const costs = useMemo(
    () => estimateCosts(openAiBaseline, currency),
    [openAiBaseline, currency],
  )
  const best = findBestValue(costs)
  const inflation = chineseInflationRate(openAiBaseline, chineseEfficient)
  const showInflation = hasChinese(prompt) && inflation !== null && inflation > 0

  const scrollToTool = () => {
    document.getElementById('prompt-input')?.focus()
    document.getElementById('tool')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className={styles.section} id="tool">
      <div className={styles.hero}>
        <h1>{t.hero.title}</h1>
        <p className={styles.subtitle}>{t.hero.subtitle}</p>
        <p className={styles.tagline}>{t.hero.tagline}</p>

        <div className={styles.ctas}>
          <button type="button" className={styles.ctaPrimary} onClick={scrollToTool}>
            {t.hero.ctaTry}
          </button>
          <a href="#waitlist" className={styles.ctaSecondary}>
            {t.hero.ctaBeta}
          </a>
          <a href="#waitlist" className={styles.ctaGhost}>
            {t.hero.ctaEnterprise}
          </a>
        </div>
      </div>

      <div className={styles.editor}>
        <div className={styles.pane}>
          <div className={styles.paneHeader}>
            <label htmlFor="prompt-input">{t.editor.inputLabel}</label>
            <div className={styles.paneActions}>
              <button
                type="button"
                className={styles.btnAction}
                onClick={() => setPrompt('')}
              >
                {t.editor.clear}
              </button>
              <button
                type="button"
                className={styles.btnAction}
                onClick={() => setPrompt(SAMPLE_PROMPT)}
              >
                {t.editor.loadSample}
              </button>
              <select
                value={tokenizer}
                onChange={(e) => setTokenizer(e.target.value as TokenizerId)}
                aria-label={t.editor.tokenizer}
              >
                {TOKENIZER_OPTIONS.map((id) => (
                  <option key={id} value={id}>
                    {t.editor.tokenizers[id]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <textarea
            id="prompt-input"
            className={styles.textarea}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t.editor.inputPlaceholder}
            spellCheck={false}
          />
        </div>

        <div className={styles.pane}>
          <div className={styles.paneHeader}>
            <span>{t.editor.analysisLabel}</span>
            <div className={styles.controls}>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                aria-label={t.editor.currency}
              >
                {CURRENCY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {t.editor.currencies[c]}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className={styles.btnToggle}
                onClick={() => setShowBlocks((v) => !v)}
              >
                {showBlocks ? t.editor.hideBlocks : t.editor.showBlocks}
              </button>
            </div>
          </div>

          {loading && prompt ? (
            <p className={styles.loading}>{t.editor.loading}</p>
          ) : !prompt ? (
            <p className={styles.empty}>{t.editor.empty}</p>
          ) : (
            <>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>{t.editor.totalTokens}</span>
                  <span className={styles.statValue}>{animatedTokens}</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>{t.editor.chars}</span>
                  <span className={styles.statValue}>{prompt.length}</span>
                </div>
              </div>

              {showInflation && (
                <div className={styles.inflation}>
                  <div className={styles.inflationHeader}>
                    <span>{t.editor.chineseInflation}</span>
                    <span className={styles.inflationValue}>−{inflation}%</span>
                  </div>
                  <div className={styles.inflationBar}>
                    <div
                      className={styles.inflationFill}
                      style={{ width: `${Math.min(inflation, 100)}%` }}
                    />
                  </div>
                  <p className={styles.inflationHint}>
                    {t.editor.chineseInflationHint} ({openAiBaseline} → {chineseEfficient}{' '}
                    {t.editor.inflationVsOpenAI})
                  </p>
                </div>
              )}

              <CostChart estimates={costs} label={t.editor.costChart} />

              {showBlocks && (
                <div className={styles.highlightBox}>
                  <TokenHighlight spans={spans} />
                </div>
              )}

              <div className={styles.costSection}>
                <h3>{t.editor.estCost}</h3>
                <ul className={styles.costList}>
                  {costs.map((est) => {
                    const isBest = best?.model.id === est.model.id
                    return (
                      <li
                        key={est.model.id}
                        className={isBest ? styles.costItemBest : styles.costItem}
                      >
                        <div className={styles.costName}>
                          <span>{est.model.name}</span>
                          <span className={styles.provider}>{est.model.provider}</span>
                        </div>
                        <div className={styles.costRight}>
                          <span className={styles.costTokens}>{est.tokens} tok</span>
                          <span className={styles.costPrice}>{est.formatted}</span>
                          {isBest && (
                            <span className={styles.bestBadge}>{t.editor.bestValue}</span>
                          )}
                          <span
                            className={
                              est.model.accuracy === 'exact'
                                ? styles.accuracyExact
                                : styles.accuracyEst
                            }
                          >
                            {t.editor.accuracy[est.model.accuracy]}
                          </span>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}