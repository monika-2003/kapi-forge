import type { ComponentProps } from 'react'
import { useFormContext } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import { type FieldBaseProps, FieldShell } from './FieldShell'
import { describedBy, useFieldError, useFieldIds, useRevalidate } from './useField'

type TextareaFieldProps = FieldBaseProps &
  Omit<ComponentProps<'textarea'>, 'name' | 'id' | 'className'>

export function TextareaField({
  name,
  label,
  description,
  optional,
  className,
  ...textareaProps
}: TextareaFieldProps) {
  const { register } = useFormContext()
  const error = useFieldError(name)
  const ids = useFieldIds()
  const revalidate = useRevalidate(name, !!error)
  const { onChange, ...registered } = register(name)

  return (
    <FieldShell
      {...ids}
      label={label}
      description={description}
      optional={optional}
      error={error}
      className={className}
    >
      <Textarea
        id={ids.id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(ids, { hasDescription: !!description, hasError: !!error })}
        {...textareaProps}
        {...registered}
        onChange={(event) => {
          void onChange(event)
          revalidate()
        }}
      />
    </FieldShell>
  )
}
