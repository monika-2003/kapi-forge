import { ChevronDown } from 'lucide-react'
import { NavigationMenu } from 'radix-ui'
import { Link, useLocation } from 'react-router'
import { Button } from '@/components/ui/button'
import { companyLinks } from '@/config/navigation'
import { paths, quotePath } from '@/config/paths'
import { services } from '@/content/services'
import { cn } from '@/lib/utils'
import { Container } from './Container'
import { Logo } from './Logo'
import { MobileNav } from './MobileNav'

const linkClass =
  'inline-flex h-11 items-center gap-1 rounded-md px-3 text-sm font-medium text-foreground/75 transition-colors duration-150 hover:text-foreground aria-[current=page]:text-foreground data-open:text-foreground'

export function SiteHeader() {
  const { pathname } = useLocation()
  const isServicesActive = pathname === paths.services || services.some((s) => s.path === pathname)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Logo />

        <NavigationMenu.Root aria-label="Primary" className="hidden lg:block">
          <NavigationMenu.List className="flex items-center gap-1">
            <NavigationMenu.Item className="relative">
              <NavigationMenu.Trigger
                className={cn(linkClass, 'group', isServicesActive && 'text-foreground')}
              >
                Services
                <ChevronDown
                  className="size-4 transition-transform duration-300 ease-out-expo group-data-open:rotate-180"
                  aria-hidden
                />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="absolute top-full left-0 z-50 w-[22rem] pt-2 data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-top-1 data-closed:animate-out data-closed:fade-out-0">
                <ul className="rounded-lg border border-border bg-popover p-2 shadow-raised">
                  <li>
                    <NavigationMenu.Link asChild>
                      <Link
                        to={paths.services}
                        aria-current={pathname === paths.services ? 'page' : undefined}
                        className="block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
                      >
                        All services
                      </Link>
                    </NavigationMenu.Link>
                  </li>
                  {services.map((service) => (
                    <li key={service.slug}>
                      <NavigationMenu.Link asChild>
                        <Link
                          to={service.path}
                          aria-current={pathname === service.path ? 'page' : undefined}
                          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent aria-[current=page]:bg-accent"
                        >
                          <service.icon
                            className="size-5 text-brand-strong"
                            strokeWidth={1.5}
                            aria-hidden
                          />
                          <span className="font-medium">{service.name}</span>
                        </Link>
                      </NavigationMenu.Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            {companyLinks.map((link) => (
              <NavigationMenu.Item key={link.href}>
                <NavigationMenu.Link asChild>
                  <Link
                    to={link.href}
                    aria-current={pathname === link.href ? 'page' : undefined}
                    className={linkClass}
                  >
                    {link.label}
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            ))}
          </NavigationMenu.List>
        </NavigationMenu.Root>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex">
            <Link to={quotePath()}>Get a quote</Link>
          </Button>
          <MobileNav />
        </div>
      </Container>
    </header>
  )
}
