/**
 * Every internal URL. Import from here instead of writing path strings in components.
 * Kept dependency-free because `src/routes.ts` imports it at build time.
 */
export const paths = {
  home: '/',
  services: '/services',
  threeDPrinting: '/services/3d-printing',
  digitalPrinting: '/services/digital-printing',
  offsetPrinting: '/services/offset-printing',
  prototyping: '/prototyping',
  bulkPrinting: '/bulk-printing',
  about: '/about',
  contact: '/contact',
  getAQuote: '/get-a-quote',
} as const

export type AppPath = (typeof paths)[keyof typeof paths]

/** Quote page URL, optionally pre-selecting a service (see features/quote/hooks/useQuotePrefill). */
export function quotePath(serviceSlug?: string): string {
  return serviceSlug
    ? `${paths.getAQuote}?service=${encodeURIComponent(serviceSlug)}`
    : paths.getAQuote
}
