import type { UseFormReturn } from 'react-hook-form'
import type { ServiceSlug } from '@/content/services'
import { keepAcceptedFiles } from './files'
import type { QuoteFormValues } from './schema'
import { serviceSpecs } from './specs'

/**
 * Selects a service and swaps in that service's default specifications. Customer details are kept;
 * files stay only if the new service still accepts them.
 */
export function selectService(form: UseFormReturn<QuoteFormValues>, slug: ServiceSlug): void {
  const spec = serviceSpecs[slug]
  form.setValue('service', slug)
  form.setValue('specifications', { ...spec.defaults })
  form.setValue('files', keepAcceptedFiles(form.getValues('files'), spec.files))
  form.clearErrors(['service', 'specifications', 'files'])
}
