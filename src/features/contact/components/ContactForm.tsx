import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import type { EnquirySummary } from '@/api/enquiries/types'
import { SelectField } from '@/components/form/SelectField'
import { TextField } from '@/components/form/TextField'
import { TextareaField } from '@/components/form/TextareaField'
import { EnquiryActions } from '@/components/shared/EnquiryActions'
import { Button } from '@/components/ui/button'
import {
  type ContactValues,
  contactDefaults,
  contactSchema,
  contactServiceOptions,
} from '../schema'
import { buildContactSummary } from '../summary'

/**
 * Validates the enquiry, then offers the real send options (email / WhatsApp / copy).
 * Nothing is sent from the page: the user finishes in their own app.
 */
export function ContactForm() {
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: contactDefaults,
    mode: 'onTouched',
  })
  const [summary, setSummary] = useState<EnquirySummary | null>(null)
  const { subscribe } = form

  // Editing after review invalidates the prepared summary, so the links never carry stale text.
  useEffect(
    () => subscribe({ formState: { values: true }, callback: () => setSummary(null) }),
    [subscribe],
  )

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit((values) => setSummary(buildContactSummary(values)))}
        className="flex flex-col gap-6"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField name="name" label="Name" autoComplete="name" />
          <TextField name="email" label="Email" type="email" autoComplete="email" />
          <TextField
            name="phone"
            label="Phone"
            type="tel"
            optional
            autoComplete="tel"
            inputMode="tel"
          />
          <SelectField
            name="service"
            label="Interested in"
            optional
            placeholder="Select a service"
            options={contactServiceOptions}
          />
        </div>
        <TextareaField
          name="message"
          label="Message"
          rows={6}
          description="Tell us what you need made or printed, including quantities and timing if you know them."
        />

        <div>
          <Button type="submit" size="lg" variant="default">
            Prepare my enquiry
          </Button>
        </div>

        {summary && (
          <section
            className="rounded-lg border border-border bg-card p-6 shadow-card"
            aria-labelledby="send-heading"
          >
            <h3 id="send-heading" className="text-h4">
              Your enquiry is ready to send
            </h3>
            <p className="mt-2 mb-5 text-muted-foreground">
              Choose how you would like to send it. Nothing has been sent yet.
            </p>
            <EnquiryActions summary={summary} />
          </section>
        )}
      </form>
    </FormProvider>
  )
}
