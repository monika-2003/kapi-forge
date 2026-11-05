import { CtaBand } from '@/components/shared/CtaBand'
import { JsonLd } from '@/components/shared/JsonLd'
import { ApproachSection } from '@/features/home/components/ApproachSection'
import { HomeHero } from '@/features/home/components/HomeHero'
import { ServicesSection } from '@/features/home/components/ServicesSection'
import { paths } from '@/config/paths'
import { buildMeta, organizationJsonLd } from '@/lib/seo'

export const meta = () =>
  buildMeta({
    description:
      'Kapi Forge is a Delhi-based printing and prototyping studio offering 3D printing, digital, offset and bulk printing, and custom prototyping across India.',
    path: paths.home,
  })

export default function HomeRoute() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <HomeHero />
      <ServicesSection />
      <ApproachSection />
      <CtaBand />
    </>
  )
}
