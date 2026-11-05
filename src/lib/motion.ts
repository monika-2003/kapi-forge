/**
 * Animation tokens shared by Motion and GSAP. Keep in sync with the --ease-* tokens
 * in src/styles/globals.css. See CURSOR.md "Animation" before adding new values.
 */
export const duration = {
  /** Hover, press, colour changes */
  fast: 0.15,
  /** Menus, popovers, accordions */
  base: 0.3,
  /** Scroll reveals, step transitions */
  slow: 0.6,
  /** Hero entrances only */
  slower: 0.9,
} as const

export const ease = {
  outExpo: [0.16, 1, 0.3, 1],
  inOutQuart: [0.76, 0, 0.24, 1],
} as const

/** GSAP equivalents of `ease`. */
export const gsapEase = {
  outExpo: 'expo.out',
  inOutQuart: 'power4.inOut',
} as const

/** Default viewport options for whileInView reveals: animate once, slightly before entry. */
export const revealViewport = { once: true, margin: '0px 0px -10% 0px' } as const

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.outExpo } },
} as const

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.slow, ease: ease.outExpo } },
} as const

export const stagger = (staggerChildren = 0.08, delayChildren = 0) =>
  ({ visible: { transition: { staggerChildren, delayChildren } } }) as const
