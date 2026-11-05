import type { ReactNode } from 'react'
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse } from 'react-router'
import soraLatin from '@fontsource-variable/sora/files/sora-latin-wght-normal.woff2?url'
import interLatin from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url'
import type { Route } from './+types/root'
import '@/styles/globals.css'

export const links: Route.LinksFunction = () => [
  { rel: 'icon', href: '/assets/images/kapi-forge.jpeg', type: 'image/jpeg' },
  ...[soraLatin, interLatin].map((href) => ({
    rel: 'preload',
    href,
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous' as const,
  })),
]

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#101820" />
        <noscript>
          {/* Scroll reveals start hidden; show everything when JavaScript is unavailable. */}
          <style>
            {
              '[style*="opacity: 0"],[style*="opacity:0"]{opacity:1!important;transform:none!important}'
            }
          </style>
        </noscript>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <Outlet />
      </LazyMotion>
    </MotionConfig>
  )
}

/** Last-resort boundary. Page-level errors are caught by the site layout's boundary first. */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const isNotFound = isRouteErrorResponse(error) && error.status === 404

  return (
    <main className="mx-auto flex min-h-svh max-w-prose-tight flex-col justify-center gap-4 px-gutter">
      <p className="eyebrow text-brand-strong">{isNotFound ? '404' : 'Error'}</p>
      <h1 className="text-h2">
        {isNotFound ? 'This page could not be found.' : 'Something went wrong.'}
      </h1>
      <p className="text-muted-foreground">
        <a href="/" className="underline underline-offset-4">
          Return to the homepage
        </a>
      </p>
      {import.meta.env.DEV && error instanceof Error && (
        <pre className="overflow-x-auto text-sm">{error.stack}</pre>
      )}
    </main>
  )
}
