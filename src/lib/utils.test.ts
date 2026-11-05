import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('keeps custom font sizes alongside text colours', () => {
    expect(cn('text-h1', 'text-brand-strong')).toBe('text-h1 text-brand-strong')
  })

  it('resolves conflicts between custom and default tokens', () => {
    expect(cn('text-sm', 'text-h4')).toBe('text-h4')
    expect(cn('py-section', 'py-4')).toBe('py-4')
    expect(cn('max-w-site', 'max-w-narrow')).toBe('max-w-narrow')
    expect(cn('shadow-card', 'shadow-raised')).toBe('shadow-raised')
  })
})
