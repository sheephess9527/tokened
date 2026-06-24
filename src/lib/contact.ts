export const CONTACT_EMAIL = 'hztbc001@gmail.com'

export function mailto(subject: string, body?: string): string {
  const params = new URLSearchParams({ subject })
  if (body) params.set('body', body)
  return `mailto:${CONTACT_EMAIL}?${params.toString()}`
}

export const MAILTO_BETA = mailto('Tokened Beta Waitlist', 'Hi, I would like to join the Tokened beta waitlist.\n\n')
export const MAILTO_ENTERPRISE = mailto(
  'Tokened Enterprise Inquiry',
  'Hi, I am interested in Tokened enterprise plans.\n\n',
)
export const MAILTO_CONTACT = mailto('Tokened Contact', 'Hi,\n\n')