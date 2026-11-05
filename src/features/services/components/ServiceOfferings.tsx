import { Check } from 'lucide-react'
import { Section } from '@/components/layout/Section'
import { Reveal } from '@/components/motion/Reveal'
import { SectionHeading } from '@/components/shared/SectionHeading'
import type { ServiceContent } from '@/content/services'

export function ServiceOfferings({ offerings }: { offerings: ServiceContent['offerings'] }) {
  if (offerings.items.length === 0) return null

  return (
    <Section tone="white" aria-labelledby="offerings-heading">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <SectionHeading id="offerings-heading" eyebrow="Scope" title={offerings.title} />
        <Reveal>
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {offerings.items.map((item) => (
              <li key={item} className="flex gap-3 border-t border-border py-5">
                <Check
                  className="mt-0.5 size-5 shrink-0 text-brand-strong"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="text-lg">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
