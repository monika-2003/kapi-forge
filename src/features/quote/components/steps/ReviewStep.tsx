import { Pencil } from 'lucide-react'
import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { EnquiryActions } from '@/components/shared/EnquiryActions'
import { Button } from '@/components/ui/button'
import type { QuoteFormValues } from '../../schema'
import { type QuoteStepId, stepIndexOf } from '../../steps'
import { buildQuoteSummary } from '../../summary'

const sectionStep: Record<string, QuoteStepId> = {
  service: 'service',
  specifications: 'specifications',
  files: 'specifications',
  customer: 'details',
}

type ReviewStepProps = { onEdit: (stepIndex: number) => void; onStartNew: () => void }

export function ReviewStep({ onEdit, onStartNew }: ReviewStepProps) {
  const { getValues } = useFormContext<QuoteFormValues>()
  const summary = useMemo(() => buildQuoteSummary(getValues()), [getValues])
  const hasFiles = summary.sections.some(
    (section) => section.id === 'files' && section.rows.length > 0,
  )

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        {summary.sections
          .filter((section) => section.rows.length > 0)
          .map((section) => {
            const target = section.id ? sectionStep[section.id] : undefined
            return (
              <section
                key={section.id ?? section.title}
                aria-label={section.title}
                className="rounded-lg border border-border bg-card p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-h4">{section.title}</h3>
                  {target && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={`Edit ${section.title}`}
                      onClick={() => onEdit(stepIndexOf(target))}
                    >
                      <Pencil aria-hidden />
                      Edit
                    </Button>
                  )}
                </div>
                <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-[minmax(0,12rem)_1fr]">
                  {section.rows.map((row, index) => (
                    <div key={`${row.label}-${index}`} className="contents">
                      <dt className="text-sm text-muted-foreground">{row.label}</dt>
                      <dd className="font-medium break-words">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )
          })}
        {summary.notes && (
          <section aria-label="Notes" className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-h4">Notes</h3>
            <p className="mt-4 break-words whitespace-pre-line">{summary.notes}</p>
          </section>
        )}
      </div>

      <section aria-labelledby="send-heading" className="rounded-lg bg-secondary/60 p-6">
        <h3 id="send-heading" className="text-h4">
          Send your enquiry
        </h3>
        <p className="mt-2 mb-5 text-muted-foreground">
          We receive your enquiry only when you send it from your own email or WhatsApp.
        </p>
        <EnquiryActions
          summary={summary}
          attachmentNote={
            hasFiles ? 'Attach your files to the message before you send it.' : undefined
          }
        />
      </section>

      <div>
        <Button type="button" variant="ghost" onClick={onStartNew}>
          Start a new quote
        </Button>
      </div>
    </div>
  )
}
