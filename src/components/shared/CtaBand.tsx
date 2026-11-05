import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Reveal } from '@/components/motion/Reveal'
import { Section } from '@/components/layout/Section'
import { Button } from '@/components/ui/button'
import { quotePath } from '@/config/paths'

type CtaBandProps = {
  title?: string
  lead?: string
  /** Pre-selects this service in the quote wizard. */
  serviceSlug?: string
}

export function CtaBand({
  title = 'Ready to start your project?',
  lead = 'Tell us what you need and we will come back to you with a quote.',
  serviceSlug,
}: CtaBandProps) {
  return (
    <Section tone="dark" aria-labelledby="cta-heading">
      <Reveal className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <h2 id="cta-heading" className="text-h2">
            {title}
          </h2>
          <p className="mt-4 text-lead text-muted-foreground">{lead}</p>
        </div>
        <Button asChild variant="brand" size="lg" className="group">
          <Link to={quotePath(serviceSlug)}>
            Get a quote
            <ArrowRight
              className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </Button>
      </Reveal>
    </Section>
  )
}
