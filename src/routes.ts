import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

/*
 * Route table. All five service URLs share one module (`routes/service.tsx`), registered with a
 * distinct id per URL because React Router requires unique ids. See docs/architecture.md "Routing".
 */
export default [
  route('sitemap.xml', 'routes/sitemap.ts'),
  route('robots.txt', 'routes/robots.ts'),
  layout('routes/site-layout.tsx', [
    index('routes/home.tsx'),
    route('services', 'routes/services.tsx'),
    route('services/3d-printing', 'routes/service.tsx', { id: 'service-3d-printing' }),
    route('services/digital-printing', 'routes/service.tsx', { id: 'service-digital-printing' }),
    route('services/offset-printing', 'routes/service.tsx', { id: 'service-offset-printing' }),
    route('prototyping', 'routes/service.tsx', { id: 'service-prototyping' }),
    route('bulk-printing', 'routes/service.tsx', { id: 'service-bulk-printing' }),
    route('about', 'routes/about.tsx'),
    route('contact', 'routes/contact.tsx'),
    route('get-a-quote', 'routes/get-a-quote.tsx'),
    route('*', 'routes/not-found.tsx'),
  ]),
] satisfies RouteConfig
