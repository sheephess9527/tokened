export const CONTACT_EMAIL = 'hello@tokened.uk'

export type WaitlistInterest = 'developer' | 'gateway' | 'enterprise'

export function mailto(subject: string, body?: string): string {
  const params = new URLSearchParams({ subject })
  if (body) params.set('body', body)
  return `mailto:${CONTACT_EMAIL}?${params.toString()}`
}

export function buildWaitlistMailto(
  email: string,
  interest: WaitlistInterest,
  interestLabel: string,
  message?: string,
): string {
  const body = [
    'Tokened Waitlist Application',
    '',
    `Email: ${email}`,
    `Interest: ${interestLabel}`,
    '',
    message?.trim() || '(no additional message)',
  ].join('\n')

  const subject =
    interest === 'gateway'
      ? 'Tokened Gateway Beta Application'
      : interest === 'enterprise'
        ? 'Tokened Enterprise Inquiry'
        : 'Tokened Developer Waitlist'

  return mailto(subject, body)
}

export const MAILTO_BETA = mailto(
  'Tokened Beta Waitlist',
  'Hi, I would like to join the Tokened beta waitlist.\n\n',
)
export const MAILTO_GATEWAY = mailto(
  'Tokened Gateway Beta Application',
  'Hi, I would like to apply for the Tokened Gateway beta.\n\nMy use case:\n',
)
export const MAILTO_ENTERPRISE = mailto(
  'Tokened Enterprise Inquiry',
  'Hi, I am interested in Tokened enterprise plans.\n\n',
)
export const MAILTO_CONTACT = mailto('Tokened Contact', 'Hi,\n\n')