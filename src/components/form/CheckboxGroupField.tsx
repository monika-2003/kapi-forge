import { Controller, useFormContext } from 'react-hook-form'
import { Checkbox } from '@/components/ui/checkbox'
import { type FieldBaseProps, FieldShell } from './FieldShell'
import { useFieldError, useFieldIds, useRevalidate } from './useField'
import type { FieldOption } from './types'

type CheckboxGroupFieldProps = FieldBaseProps & { options: readonly FieldOption[] }

/** Multiple choice. The form value is an array of option values. */
export function CheckboxGroupField({
  name,
  label,
  description,
  optional,
  className,
  options,
}: CheckboxGroupFieldProps) {
  const { control } = useFormContext()
  const error = useFieldError(name)
  const ids = useFieldIds()
  const revalidate = useRevalidate(name, !!error)

  return (
    <FieldShell
      {...ids}
      group
      label={label}
      description={description}
      optional={optional}
      error={error}
      className={className}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selected: string[] = Array.isArray(field.value) ? field.value : []
          return (
            <div className="grid gap-3 sm:grid-cols-2">
              {options.map((option, index) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-input bg-card p-4 transition-colors duration-150 hover:border-foreground/60 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-secondary/60"
                >
                  <Checkbox
                    ref={index === 0 ? field.ref : undefined}
                    checked={selected.includes(option.value)}
                    onCheckedChange={(checked) => {
                      field.onChange(
                        checked
                          ? [...selected, option.value]
                          : selected.filter((value) => value !== option.value),
                      )
                      revalidate()
                    }}
                    onBlur={field.onBlur}
                  />
                  <span className="font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          )
        }}
      />
    </FieldShell>
  )
}
