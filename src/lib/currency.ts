export type Currency = 'USD' | 'GBP' | 'CNY'

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  USD: '$',
  GBP: '£',
  CNY: '¥',
}

/** Static FX rates relative to USD (MVP — update manually) */
export const FX_FROM_USD: Record<Currency, number> = {
  USD: 1,
  GBP: 0.79,
  CNY: 7.25,
}

export function convertFromUsd(amountUsd: number, currency: Currency): number {
  return amountUsd * FX_FROM_USD[currency]
}

export function formatCost(amountUsd: number, currency: Currency): string {
  const converted = convertFromUsd(amountUsd, currency)
  const symbol = CURRENCY_SYMBOL[currency]

  if (converted === 0) return `${symbol}0.00`
  if (converted < 0.0001) return `${symbol}${converted.toFixed(6)}`
  if (converted < 0.01) return `${symbol}${converted.toFixed(5)}`
  if (converted < 1) return `${symbol}${converted.toFixed(4)}`
  return `${symbol}${converted.toFixed(2)}`
}