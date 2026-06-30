const DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined

export function hasAnalytics(): boolean {
  return Boolean(DOMAIN)
}

export function getAnalyticsDomain(): string | undefined {
  return DOMAIN
}
