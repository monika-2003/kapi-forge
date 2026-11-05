import { Check, Copy, Mail, MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { buildEmailHandoff, buildWhatsAppHandoff, formatEnquiryText } from '@/api/enquiries/handoff'
import type { EnquiryOutcome, EnquirySummary } from '@/api/enquiries/types'
import { Button } from '@/components/ui/button'

type EnquiryActionsProps = {
  summary: EnquirySummary
  /** Extra sentence shown after a handoff, e.g. a reminder to attach files. */
  attachmentNote?: string
}

type CopyState = 'idle' | 'copied' | 'failed'

/**
 * Release 1 enquiry handoff. Renders one real link per configured channel and a copy button.
 * It never claims the enquiry was submitted or received: the user finishes sending in their own app.
 * Release 2 swaps this for a submit button (see docs/future-backend-integration.md).
 */
export function EnquiryActions({ summary, attachmentNote }: EnquiryActionsProps) {
  const [outcome, setOutcome] = useState<EnquiryOutcome | null>(null)
  const [copyState, setCopyState] = useState<CopyState>('idle')

  const emailHref = buildEmailHandoff(summary)
  const whatsappHref = buildWhatsAppHandoff(summary)
  const hasChannel = Boolean(emailHref || whatsappHref)

  useEffect(() => {
    if (!hasChannel && import.meta.env.DEV) {
      console.warn(
        'No contact channel is configured in src/config/site.ts; enquiries can only be copied.',
      )
    }
  }, [hasChannel])

  async function copyDetails() {
    try {
      await navigator.clipboard.writeText(`${summary.subject}\n\n${formatEnquiryText(summary)}`)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        {emailHref && (
          <Button asChild variant="brand" size="lg">
            <a href={emailHref} onClick={() => setOutcome({ status: 'handoff', channel: 'email' })}>
              <Mail aria-hidden />
              Continue in email
            </a>
          </Button>
        )}
        {whatsappHref && (
          <Button asChild variant={emailHref ? 'outline' : 'brand'} size="lg">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOutcome({ status: 'handoff', channel: 'whatsapp' })}
            >
              <MessageCircle aria-hidden />
              Continue on WhatsApp
            </a>
          </Button>
        )}
        <Button
          type="button"
          variant={hasChannel ? 'ghost' : 'brand'}
          size="lg"
          onClick={copyDetails}
        >
          {copyState === 'copied' ? <Check aria-hidden /> : <Copy aria-hidden />}
          {copyState === 'copied' ? 'Details copied' : 'Copy enquiry details'}
        </Button>
      </div>

      <output className="block text-sm text-muted-foreground">
        {!hasChannel && (
          <p>
            Our email and WhatsApp details are not published yet. You can copy your enquiry details
            and keep them until they are.
          </p>
        )}
        {outcome?.status === 'handoff' && outcome.channel === 'email' && (
          <p>
            Your email app should open with your enquiry. Press send there to finish. We receive
            your enquiry only when you send it.
            {attachmentNote ? ` ${attachmentNote}` : ''}
          </p>
        )}
        {outcome?.status === 'handoff' && outcome.channel === 'whatsapp' && (
          <p>
            WhatsApp should open with your enquiry. We receive your enquiry only when you send the
            message.
            {attachmentNote ? ` ${attachmentNote}` : ''}
          </p>
        )}
        {copyState === 'failed' && (
          <p>Your browser blocked copying. Select the details on screen and copy them manually.</p>
        )}
      </output>
    </div>
  )
}
