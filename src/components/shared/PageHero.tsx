import type { ReactNode } from 'react'
import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'

type PageHeroProps = {
  eyebrow: string
  title: string
  lead?: string
  /** Buttons or links rendered under the lead. */
  actions?: ReactNode
  /** Optional large decorative text, such as a service number. Hidden from assistive tech. */
  mark?: string
  className?: string
}

/** Dark, blueprint-patterned hero used by every inner page. The only `h1` on the page. */
export function PageHero({ eyebrow, title, lead, actions, mark, className }: PageHeroProps) {
  return (
    <section className={cn('relative overflow-hidden surface-dark blueprint-grid', className)}>
      {mark && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-4 bottom-0 translate-y-[22%] font-display text-[clamp(10rem,28vw,24rem)] leading-none font-semibold tracking-tighter text-foreground/[0.05] select-none"
        >
          {mark}
        </span>
      )}
      <Container className="relative py-section">
        <p className="animate-rise eyebrow text-brand-strong">{eyebrow}</p>
        <h1 className="mt-5 max-w-3xl animate-rise text-h1 [animation-delay:80ms]">{title}</h1>
        {lead && (
          <p className="mt-6 max-w-2xl animate-rise text-lead text-muted-foreground [animation-delay:160ms]">
            {lead}
          </p>
        )}
        {actions && (
          <div className="mt-10 flex animate-rise flex-wrap gap-3 [animation-delay:240ms]">
            {actions}
          </div>
        )}
      </Container>
    </section>
  )
}
