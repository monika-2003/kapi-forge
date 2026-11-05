import { z } from 'zod'
import {
  NOT_SURE_OPTION,
  artworkExtensions,
  choice,
  finishingOptions,
  optionValues,
  optionalText,
  quantityField,
} from './shared'
import { defineSpec } from './types'

// TODO(business): confirm products, colour options, binding types and finishing before launch.
const productTypes = [
  { value: 'catalogue', label: 'Catalogue or brochure' },
  { value: 'book', label: 'Book or booklet' },
  { value: 'stationery', label: 'Letterheads or stationery' },
  { value: 'folder', label: 'Folders or inserts' },
  { value: 'packaging', label: 'Cartons or packaging' },
  { value: 'other', label: 'Something else' },
] as const

const colourOptions = [
  { value: 'one', label: 'One colour' },
  { value: 'two', label: 'Two colours' },
  { value: 'four', label: 'Full colour (CMYK)' },
  { value: 'spot', label: 'CMYK plus spot colour' },
  NOT_SURE_OPTION,
] as const

const bindingOptions = [
  { value: 'none', label: 'No binding' },
  { value: 'saddle-stitch', label: 'Saddle stitch (stapled)' },
  { value: 'perfect', label: 'Perfect bound' },
  { value: 'wire-o', label: 'Wire-O or spiral' },
  NOT_SURE_OPTION,
] as const

const schema = z.object({
  productType: choice(productTypes),
  size: z.string().trim().min(1, 'Enter the finished size').max(60, 'Use 60 characters or fewer'),
  paperSpec: z
    .string()
    .trim()
    .min(1, 'Describe the paper, or write "not sure"')
    .max(120, 'Use 120 characters or fewer'),
  pages: z
    .number({ error: 'Enter a number' })
    .int('Use a whole number')
    .min(1, 'Must be at least 1')
    .optional(),
  quantity: quantityField,
  colours: choice(colourOptions),
  binding: choice(bindingOptions),
  finishing: z.array(z.enum(optionValues(finishingOptions))),
  details: optionalText(500),
})

export const offsetPrintingSpec = defineSpec({
  slug: 'offset-printing',
  schema,
  defaults: {
    colours: 'four',
    binding: 'none',
    quantity: 1000,
    finishing: [],
    details: '',
    size: '',
    paperSpec: '',
  },
  fields: [
    { kind: 'select', name: 'productType', label: 'What are you printing?', options: productTypes },
    {
      kind: 'text',
      name: 'size',
      label: 'Finished size',
      description: 'For example A4, or 210 x 148 mm.',
      maxLength: 60,
    },
    {
      kind: 'text',
      name: 'paperSpec',
      label: 'Paper',
      description:
        'Type and weight, for example "130 GSM gloss art paper". Write "not sure" if you want advice.',
      maxLength: 120,
    },
    {
      kind: 'number',
      name: 'pages',
      label: 'Number of pages',
      description: 'Optional. For multi-page products only.',
      optional: true,
      min: 1,
    },
    { kind: 'number', name: 'quantity', label: 'Quantity', min: 1 },
    { kind: 'select', name: 'colours', label: 'Colours', options: colourOptions },
    { kind: 'select', name: 'binding', label: 'Binding', options: bindingOptions },
    {
      kind: 'checkbox-group',
      name: 'finishing',
      label: 'Finishing',
      optional: true,
      options: finishingOptions,
    },
    {
      kind: 'textarea',
      name: 'details',
      label: 'Anything else about the job?',
      optional: true,
      maxLength: 500,
    },
  ],
  files: { requirement: 'optional', accept: [...artworkExtensions] },
})
