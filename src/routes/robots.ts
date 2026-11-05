import { absoluteUrl } from '@/lib/seo'

/** Pre-rendered to build/client/robots.txt. */
export function loader() {
  const body = `User-agent: *
Allow: /

Sitemap: ${absoluteUrl('/sitemap.xml')}
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
