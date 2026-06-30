import { useEffect } from 'react'
import { getAnalyticsDomain, hasAnalytics } from '../lib/analytics'

/** Loads Plausible (cookieless, privacy-friendly) only when VITE_PLAUSIBLE_DOMAIN is set */
export function Analytics() {
  useEffect(() => {
    if (!hasAnalytics()) return
    if (document.querySelector('script[data-plausible-loader]')) return

    const script = document.createElement('script')
    script.defer = true
    script.src = 'https://plausible.io/js/script.js'
    script.dataset.domain = getAnalyticsDomain()
    script.dataset.plausibleLoader = 'true'
    document.head.appendChild(script)
  }, [])

  return null
}
