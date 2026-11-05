import { Link } from 'react-router'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { paths } from '@/config/paths'
import { QuoteWizard } from '@/features/quote/components/QuoteWizard'
import { buildMeta } from '@/lib/seo'

export const meta = () =>
  buildMeta({
    title: 'Get a quote',
    description:
      'Request a quote from Kapi Forge for 3D printing, digital printing, offset printing, prototyping or bulk printing, with delivery across India.',
    path: paths.getAQuote,
  })

export default function GetAQuoteRoute() {
  return (
    <>
      <PageHero
        eyebrow="Get a quote"
        title="Tell us about your project."
        lead="Four short steps. You review everything before choosing how to send it."
      />
      <Section aria-label="Quote request" containerSize="narrow">
        <noscript>
          <p className="rounded-md border border-border bg-card p-4">
            The quote form needs JavaScript. You can reach us from the{' '}
            <Link to={paths.contact} className="font-medium underline underline-offset-4">
              contact page
            </Link>{' '}
            instead.
          </p>
        </noscript>
        <QuoteWizard />
      </Section>
    </>
  )
}
