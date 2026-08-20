import { describe, expect, it } from 'vitest'
import { detectPii, passesLuhn } from '../pii'

describe('passesLuhn', () => {
  it('accepts real card numbers, with or without separators', () => {
    expect(passesLuhn('4111111111111111')).toBe(true)
    expect(passesLuhn('4111 1111 1111 1111')).toBe(true)
    expect(passesLuhn('5500-0000-0000-0004')).toBe(true)
  })

  it('rejects digit runs that merely look card-shaped', () => {
    expect(passesLuhn('4111111111111112')).toBe(false)
    expect(passesLuhn('1234567890123456')).toBe(false)
  })

  it('rejects runs no card network issues, even when the checksum passes', () => {
    expect(passesLuhn('90000000000000001')).toBe(false)
    expect(passesLuhn('1111111111111117')).toBe(false)
  })

  it('rejects runs outside card length', () => {
    expect(passesLuhn('411111111111')).toBe(false)
    expect(passesLuhn('41111111111111111111')).toBe(false)
  })
})

describe('detectPii', () => {
  it('finds the obvious identifiers', () => {
    expect(detectPii('write to alice@example.com')).toContain('email')
    expect(detectPii('call 13800138000')).toContain('cn_mobile')
    expect(detectPii('id 11010119900307123X')).toContain('cn_id')
    expect(detectPii('ship to SW1A 1AA')).toContain('uk_postcode')
  })

  it('flags a genuine card number', () => {
    expect(detectPii('card 4111 1111 1111 1111 exp 12/28')).toContain('credit_card')
  })

  it('does not call every long number a card', () => {
    // Regression: a bare 13-19 digit regex rejected ordinary requests when
    // PII_BLOCK was on.
    expect(detectPii('order 1234567890123456789')).not.toContain('credit_card')
    expect(detectPii('trace id 90000000000000001')).not.toContain('credit_card')
  })

  it('still finds a card later in the text, after a non-card run', () => {
    const text = 'order 1234567890123456 then card 4111111111111111'
    expect(detectPii(text)).toContain('credit_card')
  })

  it('is repeatable — a global regex must not carry lastIndex between calls', () => {
    const text = 'card 4111111111111111'
    expect(detectPii(text)).toEqual(detectPii(text))
  })

  it('returns nothing for clean text', () => {
    expect(detectPii('Summarize this document in three bullet points.')).toEqual([])
  })
})
