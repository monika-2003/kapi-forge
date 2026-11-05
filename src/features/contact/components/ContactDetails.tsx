import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { type ContactLink, getContactLinks } from '@/lib/contact'

const icons = { email: Mail, phone: Phone, whatsapp: MessageCircle } satisfies Record<
  ContactLink['kind'],
  unknown
>

/** Renders only confirmed channels from `siteConfig.contact`. Nothing is shown for `null` values. */
export function ContactDetails() {
  const links = getContactLinks()
  const { location } = siteConfig

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-h4">Get in touch</h2>
        {links.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-4">
            {links.map((link) => {
              const Icon = icons[link.kind]
              return (
                <li key={link.kind}>
                  <a href={link.href} className="group flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                      <Icon className="size-5" strokeWidth={1.5} aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm text-muted-foreground">{link.label}</span>
                      <span className="font-medium group-hover:text-brand-strong">
                        {link.value}
                      </span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="mt-3 text-muted-foreground">
            Our direct contact details will be published here soon. Until then, use the form to
            prepare your enquiry.
          </p>
        )}
      </div>

      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
          <MapPin className="size-5" strokeWidth={1.5} aria-hidden />
        </span>
        <div>
          <h2 className="text-h4">Location</h2>
          <p className="mt-1 text-muted-foreground">
            {[location.streetAddress, location.city, location.postalCode]
              .filter(Boolean)
              .join(', ')}
            , {location.country}. Serving customers across India.
          </p>
        </div>
      </div>
    </div>
  )
}
