import { Link } from 'react-router'
import { Section } from '@/components/layout/Section'
import { PageHero } from '@/components/shared/PageHero'
import { paths } from '@/config/paths'
import { ContactDetails } from './ContactDetails'
import { ContactForm } from './ContactForm'

export function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to Kapi Forge."
        lead="Ask a question or describe what you need. If you already know the specifications, the quote form will get you a more precise answer."
      />
      <Section aria-label="Contact">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-20">
          <div>
            <h2 className="text-h2">Send an enquiry</h2>
            <p className="mt-3 mb-10 text-muted-foreground">
              Looking for a price? Use the{' '}
              <Link
                to={paths.getAQuote}
                className="font-medium text-foreground underline underline-offset-4 hover:text-brand-strong"
              >
                quote form
              </Link>{' '}
              so we have the details we need.
            </p>
            <ContactForm />
          </div>
          <aside aria-label="Contact details">
            <ContactDetails />
          </aside>
        </div>
      </Section>
    </>
  )
}
