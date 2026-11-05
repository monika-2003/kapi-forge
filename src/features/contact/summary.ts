import type { EnquirySummary } from '@/api/enquiries/types'
import { getServiceBySlug } from '@/content/services'
import { NOT_SURE, type ContactValues } from './schema'

function serviceLabel(value: ContactValues['service']): string | null {
  if (value === '') return null
  if (value === NOT_SURE) return 'Not sure yet'
  return getServiceBySlug(value)?.name ?? null
}

export function buildContactSummary(values: ContactValues): EnquirySummary {
  const service = serviceLabel(values.service)
  const rows = [
    { label: 'Name', value: values.name },
    { label: 'Email', value: values.email },
    ...(values.phone ? [{ label: 'Phone', value: values.phone }] : []),
    ...(service ? [{ label: 'Interested in', value: service }] : []),
  ]

  return {
    subject:
      service && values.service !== NOT_SURE
        ? `Enquiry about ${service}`
        : 'Enquiry from the Kapi Forge website',
    sections: [{ title: 'Contact details', rows }],
    notes: values.message,
  }
}
