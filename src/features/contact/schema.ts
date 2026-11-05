import { z } from 'zod'
import { serviceSlugs, services } from '@/content/services'
import { emailField, nameField, optionalIndianMobileField } from '@/lib/validation'

export const NOT_SURE = 'not-sure'

export const contactServiceOptions = [
  ...services.map((service) => ({ value: service.slug, label: service.name })),
  { value: NOT_SURE, label: 'Not sure yet' },
]

export const contactSchema = z.object({
  name: nameField,
  email: emailField,
  phone: optionalIndianMobileField,
  service: z.enum([...serviceSlugs, NOT_SURE, '']),
  message: z
    .string()
    .trim()
    .min(10, 'Tell us a little more (at least 10 characters)')
    .max(2000, 'Message must be 2,000 characters or fewer'),
})

export type ContactValues = z.infer<typeof contactSchema>

export const contactDefaults: ContactValues = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: '',
}
