import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { Section } from '@/components/layout/Section'
import { Stagger, StaggerItem } from '@/components/motion/Reveal'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { ServiceCard } from '@/components/shared/ServiceCard'
import { quotePath } from '@/config/paths'
import { services } from '@/content/services'

export function ServicesSection() {
  return (
    <Section aria-labelledby="home-services-heading" tone="white">
      <SectionHeading
        id="home-services-heading"
        eyebrow="Services"
        title="From a single prototype to a full print run."
        lead="Five services, one team. Pick the one that fits, or tell us what you are making and we will point you to the right one."
      />
      <Stagger className="mt-14">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <li key={service.slug}>
              <StaggerItem className="h-full">
                <ServiceCard service={service} index={index} />
              </StaggerItem>
            </li>
          ))}
          <li>
            <StaggerItem className="h-full">
              <Link
                to={quotePath()}
                className="group flex h-full flex-col justify-between rounded-lg surface-dark p-7 transition-shadow duration-300 hover:shadow-raised"
              >
                <h3 className="text-h3">Not sure which service you need?</h3>
                <span className="mt-8 flex items-center gap-2 text-sm font-medium text-brand-strong">
                  Tell us about your project
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </StaggerItem>
          </li>
        </ul>
      </Stagger>
    </Section>
  )
}
