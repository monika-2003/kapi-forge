import { useCallback, useId } from 'react'
import { get, useFormContext, useFormState } from 'react-hook-form'

/** Subscribes to just this field's error so other fields do not re-render. */
export function useFieldError(name: string): string | undefined {
  const { errors } = useFormState({ name })
  const message = (get(errors, name) as { message?: unknown } | undefined)?.message
  return typeof message === 'string' ? message : undefined
}

/** Stable ids that tie label, hint and error text to the control. */
export function useFieldIds() {
  const id = useId()
  return { id, descriptionId: `${id}-description`, errorId: `${id}-error` }
}

export function describedBy(
  ids: { descriptionId: string; errorId: string },
  { hasDescription, hasError }: { hasDescription: boolean; hasError: boolean },
) {
  return (
    [hasDescription && ids.descriptionId, hasError && ids.errorId].filter(Boolean).join(' ') ||
    undefined
  )
}

/**
 * Errors raised by a step's Continue button would otherwise stay until blur (`onTouched` mode).
 * Returns a function to call after every change: it re-validates only fields already showing an error.
 */
export function useRevalidate(name: string, hasError: boolean) {
  const { trigger } = useFormContext()
  return useCallback(() => {
    if (hasError) void trigger(name)
  }, [trigger, name, hasError])
}
