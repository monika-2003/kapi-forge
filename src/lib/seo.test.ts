import { describe, expect, it } from 'vitest'
import { absoluteUrl, buildMeta, organizationJsonLd } from './seo'

describe('organizationJsonLd', () => {
  it('contains verified facts and omits unconfirmed contact details', () => {
    const data = organizationJsonLd()
    expect(data).toMatchObject({ '@type': 'Organization', name: 'Kapi Forge' })
    expect(data).not.toHaveProperty('email')
    expect(data).not.toHaveProperty('telephone')
    expect(data.address).toMatchObject({ addressLocality: 'Delhi', addressCountry: 'IN' })
  })
})

describe('buildMeta', () => {
  it('uses the brand title on the homepage and suffixes page titles', () => {
    expect(buildMeta({ description: 'd', path: '/' })[0]).toEqual({
      title: 'Kapi Forge | Ideas take shape. We make them real.',
    })
    expect(buildMeta({ title: 'About', description: 'd', path: '/about' })[0]).toEqual({
      title: 'About | Kapi Forge',
    })
  })

  it('emits an absolute canonical URL and noindex only when requested', () => {
    const meta = buildMeta({ description: 'd', path: '/contact' })
    expect(meta).toContainEqual({
      tagName: 'link',
      rel: 'canonical',
      href: absoluteUrl('/contact'),
    })
    expect(meta).not.toContainEqual({ name: 'robots', content: 'noindex' })
  })
})
