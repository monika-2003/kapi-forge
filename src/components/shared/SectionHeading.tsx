import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  lead?: string
  /** Heading element; visual size stays text-h2. */
  as?: 'h1' | 'h2' | 'h3'
  align?: 'left' | 'center'
  id?: string
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  as: Heading = 'h2',
  align = 'left',
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <p className="mb-4 eyebrow text-brand-strong">{eyebrow}</p>}
      <Heading id={id} className="text-h2">
        {title}
      </Heading>
      {lead && <p className="mt-4 text-lead text-muted-foreground">{lead}</p>}
    </div>
  )
}
