import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type StepActionsProps = {
  canGoBack: boolean
  continueLabel: string
  pending: boolean
  onBack: () => void
}

export function StepActions({ canGoBack, continueLabel, pending, onBack }: StepActionsProps) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
      {canGoBack ? (
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft aria-hidden />
          Back
        </Button>
      ) : (
        <span />
      )}
      <Button type="submit" size="lg" disabled={pending}>
        {continueLabel}
        <ArrowRight aria-hidden />
      </Button>
    </div>
  )
}
