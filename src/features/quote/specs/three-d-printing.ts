import { z } from 'zod'
import { NOT_SURE_OPTION, choice, dimensionsSchema, optionalText, quantityField } from './shared'
import { defineSpec } from './types'

// TODO(business): confirm the materials, finishes and file formats offered before launch.
const materials = [
  { value: 'pla', label: 'PLA' },
  { value: 'petg', label: 'PETG' },
  { value: 'abs', label: 'ABS' },
  { value: 'resin', label: 'Resin' },
  NOT_SURE_OPTION,
] as const

const finishes = [
  { value: 'as-printed', label: 'As printed' },
  { value: 'sanded', label: 'Sanded' },
  { value: 'painted', label: 'Painted' },
  NOT_SURE_OPTION,
] as const

const purposes = [
  {
    value: 'prototype',
    label: 'Prototype',
    description: 'A one-off or small batch to test or present.',
  },
  {
    value: 'production',
    label: 'Production parts',
    description: 'Parts for use or repeat orders.',
  },
] as const

const schema = z.object({
  material: choice(materials),
  quantity: quantityField,
  dimensions: dimensionsSchema.optional(),
  colour: optionalText(60),
  finish: choice(finishes),
  purpose: choice(purposes),
})

export const threeDPrintingSpec = defineSpec({
  slug: '3d-printing',
  schema,
  defaults: {
    material: 'not-sure',
    quantity: 1,
    finish: 'as-printed',
    purpose: 'prototype',
    colour: '',
  },
  fields: [
    { kind: 'radio', name: 'purpose', label: 'What is it for?', options: purposes },
    { kind: 'select', name: 'material', label: 'Material', options: materials },
    { kind: 'number', name: 'quantity', label: 'Quantity', min: 1 },
    {
      kind: 'dimensions',
      name: 'dimensions',
      label: 'Approximate size of the largest part',
      description: 'Optional. An estimate helps us check the part fits our printers.',
      unit: 'mm',
      optional: true,
    },
    { kind: 'text', name: 'colour', label: 'Colour', optional: true, maxLength: 60 },
    { kind: 'select', name: 'finish', label: 'Finish', options: finishes },
  ],
  files: { requirement: 'required', accept: ['.stl', '.obj', '.step', '.stp', '.3mf'] },
})
