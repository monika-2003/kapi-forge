/**
 * Typed access to VITE_* variables. Validated by hand rather than with Zod so that
 * every page does not pay for the Zod bundle (only form routes load it).
 */
function readUrl(name: string, value: string | undefined): string | undefined {
  if (!value) return undefined
  try {
    new URL(value)
    return value.replace(/\/+$/, '')
  } catch {
    throw new Error(`Environment variable ${name} must be an absolute URL, received "${value}"`)
  }
}

export const env = {
  siteUrl: readUrl('VITE_SITE_URL', import.meta.env.VITE_SITE_URL) ?? 'http://localhost:3000',
  /** Undefined in Release 1. Presence of this value is what enables the API gateway. */
  apiBaseUrl: readUrl('VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL),
} as const
