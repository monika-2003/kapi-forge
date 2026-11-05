import { Controller, useFormContext } from 'react-hook-form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { type FieldBaseProps, FieldShell } from './FieldShell'
import { describedBy, useFieldError, useFieldIds, useRevalidate } from './useField'
import type { FieldOption } from './types'

type RadioCardGroupProps = FieldBaseProps & {
  options: readonly FieldOption[]
  /** Grid columns from `sm` upward. */
  columns?: 1 | 2 | 3
  /** Runs after the form value changes, for side effects such as resetting dependent fields. */
  onValueChange?: (value: string) => void
}

/** Single choice from a few options, shown as selectable cards. */
export function RadioCardGroup({
  name,
  label,
  description,
  optional,
  className,
  options,
  columns = 2,
  onValueChange,
}: RadioCardGroupProps) {
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
        render={({ field }) => (
          <RadioGroup
            ref={field.ref}
            value={field.value ?? ''}
            onValueChange={(value) => {
              field.onChange(value)
              revalidate()
              onValueChange?.(value)
            }}
            onBlur={field.onBlur}
            name={field.name}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(ids, {
              hasDescription: !!description,
              hasError: !!error,
            })}
            className={cn(
              'sm:grid-cols-2',
              columns === 1 && 'sm:grid-cols-1',
              columns === 3 && 'sm:grid-cols-3',
            )}
          >
            {options.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-input bg-card p-4 transition-colors duration-150 hover:border-foreground/60 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-secondary/60"
              >
                <RadioGroupItem value={option.value} className="mt-0.5" />
                <span>
                  <span className="block font-medium">{option.label}</span>
                  {option.description && (
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      {option.description}
                    </span>
                  )}
                </span>
              </label>
            ))}
          </RadioGroup>
        )}
      />
    </FieldShell>
  )
}
