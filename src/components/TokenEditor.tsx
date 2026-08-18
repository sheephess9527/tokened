import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '../i18n'
import { useAnimatedNumber } from '../hooks/useAnimatedNumber'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useTokenAnalysis } from '../hooks/useTokenAnalysis'
import { formatCost, type Currency } from '../lib/currency'
import {
  chineseInflationRate,
  estimateCosts,
  findBestValue,
  type CostEstimate,
  type ModelPricing,
} from '../lib/pricing'
import { MAILTO_ENTERPRISE } from '../lib/contact'
import { copyToClipboard } from '../lib/clipboard'
import { scrollBehavior } from '../lib/motion'
import {
  formatSnapshot,
  FX_SNAPSHOT,
  PRICING_SNAPSHOT,
} from '../lib/snapshot'
import { clearSavedPrompt, loadSavedPrompt, savePrompt } from '../lib/promptStorage'
import { readUrlInt, readUrlParams, syncUrlParams } from '../lib/urlState'
import { hasChinese, isOpenAiEncoding, type TokenizerId } from '../lib/tokenizer'
import { CostChart } from './CostChart'
import { TokenHighlight } from './TokenHighlight'
import styles from './TokenEditor.module.css'

const TOKENIZER_OPTIONS: TokenizerId[] = [
  'o200k_base',
  'cl100k_base',
  'p50k_base',
  'chinese_estimate',
]

const CURRENCY_OPTIONS: Currency[] = ['USD', 'GBP', 'CNY']
const MOBILE_COST_PREVIEW = 3
const MOBILE_BREAKPOINT = '(max-width: 900px)'

const DEFAULT_OUTPUT_TOKENS = 0
const DEFAULT_MONTHLY_CALLS = 10_000
const MAX_OUTPUT_TOKENS = 1_000_000
const MAX_MONTHLY_CALLS = 100_000_000

function displayAccuracy(
  model: ModelPricing,
  tokenizer: TokenizerId,
): 'exact' | 'estimate' {
  if (!isOpenAiEncoding(tokenizer)) return 'estimate'
  return model.provider === 'OpenAI' && model.accuracy === 'exact' ? 'exact' : 'estimate'
}

function initialTokenizer(): TokenizerId {
  const raw = readUrlParams().get('t') as TokenizerId | null
  return raw && TOKENIZER_OPTIONS.includes(raw) ? raw : 'o200k_base'
}

function initialCurrency(): Currency {
  const raw = readUrlParams().get('c') as Currency | null
  return raw && CURRENCY_OPTIONS.includes(raw) ? raw : 'USD'
}

function clampInt(value: string, max: number): number {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 0) return 0
  return Math.min(parsed, max)
}

