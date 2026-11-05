import { Section } from '@/components/layout/Section'
import { Reveal } from '@/components/motion/Reveal'
import { SectionHeading } from '@/components/shared/SectionHeading'
import type { ServiceContent } from '@/content/services'

export function ServiceFileGuidance({
  guidance,
}: {
  guidance: NonNullable<ServiceContent['fileGuidance']>
}) {
  return (
    <Section tone="muted" aria-labelledby="file-guidance-heading">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div>
          <SectionHeading id="file-guidance-heading" eyebrow="Files" title={guidance.title} />
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Accepted formats">
            {guidance.formats.map((format) => (
              <li
                key={format}
                className="rounded-sm bg-secondary px-3 py-1.5 font-display text-sm font-medium text-secondary-foreground"
              >
                {format}
              </li>
            ))}
          </ul>
        </div>
        <Reveal>
          <ul className="flex flex-col gap-5">
            {guidance.notes.map((note) => (
              <li key={note} className="border-l-2 border-brand pl-5 text-lg">
                {note}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
