import { Section } from '@/components/layout/Section'
import { Stagger, StaggerItem } from '@/components/motion/Reveal'
import { CtaBand } from '@/components/shared/CtaBand'
import { PageHero } from '@/components/shared/PageHero'
import { ServiceCard } from '@/components/shared/ServiceCard'
import { paths } from '@/config/paths'
import { services } from '@/content/services'
import { ChoosingGuide } from '@/features/services/components/ChoosingGuide'
import { buildMeta } from '@/lib/seo'

export const meta = () =>
  buildMeta({
    title: 'Services',
    description:
      'Explore Kapi Forge services: 3D printing, digital printing, offset printing, custom prototyping and bulk printing, delivered across India from Delhi.',
    path: paths.services,
  })

export default function ServicesRoute() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything from prototype to print run."
        lead="Five services, one team in Delhi, delivering across India."
      />
      <Section aria-label="All services">
        <Stagger>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <li key={service.slug}>
                <StaggerItem className="h-full">
                  <ServiceCard service={service} index={index} />
                </StaggerItem>
              </li>
            ))}
          </ul>
        </Stagger>
      </Section>
      <ChoosingGuide />
      <CtaBand />
    </>
  )
}
