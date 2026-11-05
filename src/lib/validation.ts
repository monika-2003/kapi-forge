import { z } from 'zod'

/**
 * Shared Zod primitives. Messages are written for customers, not developers.
 * Feature schemas (contact, quote) compose these; do not redefine them elsewhere.
 * Optional text fields hold `''` when untouched (inputs are controlled), so "optional" means
 * "empty or valid". A `z.union` would hide the specific message behind "Invalid input".
 */

export const nameField = z
  .string()
  .trim()
  .min(2, 'Enter your name')
  .max(100, 'Name must be 100 characters or fewer')

export const emailField = z
  .string()
  .trim()
  .min(1, 'Enter your email address')
  .pipe(z.email('Enter a valid email address'))

const INDIAN_MOBILE = /^(?:\+?91|0)?[6-9]\d{9}$/
const MOBILE_MESSAGE = 'Enter a 10-digit Indian mobile number'

/** Spaces, dashes and a +91 / 91 / 0 prefix are accepted. */
export function isIndianMobile(value: string): boolean {
  return INDIAN_MOBILE.test(value.replace(/[\s-]/g, ''))
}

export const indianMobileField = z
  .string()
  .trim()
  .min(1, 'Enter your phone number')
  .refine(isIndianMobile, { message: MOBILE_MESSAGE })

export const optionalIndianMobileField = z
  .string()
  .trim()
  .refine((value) => value === '' || isIndianMobile(value), { message: MOBILE_MESSAGE })

const PIN_CODE = /^[1-9]\d{5}$/
const PIN_MESSAGE = 'Enter a 6-digit PIN code'

export const pinCodeField = z
  .string()
  .trim()
  .min(1, 'Enter your PIN code')
  .regex(PIN_CODE, PIN_MESSAGE)

export const optionalPinCodeField = z
  .string()
  .trim()
  .refine((value) => value === '' || PIN_CODE.test(value), { message: PIN_MESSAGE })

/** `YYYY-MM-DD` from an `<input type="date">`, today or later. Empty is allowed. */
export const optionalFutureDateField = z
  .string()
  .refine((value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: 'Enter a valid date',
  })
  .refine((value) => value === '' || value >= todayIso(), {
    message: 'Choose today or a later date',
  })

export function todayIso(now = new Date()): string {
  const offsetMs = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10)
}

/** For `<input type="number">`: empty becomes `undefined` instead of `NaN` or `0`. */
export function toOptionalNumber(value: unknown): number | undefined {
  if (value === '' || value === null || value === undefined) return undefined
  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}
