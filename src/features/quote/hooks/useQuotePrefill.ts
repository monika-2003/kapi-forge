import { useEffect } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useSearchParams } from 'react-router'
import { isServiceSlug } from '@/content/services'
import { readDraft } from '../draft'
import type { QuoteFormValues } from '../schema'
import { selectService } from '../service'

/**
 * Applies `?service=` from service-page links. Done after mount because the page is pre-rendered
 * without a query string. An existing draft always wins over the link.
 */
export function useQuotePrefill(form: UseFormReturn<QuoteFormValues>) {
  const [searchParams] = useSearchParams()
  const requested = searchParams.get('service')

  useEffect(() => {
    if (!isServiceSlug(requested)) return
    if (readDraft() !== null || form.getValues('service')) return
    selectService(form, requested)
  }, [requested, form])
}
