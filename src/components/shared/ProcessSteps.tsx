import { Stagger, StaggerItem } from '@/components/motion/Reveal'

type Step = { title: string; description: string }

/** Numbered process list. An ordered list so assistive technology announces the sequence. */
export function ProcessSteps({ steps }: { steps: readonly Step[] }) {
  return (
    <Stagger>
      <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title}>
            <StaggerItem className="border-t border-foreground/20 pt-6">
              <span
                aria-hidden
                className="font-display text-sm font-semibold text-brand-strong tabular-nums"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 text-h4">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.description}</p>
            </StaggerItem>
          </li>
        ))}
      </ol>
    </Stagger>
  )
}
