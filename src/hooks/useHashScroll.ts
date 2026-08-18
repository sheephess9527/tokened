import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollBehavior } from '../lib/motion'

/**
 * Scrolls to `#section` targets, including ones reached by client-side
 * navigation from another route (where no `hashchange` event fires).
 */
export function useHashScroll() {
  const { hash, key } = useLocation()

  useEffect(() => {
    if (!hash) return

    let id: string
    try {
      id = decodeURIComponent(hash.slice(1))
    } catch {
      id = hash.slice(1)
    }

    // Two frames: the route's content must be laid out before we measure it.
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' })
      })
    })

    return () => cancelAnimationFrame(frame)
  }, [hash, key])
}
