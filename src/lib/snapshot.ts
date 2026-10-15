import type { Language } from '../i18n'

/**
 * Both figures are hand-maintained snapshots, so the UI states when they were
 * taken rather than implying a live feed. Update these whenever the numbers in
 * `pricing.ts` / `currency.ts` change.
 */
export const PRICING_SNAPSHOT = '2026-06'
export const FX_SNAPSHOT = '2026-06'

const MONTHS_EN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

/** `2026-06` → `Jun 2026` / `2026 年 6 月`. */
export function formatSnapshot(snapshot: string, lang: Language): string {
  const [year, month] = snapshot.split('-')
  const index = Number(month) - 1
  if (!year || Number.isNaN(index) || index < 0 || index > 11) return snapshot

  return lang === 'zh' ? `${year} 年 ${index + 1} 月` : `${MONTHS_EN[index]} ${year}`
}
