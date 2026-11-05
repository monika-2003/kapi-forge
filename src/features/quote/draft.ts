import { isServiceSlug } from '@/content/services'
import { type QuoteFormValues, quoteDefaults } from './schema'
import { serviceSpecs } from './specs'
import { findInvalidStep, lastStepIndex } from './steps'

/** Bump the version suffix whenever the stored shape changes; old drafts are then ignored. */
export const DRAFT_KEY = 'kapi-forge:quote-draft:v1'

type ParsedDraft = { values: QuoteFormValues; stepIndex: number }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Serialises everything except files, which are never persisted. */
export function serializeDraft(
  values: QuoteFormValues,
  stepIndex: number,
  now = Date.now(),
): string {
  const { files: _files, ...persistable } = values
  return JSON.stringify({ values: persistable, stepIndex, savedAt: now })
}

/**
 * Best-effort restore. Anything unreadable falls back to defaults, and the step is clamped so a
 * draft can never open beyond the first step that still has a validation problem.
 */
export function parseDraft(raw: string | null): ParsedDraft | null {
  if (!raw) return null

  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return null
  }
  if (!isRecord(data) || !isRecord(data.values)) return null

  const stored = data.values
  if (!isServiceSlug(stored.service)) return null
  const service = stored.service

  const customer = { ...quoteDefaults.customer }
  if (isRecord(stored.customer)) {
    for (const key of Object.keys(customer) as (keyof typeof customer)[]) {
      const value = stored.customer[key]
      if (typeof value === 'string') customer[key] = value
    }
  }

  const values: QuoteFormValues = {
    service,
    specifications: {
      ...serviceSpecs[service].defaults,
      ...(isRecord(stored.specifications) ? stored.specifications : {}),
    },
    files: [],
    customer,
    notes: typeof stored.notes === 'string' ? stored.notes : '',
  }

  const requested =
    typeof data.stepIndex === 'number' && Number.isInteger(data.stepIndex) ? data.stepIndex : 0
  const invalidAt = findInvalidStep(values)
  const furthest = invalidAt === -1 ? lastStepIndex : invalidAt
  return { values, stepIndex: Math.max(0, Math.min(requested, furthest)) }
}

// Storage can be unavailable (private mode, blocked cookies); a failed draft must never break the form.
export function readDraft(): ParsedDraft | null {
  try {
    return parseDraft(sessionStorage.getItem(DRAFT_KEY))
  } catch {
    return null
  }
}

export function writeDraft(values: QuoteFormValues, stepIndex: number): void {
  if (!values.service) return
  try {
    sessionStorage.setItem(DRAFT_KEY, serializeDraft(values, stepIndex))
  } catch {
    // Ignore: the user simply will not get a restored draft.
  }
}

export function clearDraft(): void {
  try {
    sessionStorage.removeItem(DRAFT_KEY)
  } catch {
    // Ignore.
  }
}
