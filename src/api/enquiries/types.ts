export type SummaryRow = { label: string; value: string }

/** `id` lets the review step link a section back to the form step that owns it. */
export type SummarySection = { id?: string; title: string; rows: SummaryRow[] }

/** A validated enquiry rendered for humans. Used by the review step and by every handoff. */
export type EnquirySummary = {
  subject: string
  sections: SummarySection[]
  /** Free-text message or project notes. Truncated first when a link would be too long. */
  notes?: string
}

export type HandoffChannel = 'email' | 'whatsapp'

/**
 * What the UI may claim after the user acts. `submitted` and `error` exist for Release 2 (API mode);
 * Release 1 only ever produces `handoff`, which means "a link was opened", never "we received it".
 */
export type EnquiryOutcome =
  | { status: 'handoff'; channel: HandoffChannel }
  | { status: 'submitted'; reference: string }
  | { status: 'error'; message: string; retryable: boolean }
