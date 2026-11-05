import { Link } from 'react-router'
import { Section } from '@/components/layout/Section'
import { Reveal } from '@/components/motion/Reveal'
import { CtaBand } from '@/components/shared/CtaBand'
import { FeatureGrid } from '@/components/shared/FeatureGrid'
import { PageHero } from '@/components/shared/PageHero'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { aboutContent } from '@/content/about'
import { services } from '@/content/services'

export function AboutPage() {
  const { hero, intro, principles, location } = aboutContent

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} lead={hero.lead} />

      <Section aria-labelledby="about-intro-heading">
        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,22rem)] lg:gap-20">
          <Reveal>
            <h2 id="about-intro-heading" className="text-h2">
              {intro.title}
            </h2>
            <div className="mt-6 flex max-w-prose-tight flex-col gap-4 text-lead text-muted-foreground">
              {intro.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <h3 className="eyebrow text-brand-strong">What we do</h3>
            <ul className="mt-5 divide-y divide-border border-y border-border">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    to={service.path}
                    className="flex items-center gap-3 py-4 font-medium transition-colors duration-150 hover:text-brand-strong"
                  >
                    <service.icon
                      className="size-5 text-muted-foreground"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section aria-labelledby="about-principles-heading" tone="muted">
        <SectionHeading
          id="about-principles-heading"
          eyebrow="How we work"
          title="Built around your brief."
        />
        <div className="mt-14">
          <FeatureGrid features={principles} />
        </div>
      </Section>

      <Section aria-labelledby="about-location-heading" containerSize="narrow">
        <Reveal>
          <h2 id="about-location-heading" className="text-h2">
            {location.title}
          </h2>
          <p className="mt-6 text-lead text-muted-foreground">{location.description}</p>
        </Reveal>
      </Section>

      <CtaBand />
    </>
  )
}
