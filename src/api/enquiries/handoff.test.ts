import { describe, expect, it } from 'vitest'
import {
  buildEmailHandoff,
  buildWhatsAppHandoff,
  formatEnquiryText,
  getHandoffChannels,
} from './handoff'
import type { EnquirySummary } from './types'

const summary: EnquirySummary = {
  subject: 'Quote enquiry: 3D Printing',
  sections: [
    { title: 'Service', rows: [{ label: 'Service', value: '3D Printing' }] },
    { title: 'Empty', rows: [] },
    { title: 'Customer', rows: [{ label: 'Name', value: 'Asha' }] },
  ],
  notes: 'Need 20 parts & a smooth finish',
}

const full = { email: 'hello@example.com', phone: null, whatsapp: '919876543210' }
const none = { email: null, phone: null, whatsapp: null }

describe('formatEnquiryText', () => {
  it('renders sections, skips empty ones and appends notes', () => {
    const text = formatEnquiryText(summary)
    expect(text).toContain('Service\n- Service: 3D Printing')
    expect(text).toContain('Customer\n- Name: Asha')
    expect(text).not.toContain('Empty')
    expect(text.endsWith('Notes\nNeed 20 parts & a smooth finish')).toBe(true)
  })

  it('shortens only the notes when over the limit', () => {
    const long = { ...summary, notes: 'x'.repeat(5000) }
    const text = formatEnquiryText(long, 600)
    expect(text.length).toBeLessThanOrEqual(600)
    expect(text).toContain('- Name: Asha')
    expect(text).toContain('continued')
  })
})

describe('handoff links', () => {
  it('builds an encoded mailto link', () => {
    const url = buildEmailHandoff(summary, full)
    expect(
      url?.startsWith('mailto:hello@example.com?subject=Quote%20enquiry%3A%203D%20Printing'),
    ).toBe(true)
    expect(url).toContain('%26')
    expect(url).not.toContain('+')
  })

  it('builds a wa.me link with digits only', () => {
    const url = buildWhatsAppHandoff(summary, full)
    expect(url?.startsWith('https://wa.me/919876543210?text=')).toBe(true)
  })

  it('returns null for unconfigured channels', () => {
    expect(buildEmailHandoff(summary, none)).toBeNull()
    expect(buildWhatsAppHandoff(summary, none)).toBeNull()
    expect(getHandoffChannels(none)).toEqual([])
    expect(getHandoffChannels(full)).toEqual(['email', 'whatsapp'])
  })

  it('keeps links bounded for long notes', () => {
    const url = buildWhatsAppHandoff({ ...summary, notes: 'y'.repeat(20000) }, full)
    expect(decodeURIComponent(url ?? '').length).toBeLessThan(2100)
  })
})
