import { type ReactNode, ViewTransition } from 'react'
import { Outlet, isRouteErrorResponse } from 'react-router'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { ErrorPanel } from '@/components/shared/ErrorPanel'
import type { Route } from './+types/site-layout'

/**
 * Public site shell: skip link, header, main, footer. The header and footer sit outside the
 * ViewTransition so they stay still while page content cross-fades.
 * Future authenticated areas (admin, account) get their own layout route.
 */
function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <SiteHeader />
      <ViewTransition>
        <main id="main" tabIndex={-1} className="min-h-svh outline-none">
          {children}
        </main>
      </ViewTransition>
      <SiteFooter />
    </>
  )
}

export default function SiteLayout() {
  return (
    <Shell>
      <Outlet />
    </Shell>
  )
}

/** Keeps the header and footer when a page throws or a lookup 404s. */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const isNotFound = isRouteErrorResponse(error) && error.status === 404

  return (
    <Shell>
      {isNotFound ? (
        <ErrorPanel
          code="404"
          title="This page could not be found."
          message="The link may be outdated, or the page may have moved."
        />
      ) : (
        <ErrorPanel
          code="Error"
          title="Something went wrong."
          message="Please try again. If the problem continues, contact us."
        />
      )}
    </Shell>
  )
}
