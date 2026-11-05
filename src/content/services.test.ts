import { describe, expect, it } from 'vitest'
import { paths } from '@/config/paths'
import {
  getServiceByPath,
  getServiceBySlug,
  isServiceSlug,
  serviceSlugs,
  services,
} from './services'

describe('service catalogue', () => {
  it('has unique slugs and paths that exist in config/paths', () => {
    expect(new Set(services.map((s) => s.slug)).size).toBe(services.length)
    const known = new Set<string>(Object.values(paths))
    for (const service of services) expect(known.has(service.path)).toBe(true)
  })

  it('lists every slug once for validation schemas', () => {
    expect([...serviceSlugs].sort()).toEqual(services.map((s) => s.slug).sort())
  })

  it('looks services up by slug and by path, ignoring a trailing slash', () => {
    expect(getServiceBySlug('prototyping')?.path).toBe(paths.prototyping)
    expect(getServiceByPath('/services/3d-printing/')?.slug).toBe('3d-printing')
    expect(getServiceByPath('/nope')).toBeUndefined()
  })

  it('narrows unknown values with isServiceSlug', () => {
    expect(isServiceSlug('bulk-printing')).toBe(true)
    expect(isServiceSlug('portfolio')).toBe(false)
    expect(isServiceSlug(undefined)).toBe(false)
  })

  it('provides content for every section the template renders', () => {
    for (const service of services) {
      expect(service.highlights.length).toBeGreaterThan(0)
      expect(service.offerings.items.length).toBeGreaterThan(0)
      expect(service.process.length).toBe(4)
      expect(service.faqs.length).toBeGreaterThan(0)
      expect(service.seo.description.length).toBeLessThanOrEqual(160)
    }
  })
})
