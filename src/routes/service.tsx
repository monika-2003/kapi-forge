import { data, useLocation } from 'react-router'
import { getServiceByPath } from '@/content/services'
import { ServicePage } from '@/features/services/components/ServicePage'
import { buildMeta } from '@/lib/seo'
import type { Route } from './+types/service'

/** One module serves all five service URLs; `routes.ts` registers it with a distinct id per URL. */
export const meta: Route.MetaFunction = ({ location }) => {
  const service = getServiceByPath(location.pathname)
  return service ? buildMeta({ ...service.seo, path: service.path }) : []
}

export default function ServiceRoute() {
  const service = getServiceByPath(useLocation().pathname)
  if (!service) throw data(null, { status: 404 })
  return <ServicePage service={service} />
}
