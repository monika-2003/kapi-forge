import type { LucideIcon } from 'lucide-react'
import { Stagger, StaggerItem } from '@/components/motion/Reveal'

type Feature = { title: string; description: string; icon?: LucideIcon }

export function FeatureGrid({ features }: { features: readonly Feature[] }) {
  return (
    <Stagger>
      <ul className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <li key={feature.title}>
            <StaggerItem className="h-full rounded-lg bg-card p-7 shadow-card">
              {feature.icon && (
                <span className="flex size-11 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                  <feature.icon className="size-5" strokeWidth={1.5} aria-hidden />
                </span>
              )}
              <h3 className={feature.icon ? 'mt-6 text-h4' : 'text-h4'}>{feature.title}</h3>
              <p className="mt-3 text-muted-foreground">{feature.description}</p>
            </StaggerItem>
          </li>
        ))}
      </ul>
    </Stagger>
  )
}
