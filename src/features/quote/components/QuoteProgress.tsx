import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { quoteSteps } from '../steps'

type QuoteProgressProps = { current: number; onSelect: (index: number) => void }

/** Ordered list of steps. Only completed steps are buttons, so users can go back but never skip ahead. */
export function QuoteProgress({ current, onSelect }: QuoteProgressProps) {
  return (
    <nav aria-label="Quote progress">
      <ol className="flex items-center gap-2 sm:gap-3">
        {quoteSteps.map((step, index) => {
          const state = index < current ? 'complete' : index === current ? 'current' : 'upcoming'
          const marker = (
            <span
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium tabular-nums transition-colors duration-150',
                state === 'complete' && 'border-primary bg-primary text-primary-foreground',
                state === 'current' && 'border-brand bg-brand text-brand-foreground',
                state === 'upcoming' && 'border-input text-muted-foreground',
              )}
            >
              {state === 'complete' ? <Check className="size-4" aria-hidden /> : index + 1}
            </span>
          )
          const label = (
            <span
              className={cn(
                'text-sm font-medium',
                state === 'current' ? 'inline' : 'hidden sm:inline',
                state === 'upcoming' && 'text-muted-foreground',
              )}
            >
              {step.title}
              {state === 'complete' && <span className="sr-only"> (completed)</span>}
            </span>
          )

          return (
            <li key={step.id} className="flex items-center gap-2 sm:gap-3">
              {state === 'complete' ? (
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  className="flex items-center gap-2 rounded-md hover:text-brand-strong"
                >
                  {marker}
                  {label}
                </button>
              ) : (
                <span
                  aria-current={state === 'current' ? 'step' : undefined}
                  className="flex items-center gap-2"
                >
                  {marker}
                  {label}
                </span>
              )}
              {index < quoteSteps.length - 1 && (
                <span aria-hidden className="hidden h-px w-6 bg-border sm:block lg:w-10" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
