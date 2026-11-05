import type { MetaDescriptor } from 'react-router'
import { env } from '@/config/env'
import { siteConfig } from '@/config/site'

type PageMeta = {
  /** Page-specific title. Omit on the homepage to use the brand title. */
  title?: string
  description: string
  /** Internal path, e.g. paths.about. Used for canonical and og:url. */
  path: string
  /** Absolute URL or root-relative path to a 1200x630 image. */
  image?: string
  noIndex?: boolean
}

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl
  return `${env.siteUrl}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`
}

/** schema.org Organization built only from verified (non-null) `siteConfig` fields. */
export function organizationJsonLd(): Record<string, unknown> {
  const { location, contact, social } = siteConfig
  const address = {
    '@type': 'PostalAddress',
    addressLocality: location.city,
    addressCountry: 'IN',
    ...(location.streetAddress && { streetAddress: location.streetAddress }),
    ...(location.postalCode && { postalCode: location.postalCode }),
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    slogan: siteConfig.tagline,
    url: env.siteUrl,
    address,
    areaServed: { '@type': 'Country', name: location.country },
    ...(contact.email && { email: contact.email }),
    ...(contact.phone && { telephone: contact.phone }),
    ...(Object.values(social).length > 0 && { sameAs: Object.values(social) }),
  }
}

/** Builds the full meta set for a route module's `meta` export. */
export function buildMeta({
  title,
  description,
  path,
  image,
  noIndex,
}: PageMeta): MetaDescriptor[] {
  const fullTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} | ${siteConfig.tagline}`
  const url = absoluteUrl(path)

  const meta: MetaDescriptor[] = [
    { title: fullTitle },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: url },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: siteConfig.name },
    { property: 'og:locale', content: siteConfig.locale.replace('-', '_') },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' },
  ]

  if (image) meta.push({ property: 'og:image', content: absoluteUrl(image) })
  if (noIndex) meta.push({ name: 'robots', content: 'noindex' })

  return meta
}
