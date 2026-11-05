/**
 * The only module that imports GSAP. Import { gsap, ScrollTrigger, useGSAP } from here
 * so plugins are registered once and GSAP stays out of routes that do not use it.
 */
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export { gsap, ScrollTrigger, useGSAP }
