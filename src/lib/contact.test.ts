import { describe, expect, it } from 'vitest'
import { getContactLinks, mailtoUrl, whatsappUrl } from './contact'

describe('getContactLinks', () => {
  it('returns nothing when no channel is confirmed', () => {
    expect(getContactLinks({ email: null, phone: null, whatsapp: null })).toEqual([])
  })

  it('builds links only for confirmed channels', () => {
    const links = getContactLinks({
      email: 'hello@example.com',
      phone: '+91 98765 43210',
      whatsapp: null,
    })
    expect(links.map((link) => link.href)).toEqual([
      'mailto:hello@example.com',
      'tel:+919876543210',
    ])
  })
})

describe('handoff url helpers', () => {
  it('encodes spaces in mailto subjects and bodies as %20', () => {
    const url = mailtoUrl('hello@example.com', 'Quote request', 'Line one\nLine two')
    expect(url).toBe(
      'mailto:hello@example.com?subject=Quote%20request&body=Line%20one%0ALine%20two',
    )
  })

  it('strips non-digits from WhatsApp numbers', () => {
    expect(whatsappUrl('+91 98765-43210', 'Hi there')).toBe(
      'https://wa.me/919876543210?text=Hi%20there',
    )
  })
})
