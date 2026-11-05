import { describe, expect, it } from 'vitest'
import { contactSchema, contactDefaults } from './schema'
import { buildContactSummary } from './summary'

const valid = {
  ...contactDefaults,
  name: 'Asha',
  email: 'asha@example.com',
  message: 'I need a prototype of a small enclosure.',
}

describe('contactSchema', () => {
  it('accepts a minimal valid enquiry', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true)
  })

  it('reports specific messages', () => {
    const result = contactSchema.safeParse({
      ...valid,
      email: 'nope',
      phone: '123',
      message: 'short',
    })
    const messages = result.success ? [] : result.error.issues.map((issue) => issue.message)
    expect(messages).toContain('Enter a valid email address')
    expect(messages).toContain('Enter a 10-digit Indian mobile number')
    expect(messages).toContain('Tell us a little more (at least 10 characters)')
  })

  it('rejects an unknown service', () => {
    expect(contactSchema.safeParse({ ...valid, service: 'laser-cutting' }).success).toBe(false)
  })
})

describe('buildContactSummary', () => {
  it('omits blank optional rows and names the service in the subject', () => {
    const summary = buildContactSummary({ ...valid, service: '3d-printing' })
    expect(summary.subject).toBe('Enquiry about 3D Printing')
    const labels = summary.sections[0]?.rows.map((row) => row.label)
    expect(labels).toEqual(['Name', 'Email', 'Interested in'])
    expect(summary.notes).toBe(valid.message)
  })

  it('uses the generic subject when no service is chosen', () => {
    expect(buildContactSummary(valid).subject).toBe('Enquiry from the Kapi Forge website')
  })
})
