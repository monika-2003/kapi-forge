/**
 * Verified business facts. The single source for name, contact and location details.
 * `null` means "not yet confirmed by the business": UI must hide the item, never invent it.
 */
export const siteConfig = {
  name: 'Kapi Forge',
  tagline: 'Ideas take shape. We make them real.',
  locale: 'en-IN',
  location: {
    city: 'Delhi',
    country: 'India',
    serviceArea: 'Pan India',
    streetAddress: null as string | null,
    postalCode: null as string | null,
  },
  contact: {
    email: null as string | null,
    phone: null as string | null,
    /** E.164 digits without "+", e.g. "9198XXXXXXXX". Used for wa.me links. */
    whatsapp: null as string | null,
  },
  social: {} as Partial<Record<'instagram' | 'linkedin' | 'youtube', string>>,
} as const
