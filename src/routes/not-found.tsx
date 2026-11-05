import { ErrorPanel } from '@/components/shared/ErrorPanel'
import { buildMeta } from '@/lib/seo'

export const meta = () =>
  buildMeta({
    title: 'Page not found',
    description: 'The page you are looking for does not exist.',
    path: '/404',
    noIndex: true,
  })

export default function NotFoundRoute() {
  return (
    <ErrorPanel
      code="404"
      title="This page could not be found."
      message="The link may be outdated, or the page may have moved."
    />
  )
}
