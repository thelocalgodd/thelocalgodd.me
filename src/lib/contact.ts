// Contract: thelocalgodd.me-backend docs/FEATURES.md, `POST /api/contact`.
const CONTACT_URL = 'https://api.thelocalgodd.me/api/contact'

export interface ContactInput {
  name: string
  email: string
  message: string
  /** Honeypot. A person leaves it empty. */
  website: string
}

export type ContactResult =
  | { ok: true }
  | { ok: false; error: 'validation'; fields: Record<string, string[]> }
  | { ok: false; error: 'rate_limited' | 'send_failed' | 'unexpected'; status: number }

/** Rejects only when the request does not reach the API (offline, CORS, DNS). */
export async function sendContact(input: ContactInput): Promise<ContactResult> {
  const response = await fetch(CONTACT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (response.status === 202) return { ok: true }
  if (response.status === 400) {
    const body: { fields?: Record<string, string[]> } = await response.json()
    return { ok: false, error: 'validation', fields: body.fields ?? {} }
  }
  if (response.status === 429) return { ok: false, error: 'rate_limited', status: 429 }
  if (response.status === 502) return { ok: false, error: 'send_failed', status: 502 }
  return { ok: false, error: 'unexpected', status: response.status }
}
