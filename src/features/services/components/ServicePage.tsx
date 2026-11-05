import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Section } from '@/components/layout/Section'
import { CtaBand } from '@/components/shared/CtaBand'
import { FeatureGrid } from '@/components/shared/FeatureGrid'
import { PageHero } from '@/components/shared/PageHero'
import { ProcessSteps } from '@/components/shared/ProcessSteps'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Button } from '@/components/ui/button'
import { quotePath } from '@/config/paths'
import { type ServiceContent, services } from '@/content/services'
import { ServiceFaqs } from './ServiceFaqs'
import { ServiceFileGuidance } from './ServiceFileGuidance'
import { ServiceOfferings } from './ServiceOfferings'

/** The single template behind all five service pages. Sections with no content render nothing. */
export function ServicePage({ service }: { service: ServiceContent }) {
  const number = String(services.findIndex((s) => s.slug === service.slug) + 1).padStart(2, '0')

  return (
    <>
      <PageHero
        eyebrow={service.hero.eyebrow}
        title={service.hero.headline}
        lead={service.hero.intro}
        mark={number}
        actions={
          <Button asChild variant="brand" size="lg" className="group">
            <Link to={quotePath(service.slug)}>
              Get a quote
              <ArrowRight
                className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </Button>
        }
      />

      {service.highlights.length > 0 && (
        <Section aria-labelledby="highlights-heading">
          <SectionHeading id="highlights-heading" eyebrow={service.name} title="What to expect." />
          <div className="mt-14">
            <FeatureGrid features={service.highlights} />
          </div>
        </Section>
      )}

      <ServiceOfferings offerings={service.offerings} />

      {service.process.length > 0 && (
        <Section aria-labelledby="process-heading">
          <SectionHeading id="process-heading" eyebrow="Process" title="How it works." />
          <div className="mt-14">
            <ProcessSteps steps={service.process} />
          </div>
        </Section>
      )}

      {service.fileGuidance && <ServiceFileGuidance guidance={service.fileGuidance} />}

      <ServiceFaqs faqs={service.faqs} />

      <CtaBand title={`Get a quote for ${service.name}.`} serviceSlug={service.slug} />
    </>
  )
}
