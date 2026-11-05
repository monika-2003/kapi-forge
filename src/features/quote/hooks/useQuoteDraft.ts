import { useCallback, useEffect, useRef, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { readDraft, writeDraft } from '../draft'
import type { QuoteFormValues } from '../schema'

const SAVE_DELAY_MS = 500

/**
 * Keeps the quote in `sessionStorage` (tab-scoped, so nothing lingers on a shared computer) and
 * restores it once after mount. Files are never saved. Returns `restored` so the UI can ask the
 * user to re-attach files.
 */
export function useQuoteDraft(
  form: UseFormReturn<QuoteFormValues>,
  onRestore: (stepIndex: number) => void,
) {
  const { reset, subscribe, getValues } = form
  const [restored, setRestored] = useState(false)
  const stepRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    const draft = readDraft()
    if (!draft) return
    reset(draft.values)
    stepRef.current = draft.stepIndex
    onRestore(draft.stepIndex)
    // Reading sessionStorage must wait until after mount (pre-rendered HTML has no draft), so this
    // one-time sync from an external store legitimately sets state in an effect.
    // oxlint-disable-next-line react/set-state-in-effect
    setRestored(true)
  }, [reset, onRestore])

  useEffect(() => {
    const unsubscribe = subscribe({
      formState: { values: true },
      callback: () => {
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => writeDraft(getValues(), stepRef.current), SAVE_DELAY_MS)
      },
    })
    return () => {
      clearTimeout(timerRef.current)
      unsubscribe()
    }
  }, [subscribe, getValues])

  /** Call on every user-driven step change. Restoring a draft must not go through here. */
  const saveStep = useCallback(
    (index: number) => {
      stepRef.current = index
      writeDraft(getValues(), index)
    },
    [getValues],
  )

  return { restored, dismissRestored: () => setRestored(false), saveStep }
}
