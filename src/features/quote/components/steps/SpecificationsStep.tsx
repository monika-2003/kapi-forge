import { useMemo } from 'react'
import { useWatch } from 'react-hook-form'
import { FileField } from '@/components/form/FileField'
import { getServiceBySlug, isServiceSlug } from '@/content/services'
import { createFileValidator, formatAccepted } from '../../files'
import { serviceSpecs } from '../../specs'
import type { ServiceSpec } from '../../specs/types'
import { SpecField } from '../SpecField'

type SpecificationsStepProps = { restored: boolean }

export function SpecificationsStep({ restored }: SpecificationsStepProps) {
  const service = useWatch({ name: 'service' })
  const specifications = useWatch({ name: 'specifications' }) as Record<string, unknown> | undefined

  if (!isServiceSlug(service)) return null
  const spec = serviceSpecs[service]

  return (
    <div className="flex flex-col gap-8">
      <p className="text-muted-foreground">
        Service:{' '}
        <span className="font-medium text-foreground">{getServiceBySlug(service)?.name}</span>
      </p>
      {restored && (
        <p className="rounded-md border border-border bg-secondary/60 p-4 text-sm">
          We restored your earlier answers from this browser tab. Files are never saved, so please
          attach them again.
        </p>
      )}
      {spec.fields.map((field) =>
        field.visibleWhen && !field.visibleWhen(specifications ?? {}) ? null : (
          <SpecField key={`${service}-${field.name}`} field={field} />
        ),
      )}
      <SpecFiles key={service} spec={spec} />
    </div>
  )
}

function SpecFiles({ spec }: { spec: ServiceSpec }) {
  const validate = useMemo(() => createFileValidator(spec.files), [spec.files])

  return (
    <FileField
      name="files"
      label="Your files"
      optional={spec.files.requirement === 'optional'}
      description={`Accepted: ${formatAccepted(spec.files)}. Files are not uploaded through this website. You will attach them to your email or WhatsApp message on the last step.`}
      accept={spec.files.accept}
      validate={validate}
    />
  )
}
