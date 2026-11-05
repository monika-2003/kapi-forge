import { useFormContext } from 'react-hook-form'
import { RadioCardGroup } from '@/components/form/RadioCardGroup'
import { isServiceSlug, services } from '@/content/services'
import type { QuoteFormValues } from '../../schema'
import { selectService } from '../../service'

const options = services.map((service) => ({
  value: service.slug,
  label: service.name,
  description: service.summary,
}))

export function ServiceStep() {
  const form = useFormContext<QuoteFormValues>()

  return (
    <RadioCardGroup
      name="service"
      label="Service"
      options={options}
      onValueChange={(slug) => {
        if (isServiceSlug(slug)) selectService(form, slug)
      }}
    />
  )
}
