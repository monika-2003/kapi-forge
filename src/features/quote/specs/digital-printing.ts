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

// TODO(business): confirm products, paper sizes, GSM values and finishing options before launch.
const productTypes = [
  { value: 'flyers', label: 'Flyers or leaflets' },
  { value: 'brochures', label: 'Brochures or booklets' },
  { value: 'cards', label: 'Business cards or stationery' },
  { value: 'posters', label: 'Posters or signage' },
  { value: 'other', label: 'Something else' },
] as const

const paperSizes = [
  { value: 'a6', label: 'A6' },
  { value: 'a5', label: 'A5' },
  { value: 'a4', label: 'A4' },
  { value: 'a3', label: 'A3' },
  { value: 'custom', label: 'Custom size' },
] as const

const gsmOptions = [
  { value: '80', label: '80 GSM' },
  { value: '130', label: '130 GSM' },
  { value: '170', label: '170 GSM' },
  { value: '250', label: '250 GSM' },
  { value: '300', label: '300 GSM' },
  NOT_SURE_OPTION,
] as const

const colourModes = [
  { value: 'full-colour', label: 'Full colour' },
  { value: 'black-white', label: 'Black and white' },
] as const

const sides = [
  { value: 'single', label: 'Single sided' },
  { value: 'double', label: 'Double sided' },
] as const

const schema = z
  .object({
    productType: choice(productTypes),
    paperSize: choice(paperSizes),
    customSize: optionalText(60),
    gsm: choice(gsmOptions),
    colour: choice(colourModes),
    sides: choice(sides),
    quantity: quantityField,
    finishing: z.array(z.enum(optionValues(finishingOptions))),
    details: optionalText(500),
  })
  .superRefine((value, ctx) => {
    if (value.paperSize === 'custom' && value.customSize === '') {
      ctx.addIssue({ code: 'custom', path: ['customSize'], message: 'Enter the size you need' })
    }
  })

export const digitalPrintingSpec = defineSpec({
  slug: 'digital-printing',
  schema,
  defaults: {
    gsm: 'not-sure',
    colour: 'full-colour',
    sides: 'single',
    quantity: 100,
    finishing: [],
    customSize: '',
    details: '',
  },
  fields: [
    { kind: 'select', name: 'productType', label: 'What are you printing?', options: productTypes },
    { kind: 'select', name: 'paperSize', label: 'Paper size', options: paperSizes },
    {
      kind: 'text',
      name: 'customSize',
      label: 'Custom size',
      description: 'For example 210 x 100 mm.',
      maxLength: 60,
      visibleWhen: (specs) => specs.paperSize === 'custom',
    },
    { kind: 'select', name: 'gsm', label: 'Paper weight', options: gsmOptions },
    { kind: 'radio', name: 'colour', label: 'Colour', options: colourModes },
    { kind: 'radio', name: 'sides', label: 'Printing sides', options: sides },
    { kind: 'number', name: 'quantity', label: 'Quantity', min: 1 },
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
  files: { requirement: 'optional', accept: artworkExtensions },
})
