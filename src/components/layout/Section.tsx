import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import { Container } from './Container'

const tones = {
  default: '',
  muted: 'bg-muted',
  white: 'bg-card',
  dark: 'surface-dark',
} as const

type SectionProps = ComponentProps<'section'> & {
  tone?: keyof typeof tones
  containerSize?: ComponentProps<typeof Container>['size']
}

export function Section({
  tone = 'default',
  containerSize,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn('py-section', tones[tone], className)} {...props}>
      <Container size={containerSize}>{children}</Container>
    </section>
  )
}
