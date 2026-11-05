import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const sizes = {
  site: 'max-w-site',
  narrow: 'max-w-narrow',
  prose: 'max-w-prose-tight',
} as const

type ContainerProps = ComponentProps<'div'> & { size?: keyof typeof sizes }

export function Container({ size = 'site', className, ...props }: ContainerProps) {
  return <div className={cn('mx-auto w-full px-gutter', sizes[size], className)} {...props} />
}
