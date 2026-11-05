import type { ComponentProps } from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { toOptionalNumber } from '@/lib/validation'
import { type FieldBaseProps, FieldShell } from './FieldShell'
import { describedBy, useFieldError, useFieldIds, useRevalidate } from './useField'

type TextFieldProps = FieldBaseProps &
  Omit<ComponentProps<'input'>, 'name' | 'id' | 'type' | 'className'> & {
    type?: 'text' | 'email' | 'tel' | 'number' | 'date'
  }

/** Text-like input bound to the surrounding `FormProvider`. Number inputs yield `number | undefined`. */
export function TextField({
  name,
  label,
  description,
  optional,
  className,
  type = 'text',
  ...inputProps
}: TextFieldProps) {
  const { register } = useFormContext()
  const error = useFieldError(name)
  const ids = useFieldIds()
  const revalidate = useRevalidate(name, !!error)
  const { onChange, ...registered } = register(
    name,
    type === 'number' ? { setValueAs: toOptionalNumber } : undefined,
  )

  return (
    <FieldShell
      {...ids}
      label={label}
      description={description}
      optional={optional}
      error={error}
      className={className}
    >
      <Input
        id={ids.id}
        type={type}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(ids, { hasDescription: !!description, hasError: !!error })}
        {...inputProps}
        {...registered}
        onChange={(event) => {
          void onChange(event)
          revalidate()
        }}
      />
    </FieldShell>
  )
}
