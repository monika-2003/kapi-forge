import { Link } from 'react-router'
import { paths } from '@/config/paths'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

/** Official conch mark (cropped from the supplied logo) beside the text wordmark. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to={paths.home}
      aria-label={`${siteConfig.name} home`}
      className={cn(
        'inline-flex items-center gap-2.5 font-display text-lg font-semibold',
        className,
      )}
    >
      {/* Decorative: the wordmark beside it carries the name. */}
      <img
        src="/assets/images/kapi-forge-96.jpeg"
        alt=""
        width={36}
        height={36}
        className="size-9 rounded-md"
      />
      <span className="tracking-tight">{siteConfig.name}</span>
    </Link>
  )
}
