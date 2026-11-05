import { siteConfig } from '@/config/site'

type Contact = { email: string | null; phone: string | null; whatsapp: string | null }

export type ContactLink = {
  kind: 'email' | 'phone' | 'whatsapp'
  label: string
  value: string
  href: string
}

export function mailtoUrl(email: string, subject: string, body?: string): string {
  const query = new URLSearchParams({ subject })
  if (body) query.set('body', body)
  // URLSearchParams encodes spaces as "+", which mail clients show literally.
  return `mailto:${email}?${query.toString().replace(/\+/g, '%20')}`
}

export function whatsappUrl(number: string, text?: string): string {
  const digits = number.replace(/\D/g, '')
  return text
    ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${digits}`
}

/** Only channels that the business has confirmed (non-null) are returned. */
export function getContactLinks(contact: Contact = siteConfig.contact): ContactLink[] {
  const links: ContactLink[] = []
  if (contact.email) {
    links.push({
      kind: 'email',
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
    })
  }
  if (contact.phone) {
    links.push({
      kind: 'phone',
      label: 'Phone',
      value: contact.phone,
      href: `tel:${contact.phone.replace(/[^\d+]/g, '')}`,
    })
  }
  if (contact.whatsapp) {
    links.push({
      kind: 'whatsapp',
      label: 'WhatsApp',
      value: `+${contact.whatsapp.replace(/\D/g, '')}`,
      href: whatsappUrl(contact.whatsapp),
    })
  }
  return links
}
