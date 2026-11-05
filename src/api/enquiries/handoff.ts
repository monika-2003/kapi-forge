import { siteConfig } from '@/config/site'
import { mailtoUrl, whatsappUrl } from '@/lib/contact'
import type { EnquirySummary, HandoffChannel } from './types'

type Contact = { email: string | null; phone: string | null; whatsapp: string | null }

/** Browsers and mail clients truncate or reject very long links; stay well under their limits. */
const MAX_BODY_LENGTH = 1800
const TRUNCATION_NOTE = '(continued: please add the rest of your details in your reply)'

/** Plain-text rendering of the summary, shared by email, WhatsApp and "copy details". */
export function formatEnquiryText(summary: EnquirySummary, maxLength = Infinity): string {
  const sectionText = summary.sections
    .filter((section) => section.rows.length > 0)
    .map((section) =>
      [section.title, ...section.rows.map((row) => `- ${row.label}: ${row.value}`)].join('\n'),
    )
    .join('\n\n')

  const notes = summary.notes?.trim()
  if (!notes) return sectionText

  const heading = 'Notes'
  const full = `${sectionText}\n\n${heading}\n${notes}`
  if (full.length <= maxLength) return full

  // Keep the structured details intact and shorten only the free text.
  const room = maxLength - sectionText.length - heading.length - TRUNCATION_NOTE.length - 6
  if (room < 40) return sectionText.slice(0, maxLength)
  return `${sectionText}\n\n${heading}\n${notes.slice(0, room).trimEnd()}… ${TRUNCATION_NOTE}`
}

/** `null` when the business has no confirmed email, so the UI renders nothing. */
export function buildEmailHandoff(
  summary: EnquirySummary,
  contact: Contact = siteConfig.contact,
): string | null {
  if (!contact.email) return null
  return mailtoUrl(contact.email, summary.subject, formatEnquiryText(summary, MAX_BODY_LENGTH))
}

/** `null` when the business has no confirmed WhatsApp number. */
export function buildWhatsAppHandoff(
  summary: EnquirySummary,
  contact: Contact = siteConfig.contact,
): string | null {
  if (!contact.whatsapp) return null
  const text = `${summary.subject}\n\n${formatEnquiryText(summary, MAX_BODY_LENGTH)}`
  return whatsappUrl(contact.whatsapp, text)
}

export function getHandoffChannels(contact: Contact = siteConfig.contact): HandoffChannel[] {
  const channels: HandoffChannel[] = []
  if (contact.email) channels.push('email')
  if (contact.whatsapp) channels.push('whatsapp')
  return channels
}
