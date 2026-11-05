import type { EnquirySummary, SummaryRow, SummarySection } from '@/api/enquiries/types'
import { getServiceBySlug } from '@/content/services'
import { formatFileSize } from '@/lib/format'
import type { QuoteFormValues } from './schema'
import { serviceSpecs } from './specs'
import type { FieldDefinition } from './specs/types'

function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null
}

/** Resolves a stored form value to the wording the customer saw. Returns null when nothing was entered. */
export function formatFieldValue(field: FieldDefinition, value: unknown): string | null {
  switch (field.kind) {
    case 'select':
    case 'radio': {
      const selected = text(value)
      if (!selected) return null
      return field.options.find((option) => option.value === selected)?.label ?? selected
    }
    case 'checkbox-group': {
      if (!Array.isArray(value) || value.length === 0) return null
      return value
        .map((item) => field.options.find((option) => option.value === item)?.label ?? String(item))
        .join(', ')
    }
    case 'number':
      return typeof value === 'number' && Number.isFinite(value)
        ? `${value}${field.unit ? ` ${field.unit}` : ''}`
        : null
    case 'text':
    case 'textarea':
      return text(value)
    case 'dimensions': {
      if (typeof value !== 'object' || value === null) return null
      const { length, width, height } = value as Record<string, unknown>
      const parts = [length, width, height].map((part) =>
        typeof part === 'number' ? String(part) : '?',
      )
      return parts.every((part) => part === '?') ? null : `${parts.join(' × ')} ${field.unit}`
    }
  }
}

function formatDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`)
  return Number.isNaN(date.getTime())
    ? isoDate
    : date.toLocaleDateString('en-IN', { dateStyle: 'medium' })
}

function row(label: string, value: string | null | undefined): SummaryRow[] {
  return value ? [{ label, value }] : []
}

/** Single source for the review step and every handoff, so what the user reviews is what is sent. */
export function buildQuoteSummary(values: QuoteFormValues): EnquirySummary {
  const service = values.service ? getServiceBySlug(values.service) : undefined
  const spec = values.service ? serviceSpecs[values.service] : undefined
  const { customer } = values

  const specRows = (spec?.fields ?? []).flatMap((field) => {
    if (field.visibleWhen && !field.visibleWhen(values.specifications)) return []
    return row(field.label, formatFieldValue(field, values.specifications[field.name]))
  })

  const sections: SummarySection[] = [
    { id: 'service', title: 'Service', rows: row('Service', service?.name) },
    { id: 'specifications', title: 'Specifications', rows: specRows },
    {
      id: 'files',
      title: 'Files to attach to your message',
      rows: values.files.map((file) => ({
        label: 'File',
        value: `${file.name} (${formatFileSize(file.size)})`,
      })),
    },
    {
      id: 'customer',
      title: 'Contact and delivery',
      rows: [
        ...row('Name', customer.name),
        ...row('Company', customer.company),
        ...row('Email', customer.email),
        ...row('Phone', customer.phone),
        ...row('City', customer.city),
        ...row('PIN code', customer.pinCode),
        ...row('Delivery address', customer.address),
        ...row('Needed by', customer.requiredBy ? formatDate(customer.requiredBy) : null),
      ],
    },
  ]

  return {
    subject: service ? `Quote enquiry: ${service.name}` : 'Quote enquiry',
    sections,
    notes: values.notes,
  }
}
