import { Link } from 'react-router'
import { companyLinks } from '@/config/navigation'
import { quotePath } from '@/config/paths'
import { siteConfig } from '@/config/site'
import { services } from '@/content/services'
import { getContactLinks } from '@/lib/contact'
import { Container } from './Container'
import { Logo } from './Logo'

const linkClass = 'text-muted-foreground transition-colors duration-150 hover:text-foreground'

export function SiteFooter() {
  const contactLinks = getContactLinks()
  const { city, country } = siteConfig.location

  return (
    <footer className="border-t border-border surface-dark">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col items-start gap-4">
          <Logo />
          <p className="max-w-xs text-muted-foreground">{siteConfig.tagline}</p>
          <p className="text-sm text-muted-foreground">
            Based in {city}, {country}. Serving customers across India.
          </p>
        </div>

        <nav aria-label="Services">
          <h2 className="eyebrow text-brand-strong">Services</h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {services.map((service) => (
              <li key={service.slug}>
                <Link to={service.path} className={linkClass}>
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <h2 className="eyebrow text-brand-strong">Company</h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to={quotePath()} className={linkClass}>
                Get a quote
              </Link>
            </li>
          </ul>
        </nav>

        {contactLinks.length > 0 && (
          <div>
            <h2 className="eyebrow text-brand-strong">Contact</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {contactLinks.map((link) => (
                <li key={link.kind}>
                  <a href={link.href} className={linkClass}>
                    {link.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>

      <Container className="border-t border-border py-6 text-sm text-muted-foreground">
        <p>&copy; {siteConfig.name}. All rights reserved.</p>
      </Container>
    </footer>
  )
}
