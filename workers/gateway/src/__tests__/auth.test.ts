import { describe, expect, it } from 'vitest'
import { upstreamAuthorization } from '../index'

describe('upstreamAuthorization', () => {
  it('refuses to fall back when the client sends no key', () => {
    expect(upstreamAuthorization(null)).toBeNull()
    expect(upstreamAuthorization('')).toBeNull()
    expect(upstreamAuthorization('   ')).toBeNull()
  })

  it('forwards the client Authorization header unchanged', () => {
    expect(upstreamAuthorization('Bearer sk-user')).toBe('Bearer sk-user')
  })
})
