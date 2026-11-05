import { Controller, useFormContext } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type FieldBaseProps, FieldShell } from './FieldShell'
import { describedBy, useFieldError, useFieldIds, useRevalidate } from './useField'
import type { FieldOption } from './types'

type SelectFieldProps = FieldBaseProps & {
  options: readonly FieldOption[]
  placeholder?: string
}

export function SelectField({
  name,
  label,
  description,
  optional,
  className,
  options,
  placeholder = 'Select an option',
}: SelectFieldProps) {
  const { control } = useFormContext()
  const error = useFieldError(name)
  const ids = useFieldIds()
  const revalidate = useRevalidate(name, !!error)

  return (
    <FieldShell
      {...ids}
      label={label}
      description={description}
      optional={optional}
      error={error}
      className={className}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value ?? ''}
            onValueChange={(value) => {
              field.onChange(value)
              revalidate()
            }}
            name={field.name}
          >
            <SelectTrigger
              id={ids.id}
              ref={field.ref}
              onBlur={field.onBlur}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy(ids, {
                hasDescription: !!description,
                hasError: !!error,
              })}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FieldShell>
  )
}
