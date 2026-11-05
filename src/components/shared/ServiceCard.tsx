import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import type { ServiceContent } from '@/content/services'

/** Whole card is one link. Hover state lives on the link so there is a single focus target. */
export function ServiceCard({ service, index }: { service: ServiceContent; index: number }) {
  return (
    <Link
      to={service.path}
      className="group flex h-full flex-col rounded-lg border border-border bg-card p-7 transition-[border-color,box-shadow] duration-300 ease-out-expo hover:border-foreground/25 hover:shadow-card"
    >
      <div className="flex items-start justify-between">
        <span className="flex size-11 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
          <service.icon className="size-5" strokeWidth={1.5} aria-hidden />
        </span>
        <span aria-hidden className="font-display text-sm text-muted-foreground tabular-nums">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <h3 className="mt-8 text-h3">{service.name}</h3>
      <p className="mt-3 text-muted-foreground">{service.summary}</p>
      <span className="mt-auto flex items-center gap-2 pt-8 text-sm font-medium">
        Learn more
        <ArrowRight
          className="size-4 text-brand-strong transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
          aria-hidden
        />
      </span>
    </Link>
  )
}
