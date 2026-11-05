import { z } from 'zod'
import type { FieldOption } from '@/components/form/types'

export const NOT_SURE_OPTION = {
  value: 'not-sure',
  label: 'Not sure, recommend one',
} as const satisfies FieldOption

/** `z.enum` needs a non-empty tuple; this derives it from an options list so UI and schema share one source. */
export function optionValues<const T extends readonly FieldOption[]>(
  options: T,
): [T[number]['value'], ...T[number]['value'][]] {
  return options.map((option) => option.value) as [T[number]['value'], ...T[number]['value'][]]
}

export const choiceError = 'Choose an option'

export function choice<const T extends readonly FieldOption[]>(options: T) {
  return z.enum(optionValues(options), { error: choiceError })
}

export const quantityField = z
  .number({ error: 'Enter a quantity' })
  .int('Use a whole number')
  .min(1, 'Quantity must be at least 1')

export const dimensionsSchema = z.object({
  length: z.number({ error: 'Enter a number' }).positive('Must be more than 0').optional(),
  width: z.number({ error: 'Enter a number' }).positive('Must be more than 0').optional(),
  height: z.number({ error: 'Enter a number' }).positive('Must be more than 0').optional(),
})

/** Optional free text. Empty string means "not provided". */
export const optionalText = (max: number) =>
  z.string().trim().max(max, `Use ${max} characters or fewer`)

/** Artwork formats shared by the print services. TODO(business): confirm accepted formats. */
export const artworkExtensions = [
  '.pdf',
  '.ai',
  '.eps',
  '.psd',
  '.indd',
  '.jpg',
  '.jpeg',
  '.png',
  '.tif',
  '.tiff',
] as const

export const finishingOptions = [
  { value: 'lamination', label: 'Lamination' },
  { value: 'uv-coating', label: 'UV coating' },
  { value: 'folding', label: 'Folding' },
  { value: 'creasing', label: 'Creasing' },
  { value: 'cutting', label: 'Trimming or die cutting' },
] as const satisfies readonly FieldOption[]
