import { paths } from '@/config/paths'
import { aboutContent } from '@/content/about'
import { AboutPage } from '@/features/about/components/AboutPage'
import { buildMeta } from '@/lib/seo'

export const meta = () =>
  buildMeta({
    title: aboutContent.seo.title,
    description: aboutContent.seo.description,
    path: paths.about,
  })

export default function AboutRoute() {
  return <AboutPage />
}
