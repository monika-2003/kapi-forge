import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { paths, quotePath } from '@/config/paths'
import { siteConfig } from '@/config/site'
import { HeroArt } from './HeroArt'

export function HomeHero() {
  const { city, serviceArea } = siteConfig.location

  return (
    <section aria-labelledby="home-heading" className="overflow-hidden">
      <Container className="grid items-center gap-12 py-section lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <div>
          <p className="animate-rise eyebrow text-brand-strong">
            {city} · {serviceArea}
          </p>
          <h1 id="home-heading" className="mt-6 animate-rise text-display [animation-delay:80ms]">
            Ideas take shape.{' '}
            <span className="block text-muted-foreground">We make them real.</span>
          </h1>
          <p className="mt-8 max-w-xl animate-rise text-lead text-muted-foreground [animation-delay:180ms]">
            3D printing, digital and offset printing, custom prototyping and bulk orders from one
            Delhi studio, delivered across India.
          </p>
          <div className="mt-10 flex animate-rise flex-wrap gap-3 [animation-delay:280ms]">
            <Button asChild variant="brand" size="lg" className="group">
              <Link to={quotePath()}>
                Get a quote
                <ArrowRight
                  className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to={paths.services}>Explore services</Link>
            </Button>
          </div>
        </div>
        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <HeroArt />
        </div>
      </Container>
    </section>
  )
}
