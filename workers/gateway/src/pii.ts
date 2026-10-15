export interface PiiPattern {
  name: string
  regex: RegExp
  /** Extra check for patterns a regex alone cannot decide. */
  validate?: (match: string) => boolean
}

/**
 * Luhn checksum plus an issuer-range check.
 *
 * Luhn alone still passes roughly one in ten random digit runs, so the leading
 * digit has to be one a card network actually issues: 2 (Mastercard's 2-series,
 * Mir), 3 (Amex, Diners), 4 (Visa), 5 (Mastercard), 6 (Discover, UnionPay).
 */
export function passesLuhn(digits: string): boolean {
  const clean = digits.replace(/\D/g, '')
  if (clean.length < 13 || clean.length > 19) return false
  if (!/^[2-6]/.test(clean)) return false

  let sum = 0
  let double = false
  for (let i = clean.length - 1; i >= 0; i--) {
    let value = clean.charCodeAt(i) - 48
    if (double) {
      value *= 2
      if (value > 9) value -= 9
    }
    sum += value
    double = !double
  }
  return sum % 10 === 0
}

export const PII_PATTERNS: PiiPattern[] = [
  { name: 'email', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/ },
  { name: 'uk_ni', regex: /\b[A-Z]{2}\d{6}[A-Z]?\b/i },
  { name: 'uk_postcode', regex: /\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/i },
  { name: 'cn_id', regex: /\b\d{17}[\dXx]\b/ },
  { name: 'cn_mobile', regex: /\b1[3-9]\d{9}\b/ },
  {
    name: 'credit_card',
    // Global so every candidate run is checked, not just the first.
    regex: /\b(?:\d[ -]?){12,18}\d\b/g,
    validate: passesLuhn,
  },
]

/**
 * Names of the PII types present in `text`.
 *
 * A bare 13–19 digit regex flagged any long number — order ids, request ids,
 * concatenated timestamps — which with PII_BLOCK=true would reject perfectly
 * ordinary requests, so card numbers are confirmed with a Luhn check.
 */
export function detectPii(text: string): string[] {
  const found: string[] = []

  for (const { name, regex, validate } of PII_PATTERNS) {
    if (!validate) {
      if (regex.test(text)) found.push(name)
      continue
    }

    // Reset: `lastIndex` persists on global regexes between calls.
    regex.lastIndex = 0
    for (const match of text.matchAll(regex)) {
      if (validate(match[0])) {
        found.push(name)
        break
      }
    }
  }

  return found
}