export function TokenEditor() {
  const { lang, t } = useI18n()
  const [prompt, setPrompt] = useState(() => {
    const saved = loadSavedPrompt()
    return saved ?? t.editor.samplePrompt
  })
  const [usingSample, setUsingSample] = useState(() => loadSavedPrompt() === null)
  const [tokenizer, setTokenizer] = useState<TokenizerId>(initialTokenizer)
  const [currency, setCurrency] = useState<Currency>(initialCurrency)
  const [outputTokens, setOutputTokens] = useState(() =>
    readUrlInt('o', DEFAULT_OUTPUT_TOKENS, MAX_OUTPUT_TOKENS),
  )
  const [monthlyCalls, setMonthlyCalls] = useState(() =>
    readUrlInt('n', DEFAULT_MONTHLY_CALLS, MAX_MONTHLY_CALLS),
  )
  const [showBlocks, setShowBlocks] = useState(true)
  const [costListExpanded, setCostListExpanded] = useState(false)
  const [copied, setCopied] = useState<'summary' | 'link' | null>(null)
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT)

  useEffect(() => {
    if (usingSample) setPrompt(t.editor.samplePrompt)
  }, [t.editor.samplePrompt, usingSample])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (usingSample) {
        clearSavedPrompt()
      } else {
        savePrompt(prompt)
      }
    }, 300)
    return () => window.clearTimeout(timer)
  }, [prompt, usingSample])

  // Keep the shareable link in step with the controls.
  useEffect(() => {
    syncUrlParams({
      t: tokenizer === 'o200k_base' ? null : tokenizer,
      c: currency === 'USD' ? null : currency,
      o: outputTokens === DEFAULT_OUTPUT_TOKENS ? null : String(outputTokens),
      n: monthlyCalls === DEFAULT_MONTHLY_CALLS ? null : String(monthlyCalls),
    })
  }, [tokenizer, currency, outputTokens, monthlyCalls])

  const {
    tokenCount,
    openAiBaseline,
    pricingBaseline,
    chineseEfficient,
    charCount,
    spans,
    spansTruncated,
    loading,
    stale,
  } = useTokenAnalysis(prompt, tokenizer, showBlocks)

  const animatedTokens = useAnimatedNumber(tokenCount)

  const costs = useMemo(
    () => estimateCosts(pricingBaseline, currency, outputTokens),
    [pricingBaseline, currency, outputTokens],
  )
  const best = findBestValue(costs)
  const inflation = chineseInflationRate(openAiBaseline, chineseEfficient)
  const showInflation = hasChinese(prompt) && inflation !== null && inflation > 0
  const showCostToggle = isMobile && costs.length > MOBILE_COST_PREVIEW
  const visibleCosts =
    showCostToggle && !costListExpanded ? costs.slice(0, MOBILE_COST_PREVIEW) : costs
  const monthlyFor = (estimate: CostEstimate) =>
    formatCost(estimate.costUsd * monthlyCalls, currency)
  const disclaimer = t.editor.costDisclaimer
    .replace('{pricing}', formatSnapshot(PRICING_SNAPSHOT, lang))
    .replace('{fx}', formatSnapshot(FX_SNAPSHOT, lang))

  const flashCopied = (kind: 'summary' | 'link') => {
    setCopied(kind)
    window.setTimeout(() => setCopied(null), 2000)
  }

  const copySummary = async () => {
    const lines = [
      `${t.editor.analysisLabel} — tokened.uk`,
      `${t.editor.tokenizer}: ${t.editor.tokenizers[tokenizer]}`,
      `${t.editor.totalTokens}: ${tokenCount} · ${t.editor.chars}: ${charCount}`,
      `${t.editor.outputTokens}: ${outputTokens} · ${t.editor.monthlyCalls}: ${monthlyCalls}`,
      '',
      ...costs.map(
        (estimate) =>
          `${estimate.model.name} (${estimate.model.provider}): ${estimate.formatted} ${t.editor.perCall} · ${monthlyFor(estimate)} ${t.editor.perMonth}`,
      ),
      '',
      disclaimer,
      window.location.href,
    ]

    if (await copyToClipboard(lines.join('\n'))) flashCopied('summary')
  }

  const copyLink = async () => {
    if (await copyToClipboard(window.location.href)) flashCopied('link')
  }

  const scrollToTool = () => {
    document.getElementById('prompt-input')?.focus()
    document
      .getElementById('tool')
      ?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' })
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
          <a href={MAILTO_ENTERPRISE} className={styles.ctaGhost}>
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
                onClick={() => {
                  setPrompt('')
                  setUsingSample(false)
                  clearSavedPrompt()
                }}
              >
                {t.editor.clear}
              </button>
              <button
                type="button"
                className={styles.btnAction}
                onClick={() => {
                  setPrompt(t.editor.samplePrompt)
                  setUsingSample(true)
                  clearSavedPrompt()
                }}
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
            onChange={(e) => {
              setPrompt(e.target.value)
              setUsingSample(false)
            }}
            placeholder={t.editor.inputPlaceholder}
            spellCheck={false}
          />

          <fieldset className={styles.assumptions}>
            <legend>{t.editor.assumptions}</legend>
            <div className={styles.assumptionRow}>
              <label htmlFor="output-tokens">{t.editor.outputTokens}</label>
              <input
                id="output-tokens"
                type="number"
                inputMode="numeric"
                min={0}
                max={MAX_OUTPUT_TOKENS}
                step={50}
                value={outputTokens}
                onChange={(e) =>
                  setOutputTokens(clampInt(e.target.value, MAX_OUTPUT_TOKENS))
                }
              />
            </div>
            <div className={styles.assumptionRow}>
              <label htmlFor="monthly-calls">{t.editor.monthlyCalls}</label>
              <input
                id="monthly-calls"
                type="number"
                inputMode="numeric"
                min={0}
                max={MAX_MONTHLY_CALLS}
                step={1000}
                value={monthlyCalls}
                onChange={(e) =>
                  setMonthlyCalls(clampInt(e.target.value, MAX_MONTHLY_CALLS))
                }
              />
            </div>
            <p className={styles.assumptionHint}>{t.editor.outputTokensHint}</p>
          </fieldset>
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
                aria-pressed={showBlocks}
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
              <div
                className={stale ? `${styles.stats} ${styles.statsStale}` : styles.stats}
                role="status"
                aria-live="polite"
              >
                <div className={styles.stat}>
                  <span className={styles.statLabel}>{t.editor.totalTokens}</span>
                  <span className={styles.statValue}>{animatedTokens}</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>{t.editor.chars}</span>
                  <span className={styles.statValue}>{charCount}</span>
                </div>
                {stale && <span className={styles.updating}>{t.editor.updating}</span>}
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
                <>
                  <div className={styles.highlightBox}>
                    <TokenHighlight spans={spans} />
                  </div>
                  {spansTruncated && (
                    <p className={styles.truncated}>
                      {t.editor.spansTruncated
                        .replace('{n}', String(spans.length))
                        .replace('{total}', String(tokenCount))}
                    </p>
                  )}
                </>
              )}

              <div className={styles.costSection}>
                <div className={styles.costHeader}>
                  <h3>{t.editor.estCost}</h3>
                  <div className={styles.costActions}>
                    <button type="button" className={styles.btnAction} onClick={copySummary}>
                      {copied === 'summary' ? t.common.copied : t.editor.copySummary}
                    </button>
                    <button type="button" className={styles.btnAction} onClick={copyLink}>
                      {copied === 'link' ? t.editor.linkCopied : t.editor.shareLink}
                    </button>
                  </div>
                </div>
                <p className={styles.costDisclaimer}>{disclaimer}</p>

                {best && monthlyCalls > 0 && (
                  <p className={styles.monthlyTotal}>
                    {t.editor.monthlyTotal}:{' '}
                    <strong>{monthlyFor(best)}</strong>{' '}
                    <span className={styles.monthlyMeta}>
                      ({best.model.name} · {monthlyCalls.toLocaleString('en-US')}{' '}
                      {t.editor.monthlyCalls.toLowerCase()})
                    </span>
                  </p>
                )}

                <ul className={styles.costList}>
                  {visibleCosts.map((est) => {
                    const isBest = best?.model.id === est.model.id
                    const accuracy = displayAccuracy(est.model, tokenizer)
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
                          <span className={styles.costTokens}>
                            {est.tokens.toLocaleString('en-US')} tok
                            {est.outputTokens > 0 &&
                              ` + ${est.outputTokens.toLocaleString('en-US')} out`}
                          </span>
                          <span className={styles.costPriceGroup}>
                            <span className={styles.costPrice}>{est.formatted}</span>
                            {monthlyCalls > 0 && (
                              <span className={styles.costMonthly}>
                                {monthlyFor(est)} / mo
                              </span>
                            )}
                          </span>
                          {isBest && (
                            <span className={styles.bestBadge}>{t.editor.bestValue}</span>
                          )}
                          <span
                            className={
                              accuracy === 'exact'
                                ? styles.accuracyExact
                                : styles.accuracyEst
                            }
                          >
                            {t.editor.accuracy[accuracy]}
                          </span>
                        </div>
                      </li>
                    )
                  })}
                </ul>
                {showCostToggle && (
                  <button
                    type="button"
                    className={styles.costToggle}
                    onClick={() => setCostListExpanded((v) => !v)}
                    aria-expanded={costListExpanded}
                  >
                    {costListExpanded ? t.editor.showFewerModels : t.editor.showAllModels}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
