import { describe, expect, it } from 'vitest'
import {
  languageFromPath,
  localizePath,
  stripLanguage,
} from '../../i18n/paths'

describe('languageFromPath', () => {
  it('reads Chinese off the /zh prefix', () => {
    expect(languageFromPath('/zh')).toBe('zh')
    expect(languageFromPath('/zh/blog')).toBe('zh')
    expect(languageFromPath('/zh/blog/chinese-token-cost')).toBe('zh')
  })

  it('defaults to English everywhere else', () => {
    expect(languageFromPath('/')).toBe('en')
    expect(languageFromPath('/blog')).toBe('en')
    expect(languageFromPath('/zhuangbi')).toBe('en')
  })
})

describe('stripLanguage', () => {
  it('removes the prefix', () => {
    expect(stripLanguage('/zh')).toBe('/')
    expect(stripLanguage('/zh/blog')).toBe('/blog')
    expect(stripLanguage('/zh/blog/x')).toBe('/blog/x')
  })

  it('leaves English paths untouched', () => {
    expect(stripLanguage('/')).toBe('/')
    expect(stripLanguage('/blog')).toBe('/blog')
    expect(stripLanguage('/zhuangbi')).toBe('/zhuangbi')
  })
})

describe('localizePath', () => {
  it('prefixes Chinese and leaves English bare', () => {
    expect(localizePath('/', 'zh')).toBe('/zh')
    expect(localizePath('/', 'en')).toBe('/')
    expect(localizePath('/blog', 'zh')).toBe('/zh/blog')
    expect(localizePath('/blog', 'en')).toBe('/blog')
  })

  it('keeps in-page anchors on the reader own language', () => {
    expect(localizePath('/#tool', 'zh')).toBe('/zh#tool')
    expect(localizePath('/#tool', 'en')).toBe('/#tool')
    expect(localizePath('/blog#top', 'zh')).toBe('/zh/blog#top')
  })

  it('is idempotent, so an already-localized path is not double-prefixed', () => {
    expect(localizePath('/zh/blog', 'zh')).toBe('/zh/blog')
    expect(localizePath(localizePath('/blog', 'zh'), 'zh')).toBe('/zh/blog')
  })

  it('round-trips between languages', () => {
    expect(localizePath('/zh/blog/x', 'en')).toBe('/blog/x')
    expect(localizePath('/blog/x', 'zh')).toBe('/zh/blog/x')
  })
})
