import { CheckboxGroupField } from '@/components/form/CheckboxGroupField'
import { DimensionsField } from '@/components/form/DimensionsField'
import { RadioCardGroup } from '@/components/form/RadioCardGroup'
import { SelectField } from '@/components/form/SelectField'
import { TextField } from '@/components/form/TextField'
import { TextareaField } from '@/components/form/TextareaField'
import type { FieldDefinition } from '../specs/types'

/** Maps one field definition to a form wrapper. This is the only place definitions become UI. */
export function SpecField({ field }: { field: FieldDefinition }) {
  const common = {
    name: `specifications.${field.name}`,
    label: field.label,
    description: field.description,
    optional: field.optional,
  }

  switch (field.kind) {
    case 'select':
      return <SelectField {...common} options={field.options} />
    case 'radio':
      return <RadioCardGroup {...common} options={field.options} />
    case 'checkbox-group':
      return <CheckboxGroupField {...common} options={field.options} />
    case 'number':
      return (
        <TextField
          {...common}
          label={field.unit ? `${field.label} (${field.unit})` : field.label}
          type="number"
          inputMode="numeric"
          min={field.min}
          max={field.max}
        />
      )
    case 'text':
      return <TextField {...common} maxLength={field.maxLength} placeholder={field.placeholder} />
    case 'textarea':
      return (
        <TextareaField
          {...common}
          rows={4}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
        />
      )
    case 'dimensions':
      return <DimensionsField {...common} unit={field.unit} />
  }
}
