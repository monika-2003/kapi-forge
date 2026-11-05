import { z } from 'zod'
import { NOT_SURE_OPTION, artworkExtensions, choice, optionalText, quantityField } from './shared'
import { defineSpec } from './types'

// TODO(business): confirm the product list and any minimum order quantity before launch.
const productTypes = [
  { value: 'stationery', label: 'Corporate stationery' },
  { value: 'marketing', label: 'Marketing collateral' },
  { value: 'catalogues', label: 'Catalogues or brochures' },
  { value: 'event', label: 'Event materials' },
  { value: 'other', label: 'Something else' },
] as const

const methods = [
  { value: 'digital', label: 'Digital' },
  { value: 'offset', label: 'Offset' },
  NOT_SURE_OPTION,
] as const

const schema = z.object({
  productType: choice(productTypes),
  quantity: quantityField,
  versions: z
    .number({ error: 'Enter a number' })
    .int('Use a whole number')
    .min(1, 'Must be at least 1')
    .optional(),
  method: choice(methods),
  description: z
    .string()
    .trim()
    .min(20, 'Describe the order in at least 20 characters')
    .max(1500, 'Use 1,500 characters or fewer'),
  deliveryPlan: optionalText(300),
})

export const bulkPrintingSpec = defineSpec({
  slug: 'bulk-printing',
  schema,
  defaults: { method: 'not-sure', quantity: 1000, description: '', deliveryPlan: '' },
  fields: [
    { kind: 'select', name: 'productType', label: 'What are you printing?', options: productTypes },
    { kind: 'number', name: 'quantity', label: 'Total quantity', min: 1 },
    {
      kind: 'number',
      name: 'versions',
      label: 'Number of versions or languages',
      description: 'Optional. Leave blank if there is only one.',
      optional: true,
      min: 1,
    },
    { kind: 'radio', name: 'method', label: 'Preferred print method', options: methods },
    {
      kind: 'textarea',
      name: 'description',
      label: 'Describe your order',
      description: 'Sizes, paper, finishing and anything else that affects the job.',
      maxLength: 1500,
    },
    {
      kind: 'textarea',
      name: 'deliveryPlan',
      label: 'Delivery to several locations?',
      description:
        'Optional. If the order ships in parts or to more than one address, tell us here.',
      optional: true,
      maxLength: 300,
    },
  ],
  files: { requirement: 'optional', accept: [...artworkExtensions] },
})
