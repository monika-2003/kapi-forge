import { z } from 'zod'
import { NOT_SURE_OPTION, choice, optionalText, quantityField } from './shared'
import { defineSpec } from './types'

// TODO(business): confirm the prototype types offered before launch.
const prototypeTypes = [
  { value: 'concept', label: 'Concept or look-and-feel model' },
  { value: 'functional', label: 'Fit and function prototype' },
  { value: 'presentation', label: 'Presentation model' },
  { value: 'mockup', label: 'Print or packaging mock-up' },
  NOT_SURE_OPTION,
] as const

const schema = z.object({
  prototypeType: choice(prototypeTypes),
  quantity: quantityField,
  size: optionalText(80),
  materials: optionalText(120),
  description: z
    .string()
    .trim()
    .min(20, 'Describe what you need in at least 20 characters')
    .max(1500, 'Use 1,500 characters or fewer'),
})

export const prototypingSpec = defineSpec({
  slug: 'prototyping',
  schema,
  defaults: { prototypeType: 'not-sure', quantity: 1, size: '', materials: '', description: '' },
  fields: [
    { kind: 'select', name: 'prototypeType', label: 'Type of prototype', options: prototypeTypes },
    { kind: 'number', name: 'quantity', label: 'Quantity', min: 1 },
    {
      kind: 'text',
      name: 'size',
      label: 'Approximate size',
      description: 'Optional. For example "about 15 cm tall".',
      optional: true,
      maxLength: 80,
    },
    {
      kind: 'text',
      name: 'materials',
      label: 'Material preferences',
      description: 'Optional. Leave blank if you want a recommendation.',
      optional: true,
      maxLength: 120,
    },
    {
      kind: 'textarea',
      name: 'description',
      label: 'Describe your project',
      description: 'What is it, what must the prototype show or do, and when do you need it?',
      maxLength: 1500,
    },
  ],
  files: {
    requirement: 'optional',
    accept: [
      '.pdf',
      '.jpg',
      '.jpeg',
      '.png',
      '.stl',
      '.obj',
      '.step',
      '.stp',
      '.3mf',
      '.dwg',
      '.dxf',
    ],
  },
})
