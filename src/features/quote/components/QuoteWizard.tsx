import { useCallback, useEffect, useRef, useState } from 'react'
import { type FieldPath, FormProvider, useForm } from 'react-hook-form'
import * as m from 'motion/react-m'
import { duration, ease } from '@/lib/motion'
import { clearDraft } from '../draft'
import { useQuoteDraft } from '../hooks/useQuoteDraft'
import { useQuotePrefill } from '../hooks/useQuotePrefill'
import { type QuoteFormValues, quoteDefaults, quoteResolver } from '../schema'
import { findInvalidStep, lastStepIndex, quoteSteps } from '../steps'
import { QuoteProgress } from './QuoteProgress'
import { StepActions } from './StepActions'
import { DetailsStep } from './steps/DetailsStep'
import { ReviewStep } from './steps/ReviewStep'
import { ServiceStep } from './steps/ServiceStep'
import { SpecificationsStep } from './steps/SpecificationsStep'

/** Moves focus to the first invalid control. Groups (radio) are not focusable, so use their first input. */
function focusFirstInvalid(root: HTMLElement | null) {
  const invalid = root?.querySelector<HTMLElement>('[aria-invalid="true"]')
  if (!invalid) return
  const focusable = invalid.matches('input, button, select, textarea')
    ? invalid
    : invalid.querySelector<HTMLElement>('[role="radio"], input, button')
  ;(focusable ?? invalid).focus()
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Owns the single quote form, the current step and the draft. Steps read and write through
 * `useFormContext`, so the review step and the handoff see one object.
 */
export function QuoteWizard() {
  const form = useForm<QuoteFormValues>({
    resolver: quoteResolver,
    defaultValues: quoteDefaults,
    mode: 'onTouched',
  })
  const [stepIndex, setStepIndex] = useState(0)
  const [pending, setPending] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const previousStep = useRef(0)
  const suppressFocus = useRef(false)

  // A restored step must not steal focus or scroll the page.
  const restoreStep = useCallback((index: number) => {
    if (index !== previousStep.current) suppressFocus.current = true
    setStepIndex(index)
  }, [])
  const { restored, dismissRestored, saveStep } = useQuoteDraft(form, restoreStep)
  const goTo = useCallback(
    (index: number) => {
      setStepIndex(index)
      saveStep(index)
    },
    [saveStep],
  )
  useQuotePrefill(form)

  const step = quoteSteps[stepIndex] ?? quoteSteps[0]
  const isReview = stepIndex === lastStepIndex

  useEffect(() => {
    if (previousStep.current === stepIndex) return
    previousStep.current = stepIndex
    if (suppressFocus.current) {
      suppressFocus.current = false
      return
    }
    headingRef.current?.focus({ preventScroll: true })
    rootRef.current?.scrollIntoView({
      block: 'start',
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }, [stepIndex])

  async function validateStep(index: number) {
    const fields = quoteSteps[index]?.fields ?? []
    return form.trigger([...fields] as FieldPath<QuoteFormValues>[], { shouldFocus: true })
  }

  async function goNext() {
    if (isReview || pending) return
    setPending(true)
    try {
      const valid = await validateStep(stepIndex)
      if (!valid) {
        requestAnimationFrame(() => focusFirstInvalid(rootRef.current))
        return
      }
      // Before review, confirm every earlier step still holds (a restored draft may not).
      const invalidAt = stepIndex + 1 === lastStepIndex ? findInvalidStep(form.getValues()) : -1
      if (invalidAt !== -1) {
        await validateStep(invalidAt)
        goTo(invalidAt)
        return
      }
      goTo(stepIndex + 1)
    } finally {
      setPending(false)
    }
  }

  function startNew() {
    clearDraft()
    form.reset(quoteDefaults)
    dismissRestored()
    goTo(0)
  }

  return (
    <div ref={rootRef} className="scroll-mt-24">
      <QuoteProgress current={stepIndex} onSelect={goTo} />

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {`Step ${stepIndex + 1} of ${quoteSteps.length}, ${step.title}`}
      </p>

      <FormProvider {...form}>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            void goNext()
          }}
        >
          <m.div
            key={step.id}
            className="mt-10"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: ease.outExpo }}
          >
            <h2 ref={headingRef} tabIndex={-1} className="text-h3 outline-none">
              {step.heading}
            </h2>
            <p className="mt-2 mb-8 text-muted-foreground">{step.description}</p>

            {step.id === 'service' && <ServiceStep />}
            {step.id === 'specifications' && <SpecificationsStep restored={restored} />}
            {step.id === 'details' && <DetailsStep />}
            {step.id === 'review' && <ReviewStep onEdit={goTo} onStartNew={startNew} />}
          </m.div>

          {!isReview && (
            <StepActions
              canGoBack={stepIndex > 0}
              continueLabel={stepIndex + 1 === lastStepIndex ? 'Review' : 'Continue'}
              pending={pending}
              onBack={() => goTo(stepIndex - 1)}
            />
          )}
        </form>
      </FormProvider>
    </div>
  )
}
