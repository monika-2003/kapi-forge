import { Menu } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { companyLinks } from '@/config/navigation'
import { paths, quotePath } from '@/config/paths'
import { services } from '@/content/services'

const itemClass =
  'flex min-h-12 items-center rounded-md px-3 text-lg font-medium hover:bg-foreground/8'

/** Navigation drawer for viewports below `lg`. Every link closes the drawer. */
export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu aria-hidden />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="pr-10">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
        </div>
        <nav aria-label="Mobile" className="-mx-3 flex flex-1 flex-col gap-6 overflow-y-auto">
          <ul className="flex flex-col">
            <li>
              <SheetClose asChild>
                <Link to={paths.services} className={itemClass}>
                  All services
                </Link>
              </SheetClose>
            </li>
            {services.map((service) => (
              <li key={service.slug}>
                <SheetClose asChild>
                  <Link
                    to={service.path}
                    className={`${itemClass} pl-8 text-base text-muted-foreground`}
                  >
                    {service.name}
                  </Link>
                </SheetClose>
              </li>
            ))}
            {companyLinks.map((link) => (
              <li key={link.href}>
                <SheetClose asChild>
                  <Link to={link.href} className={itemClass}>
                    {link.label}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>
        <SheetClose asChild>
          <Button asChild variant="brand" size="lg">
            <Link to={quotePath()}>Get a quote</Link>
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  )
}
