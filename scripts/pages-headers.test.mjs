import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'

it('allows the Cloudflare Web Analytics script and collector on all Pages routes', () => {
  const headers = readFileSync(new URL('../public/_headers', import.meta.url), 'utf8')
  const [, defaults] = headers.split(/^\/\*\r?$/m)
  const [, policy] = defaults?.match(/^ +Content-Security-Policy: (.+)$/m) ?? []
  expect(policy).toBeDefined()

  const directives = new Map(
    policy.split(';').map((directive) => {
      const [name, ...sources] = directive.trim().split(/\s+/)
      return [name, sources]
    }),
  )

  expect(directives.get('script-src')).toEqual(["'self'", 'https://static.cloudflareinsights.com'])
  expect(directives.get('connect-src')).toEqual(["'self'", 'https://cloudflareinsights.com'])
})
