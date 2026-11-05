import { CircleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { describedBy } from './useField'

export type FieldBaseProps = {
  /** Path in the form values, e.g. `customer.email`. */
  name: string
  label: string
  description?: string
  optional?: boolean
  className?: string
}

type FieldShellProps = Omit<FieldBaseProps, 'name'> & {
  id: string
  descriptionId: string
  errorId: string
  error?: string
  /** Render a fieldset + legend (radio and checkbox groups) instead of a label. */
  group?: boolean
  children: ReactNode
}

/** Label, hint, control slot and error message. Every form field renders through this. */
export function FieldShell({
  id,
  descriptionId,
  errorId,
  label,
  description,
  optional,
  error,
  group,
  className,
  children,
}: FieldShellProps) {
  const labelContent = (
    <>
      {label}
      {optional && <span className="font-normal text-muted-foreground"> (optional)</span>}
    </>
  )
  const body = (
    <>
      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {children}
      {error && (
        <p id={errorId} role="alert" className="flex items-start gap-1.5 text-sm text-destructive">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </>
  )

  if (group) {
    return (
      <fieldset
        aria-describedby={describedBy(
          { descriptionId, errorId },
          { hasDescription: !!description, hasError: !!error },
        )}
        className={cn('flex min-w-0 flex-col gap-2', className)}
      >
        <legend className="mb-2 text-sm leading-snug font-medium">{labelContent}</legend>
        {body}
      </fieldset>
    )
  }

  return (
    <div className={cn('flex min-w-0 flex-col gap-2', className)}>
      <Label htmlFor={id}>{labelContent}</Label>
      {body}
    </div>
  )
}
