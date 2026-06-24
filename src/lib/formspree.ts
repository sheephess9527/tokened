const ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined

export function hasFormspree(): boolean {
  return Boolean(ENDPOINT?.startsWith('https://'))
}

export interface WaitlistPayload {
  email: string
  interest: string
  message: string
  subject: string
}

export async function submitWaitlist(payload: WaitlistPayload): Promise<void> {
  if (!hasFormspree()) {
    throw new Error('Formspree endpoint not configured')
  }

  const response = await fetch(ENDPOINT!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      email: payload.email,
      interest: payload.interest,
      message: payload.message || '(none)',
      _subject: payload.subject,
    }),
  })

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null
    throw new Error(data?.error ?? `Submission failed (${response.status})`)
  }
}