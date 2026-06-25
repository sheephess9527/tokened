import { useEffect } from 'react'

export function useHashScroll() {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (!hash) return

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      })
    }

    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)
    return () => window.removeEventListener('hashchange', scrollToHash)
  }, [])
}