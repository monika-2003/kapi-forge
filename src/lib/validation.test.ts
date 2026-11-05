import { describe, expect, it } from 'vitest'
import {
  emailField,
  indianMobileField,
  optionalFutureDateField,
  optionalIndianMobileField,
  optionalPinCodeField,
  pinCodeField,
  todayIso,
  toOptionalNumber,
} from './validation'

describe('indianMobileField', () => {
  it.each(['9876543210', '+91 98765 43210', '098765-43210', '919876543210'])(
    'accepts %s',
    (value) => {
      expect(indianMobileField.safeParse(value).success).toBe(true)
    },
  )

  it.each(['', '12345', '5876543210', '98765432101234'])('rejects "%s"', (value) => {
    expect(indianMobileField.safeParse(value).success).toBe(false)
  })
})

describe('optional fields', () => {
  it('accept empty and validate otherwise, with specific messages', () => {
    expect(optionalIndianMobileField.safeParse('').success).toBe(true)
    const bad = optionalIndianMobileField.safeParse('123')
    expect(bad.success ? '' : bad.error.issues[0]?.message).toBe(
      'Enter a 10-digit Indian mobile number',
    )
    expect(optionalPinCodeField.safeParse('').success).toBe(true)
    expect(optionalPinCodeField.safeParse('1100').success).toBe(false)
  })
})

describe('pinCodeField', () => {
  it('accepts six digits not starting with 0', () => {
    expect(pinCodeField.safeParse('110001').success).toBe(true)
    expect(pinCodeField.safeParse('010001').success).toBe(false)
    expect(pinCodeField.safeParse('11001').success).toBe(false)
  })
})

describe('emailField', () => {
  it('trims and validates', () => {
    expect(emailField.parse('  a@b.co ')).toBe('a@b.co')
    expect(emailField.safeParse('not-an-email').success).toBe(false)
    expect(emailField.safeParse('').success).toBe(false)
  })
})

describe('optionalFutureDateField', () => {
  it('allows empty, today and future dates but not past dates', () => {
    expect(optionalFutureDateField.safeParse('').success).toBe(true)
    expect(optionalFutureDateField.safeParse(todayIso()).success).toBe(true)
    expect(optionalFutureDateField.safeParse('2999-01-01').success).toBe(true)
    expect(optionalFutureDateField.safeParse('2000-01-01').success).toBe(false)
  })
})

describe('toOptionalNumber', () => {
  it('maps blanks to undefined and numeric strings to numbers', () => {
    expect(toOptionalNumber('')).toBeUndefined()
    expect(toOptionalNumber('12')).toBe(12)
    expect(toOptionalNumber('abc')).toBeUndefined()
  })
})
