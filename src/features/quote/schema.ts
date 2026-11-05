import { zodResolver } from '@hookform/resolvers/zod'
import type { Resolver } from 'react-hook-form'
import { z } from 'zod'
import { type ServiceSlug, serviceSlugs } from '@/content/services'
import {
  emailField,
  indianMobileField,
  nameField,
  optionalFutureDateField,
  pinCodeField,
} from '@/lib/validation'
import { MAX_FILES } from './files'
import { serviceSpecs } from './specs'
import type { FileRule } from './specs/types'

export const customerSchema = z.object({
  name: nameField,
  company: z.string().trim().max(100, 'Use 100 characters or fewer'),
  email: emailField,
  phone: indianMobileField,
  city: z.string().trim().min(2, 'Enter your city').max(80, 'Use 80 characters or fewer'),
  pinCode: pinCodeField,
  address: z
    .string()
    .trim()
    .min(10, 'Enter your full delivery address')
    .max(300, 'Use 300 characters or fewer'),
  requiredBy: optionalFutureDateField,
})

export type CustomerValues = z.input<typeof customerSchema>

/** `instanceof` is evaluated at validation time, so this module is safe to load during pre-rendering. */
const fileSchema = z.custom<File>((value) => typeof File !== 'undefined' && value instanceof File, {
  error: 'Choose a valid file',
})

function filesSchema(rule: FileRule) {
  return z
    .array(fileSchema)
    .max(MAX_FILES, `You can add up to ${MAX_FILES} files`)
    .min(rule.requirement === 'required' ? 1 : 0, 'Attach at least one file')
}

const baseSchema = z.object({
  notes: z.string().trim().max(1000, 'Use 1,000 characters or fewer'),
  customer: customerSchema,
})

function variantFor(slug: ServiceSlug) {
  const spec = serviceSpecs[slug]
  return baseSchema.extend({
    service: z.literal(slug),
    specifications: spec.schema,
    files: filesSchema(spec.files),
  })
}

type QuoteVariant = ReturnType<typeof variantFor>

/** One variant per service, so each service validates only its own specification fields. */
export const quoteSchema = z.discriminatedUnion(
  'service',
  serviceSlugs.map(variantFor) as [QuoteVariant, ...QuoteVariant[]],
)

/**
 * Shape held by the single wizard form. `specifications` is keyed by the selected service; its
 * inner shape is defined by that service's spec file, so it is typed loosely here.
 */
export type QuoteFormValues = {
  service: ServiceSlug | ''
  specifications: Record<string, unknown>
  files: File[]
  customer: CustomerValues
  notes: string
}

export const quoteDefaults: QuoteFormValues = {
  service: '',
  specifications: {},
  files: [],
  customer: {
    name: '',
    company: '',
    email: '',
    phone: '',
    city: '',
    pinCode: '',
    address: '',
    requiredBy: '',
  },
  notes: '',
}

const zodQuoteResolver = zodResolver(quoteSchema) as unknown as Resolver<QuoteFormValues>

/** With no service selected the union has no branch to validate, so report that plainly. */
export const quoteResolver: Resolver<QuoteFormValues> = async (values, context, options) => {
  if (!values.service) {
    return {
      values: {},
      errors: { service: { type: 'required', message: 'Choose a service to continue' } },
    }
  }
  return zodQuoteResolver(values, context, options)
}
