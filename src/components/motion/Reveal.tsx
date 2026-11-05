import type { ReactNode } from 'react'
import * as m from 'motion/react-m'
import { fadeUp, revealViewport, stagger } from '@/lib/motion'

type RevealProps = { children: ReactNode; className?: string; delay?: number }

/**
 * Fades and lifts content in once as it scrolls into view. Below-the-fold content only;
 * hero content uses the CSS `animate-rise` utility so it is visible on first paint.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const variants = {
    hidden: fadeUp.hidden,
    visible: {
      ...fadeUp.visible,
      transition: { ...fadeUp.visible.transition, delay },
    },
  }

  return (
    <m.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
    >
      {children}
    </m.div>
  )
}

/** Container that reveals its `StaggerItem` children one after another. */
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      className={className}
      variants={stagger()}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
    >
      {children}
    </m.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div className={className} variants={fadeUp}>
      {children}
    </m.div>
  )
}
