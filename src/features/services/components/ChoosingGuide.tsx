import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { Section } from '@/components/layout/Section'
import { Stagger, StaggerItem } from '@/components/motion/Reveal'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { paths } from '@/config/paths'

const guide = [
  { situation: 'I have a 3D model to make', service: '3D Printing', href: paths.threeDPrinting },
  {
    situation: 'I have an idea but no finished design',
    service: 'Custom Prototyping',
    href: paths.prototyping,
  },
  {
    situation: 'I need a smaller print run',
    service: 'Digital Printing',
    href: paths.digitalPrinting,
  },
  {
    situation: 'I need a larger print run',
    service: 'Offset Printing',
    href: paths.offsetPrinting,
  },
  {
    situation: 'I am ordering in large volumes',
    service: 'Bulk Printing',
    href: paths.bulkPrinting,
  },
] as const

export function ChoosingGuide() {
  return (
    <Section tone="white" aria-labelledby="choosing-heading">
      <SectionHeading
        id="choosing-heading"
        eyebrow="Where to start"
        title="Which service is right for you?"
        lead="Unsure? Pick the closest match, or ask us in the quote form."
      />
      <Stagger className="mt-12">
        <ul className="max-w-3xl">
          {guide.map((row) => (
            <li key={row.service}>
              <StaggerItem>
                <Link
                  to={row.href}
                  className="group flex items-center justify-between gap-4 border-t border-border py-5 transition-colors duration-150 hover:text-brand-strong"
                >
                  <span className="text-lg">{row.situation}</span>
                  <span className="flex shrink-0 items-center gap-2 font-display font-medium">
                    {row.service}
                    <ArrowUpRight
                      className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </StaggerItem>
            </li>
          ))}
        </ul>
      </Stagger>
    </Section>
  )
}
