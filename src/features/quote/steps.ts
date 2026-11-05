import { type QuoteFormValues, quoteSchema } from './schema'

export type QuoteStepId = 'service' | 'specifications' | 'details' | 'review'

export type QuoteStep = {
  id: QuoteStepId
  /** Short label for the progress indicator. */
  title: string
  /** Heading and helper text shown above the step. */
  heading: string
  description: string
  /** Form paths validated when the user presses Continue on this step. */
  fields: readonly (keyof QuoteFormValues)[]
}

export const quoteSteps: readonly [QuoteStep, ...QuoteStep[]] = [
  {
    id: 'service',
    title: 'Service',
    heading: 'Which service do you need?',
    description: 'Choose the closest match. You can change it later.',
    fields: ['service'],
  },
  {
    id: 'specifications',
    title: 'Specifications',
    heading: 'Tell us about the job',
    description: 'The more precise you are, the more accurate our quote can be.',
    fields: ['specifications', 'files'],
  },
  {
    id: 'details',
    title: 'Your details',
    heading: 'Where should we reach and deliver?',
    description: 'We use these details only to respond to your enquiry.',
    fields: ['customer', 'notes'],
  },
  {
    id: 'review',
    title: 'Review',
    heading: 'Review your enquiry',
    description: 'Nothing has been sent yet. Check the details, then choose how to send them.',
    fields: [],
  },
]

export const lastStepIndex = quoteSteps.length - 1

export function stepIndexOf(id: QuoteStepId): number {
  return quoteSteps.findIndex((step) => step.id === id)
}

/**
 * Index of the earliest step that owns a validation problem, or -1 when the form is valid.
 * Used before review so a restored or edited draft can never reach the handoff while invalid.
 */
export function findInvalidStep(values: QuoteFormValues): number {
  if (!values.service) return 0
  const result = quoteSchema.safeParse(values)
  if (result.success) return -1

  let earliest = lastStepIndex
  for (const issue of result.error.issues) {
    const root = issue.path[0]
    const index = quoteSteps.findIndex((step) =>
      (step.fields as readonly PropertyKey[]).includes(root as PropertyKey),
    )
    if (index !== -1) earliest = Math.min(earliest, index)
  }
  return earliest
}
