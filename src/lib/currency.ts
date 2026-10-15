export type Currency = 'USD' | 'GBP' | 'CNY'

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  USD: '$',
  GBP: '£',
  CNY: '¥',
}

/** Static FX rates relative to USD. ECB reference, 14 Oct 2026. */
export const FX_FROM_USD: Record<Currency, number> = {
  USD: 1,
  // EURGBP 0.8439 / EURUSD 1.1195 = 0.7538, rounded to 3 d.p.
  GBP: 0.754,
  // ECB USD/CNY 6.6927, rounded to 3 d.p.
  CNY: 6.693,
}

export function convertFromUsd(amountUsd: number, currency: Currency): number {
  return amountUsd * FX_FROM_USD[currency]
}

/** Enough precision to stay meaningful for sub-cent per-call figures. */
function fractionDigits(value: number): number {
  if (value === 0) return 2
  if (value < 0.0001) return 6
  if (value < 0.01) return 5
  if (value < 1) return 4
  return 2
}

export function formatCost(amountUsd: number, currency: Currency): string {
  const converted = convertFromUsd(amountUsd, currency)
  const digits = fractionDigits(converted)

  return `${CURRENCY_SYMBOL[currency]}${converted.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`
}