import { paths } from '@/config/paths'
import { ContactPage } from '@/features/contact/components/ContactPage'
import { buildMeta } from '@/lib/seo'

export const meta = () =>
  buildMeta({
    title: 'Contact',
    description:
      'Contact Kapi Forge in Delhi about 3D printing, digital printing, offset printing, prototyping or bulk printing orders delivered across India.',
    path: paths.contact,
  })

export default function ContactRoute() {
  return <ContactPage />
}
