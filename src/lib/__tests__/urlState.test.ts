import { afterEach, describe, expect, it, vi } from 'vitest'
import { readUrlInt, readUrlParams, syncUrlParams } from '../urlState'

interface FakeWindow {
  location: { pathname: string; search: string; hash: string }
  history: { state: unknown; replaceState: ReturnType<typeof vi.fn> }
}

function stubWindow(pathname: string, search: string, hash = ''): FakeWindow {
  const fake: FakeWindow = {
    location: { pathname, search, hash },
    history: {
      state: { idx: 1 },
      replaceState: vi.fn((_state: unknown, _title: string, url: string) => {
        const [path, rest = ''] = url.split('?')
        const [query = '', nextHash = ''] = rest.split('#')
        fake.location.pathname = path
        fake.location.search = query ? `?${query}` : ''
        fake.location.hash = nextHash ? `#${nextHash}` : ''
      }),
    },
  }
  vi.stubGlobal('window', fake)
  return fake
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('readUrlParams', () => {
  it('is empty when there is no window to read', () => {
    expect([...readUrlParams().keys()]).toEqual([])
  })

  it('parses the current query string', () => {
    stubWindow('/', '?c=GBP&t=p50k_base')
    expect(readUrlParams().get('c')).toBe('GBP')
    expect(readUrlParams().get('t')).toBe('p50k_base')
  })
})

describe('readUrlInt', () => {
  it('falls back when the parameter is absent', () => {
    stubWindow('/', '')
    expect(readUrlInt('n', 10_000, 1_000_000)).toBe(10_000)
  })

  it('reads a valid integer', () => {
    stubWindow('/', '?n=250')
    expect(readUrlInt('n', 10_000, 1_000_000)).toBe(250)
  })

  it('clamps values above the maximum instead of trusting the URL', () => {
    stubWindow('/', '?n=999999999')
    expect(readUrlInt('n', 10_000, 1000)).toBe(1000)
  })

  it('falls back for junk and negative values', () => {
    stubWindow('/', '?n=abc')
    expect(readUrlInt('n', 42, 1000)).toBe(42)
    stubWindow('/', '?n=-5')
    expect(readUrlInt('n', 42, 1000)).toBe(42)
  })
})

describe('syncUrlParams', () => {
  it('writes set values and drops nulls', () => {
    const fake = stubWindow('/', '?c=GBP')
    syncUrlParams({ c: null, t: 'p50k_base' })
    expect(fake.history.replaceState).toHaveBeenCalledTimes(1)
    expect(fake.location.search).toBe('?t=p50k_base')
  })

  it('preserves the section anchor so in-page links survive a control change', () => {
    const fake = stubWindow('/', '', '#tool')
    syncUrlParams({ c: 'CNY' })
    expect(fake.history.replaceState.mock.calls[0][2]).toBe('/?c=CNY#tool')
  })

  it('leaves unrelated parameters alone', () => {
    const fake = stubWindow('/', '?utm_source=hn')
    syncUrlParams({ c: 'CNY' })
    expect(fake.location.search).toBe('?utm_source=hn&c=CNY')
  })

  it('does not touch history when nothing would change', () => {
    const fake = stubWindow('/', '?c=CNY')
    syncUrlParams({ c: 'CNY' })
    expect(fake.history.replaceState).not.toHaveBeenCalled()
  })

  it('is a no-op without a window', () => {
    expect(() => syncUrlParams({ c: 'USD' })).not.toThrow()
  })
})
