import { Link } from 'react-router'
import { Section } from '@/components/layout/Section'
import { Button } from '@/components/ui/button'
import { paths } from '@/config/paths'

type ErrorPanelProps = { code: string; title: string; message: string }

/** Full-width message used by the not-found route and the layout error boundary. */
export function ErrorPanel({ code, title, message }: ErrorPanelProps) {
  return (
    <Section containerSize="prose" className="min-h-[60svh]">
      <p className="eyebrow text-brand-strong">{code}</p>
      <h1 className="mt-4 text-h1">{title}</h1>
      <p className="mt-6 text-lead text-muted-foreground">{message}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild>
          <Link to={paths.home}>Back to the homepage</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to={paths.services}>Browse services</Link>
        </Button>
      </div>
    </Section>
  )
}
