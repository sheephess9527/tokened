import { describe, expect, it } from 'vitest'
import { absoluteUrl, SITE_URL } from '../site'

describe('absoluteUrl', () => {
  it('maps the root to a bare trailing slash', () => {
    expect(absoluteUrl('/')).toBe(`${SITE_URL}/`)
    expect(absoluteUrl()).toBe(`${SITE_URL}/`)
    expect(absoluteUrl('')).toBe(`${SITE_URL}/`)
  })

  it('declares the trailing-slash URL the host actually serves', () => {
    // Each route is prerendered as <path>/index.html, which Cloudflare Pages
    // serves at <path>/ and 308-redirects <path> to. Declaring the redirecting
    // form would get the hreflang annotations ignored.
    expect(absoluteUrl('/zh')).toBe(`${SITE_URL}/zh/`)
    expect(absoluteUrl('/blog')).toBe(`${SITE_URL}/blog/`)
    expect(absoluteUrl('/blog/chinese-token-cost')).toBe(
      `${SITE_URL}/blog/chinese-token-cost/`,
    )
    expect(absoluteUrl('/zh/blog/chinese-token-cost')).toBe(
      `${SITE_URL}/zh/blog/chinese-token-cost/`,
    )
  })

  it('is idempotent on a path that already ends in a slash', () => {
    expect(absoluteUrl('/zh/')).toBe(`${SITE_URL}/zh/`)
    expect(absoluteUrl(absoluteUrl('/zh').replace(SITE_URL, ''))).toBe(`${SITE_URL}/zh/`)
  })

  it('leaves file paths alone — they are served as files, not directories', () => {
    expect(absoluteUrl('/404.html')).toBe(`${SITE_URL}/404.html`)
    expect(absoluteUrl('/feed.xml')).toBe(`${SITE_URL}/feed.xml`)
    expect(absoluteUrl('/zh/feed.xml')).toBe(`${SITE_URL}/zh/feed.xml`)
    expect(absoluteUrl('/og-image.png')).toBe(`${SITE_URL}/og-image.png`)
  })
})
