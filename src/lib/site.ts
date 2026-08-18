export const SITE_URL = 'https://tokened.uk'
export const SITE_NAME = 'Tokened'
export const OG_IMAGE = `${SITE_URL}/og-image.png`

export function absoluteUrl(path = '/'): string {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
}
