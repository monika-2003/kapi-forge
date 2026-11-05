import { FileText, Upload, X } from 'lucide-react'
import { type DragEvent, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { formatFileSize } from '@/lib/format'
import { cn } from '@/lib/utils'
import { type FieldBaseProps, FieldShell } from './FieldShell'
import type { FileSelection, FileValidator } from './types'
import { describedBy, useFieldError, useFieldIds, useRevalidate } from './useField'

type FileFieldProps = FieldBaseProps & {
  /** Extensions including the dot, passed to the native `accept` attribute. */
  accept: readonly string[]
  validate: FileValidator
}

/**
 * Native multi-file input inside a keyboard-accessible drop zone. Files are held in form state
 * only (never read, encoded or stored). Invalid files are rejected with a per-file reason.
 */
export function FileField({
  name,
  label,
  description,
  optional,
  className,
  accept,
  validate,
}: FileFieldProps) {
  const { control } = useFormContext()
  const error = useFieldError(name)
  const ids = useFieldIds()
  const revalidate = useRevalidate(name, !!error)
  const [rejected, setRejected] = useState<FileSelection['rejected']>([])
  const [dragging, setDragging] = useState(false)

  return (
    <FieldShell
      {...ids}
      group
      label={label}
      description={description}
      optional={optional}
      error={error}
      className={className}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const current: File[] = Array.isArray(field.value) ? field.value : []

          function addFiles(incoming: File[]) {
            const result = validate(incoming, current)
            setRejected(result.rejected)
            if (result.accepted.length > 0) {
              field.onChange([...current, ...result.accepted])
              revalidate()
            }
          }

          function onDrop(event: DragEvent<HTMLDivElement>) {
            event.preventDefault()
            setDragging(false)
            addFiles(Array.from(event.dataTransfer.files))
          }

          return (
            <>
              {/* The wrapper only receives drag events; keyboard users use the native input in the label. */}
              <div
                role="presentation"
                onDragOver={(event) => {
                  event.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
              >
                <label
                  htmlFor={ids.id}
                  className={cn(
                    'flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-input bg-card px-6 py-8 text-center transition-colors duration-150 hover:border-foreground/60 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring',
                    dragging && 'border-primary bg-secondary/60',
                    error && 'border-destructive',
                  )}
                >
                  <Upload className="size-6 text-muted-foreground" strokeWidth={1.5} aria-hidden />
                  <span className="font-medium">Choose files or drop them here</span>
                  <span className="text-sm text-muted-foreground">
                    {accept.map((extension) => extension.slice(1).toUpperCase()).join(', ')}
                  </span>
                  <input
                    id={ids.id}
                    ref={field.ref}
                    type="file"
                    multiple
                    accept={accept.join(',')}
                    className="sr-only"
                    aria-invalid={error ? true : undefined}
                    aria-describedby={describedBy(ids, {
                      hasDescription: !!description,
                      hasError: !!error,
                    })}
                    onBlur={field.onBlur}
                    onChange={(event) => {
                      addFiles(Array.from(event.target.files ?? []))
                      // Clear so choosing the same file again still fires `change`.
                      event.target.value = ''
                    }}
                  />
                </label>
              </div>

              {rejected.length > 0 && (
                <ul
                  className="flex flex-col gap-1 text-sm text-destructive"
                  aria-label="Files that could not be added"
                >
                  {rejected.map((item, index) => (
                    <li key={`${item.name}-${index}`}>
                      <span className="font-medium">{item.name}:</span> {item.reason}
                    </li>
                  ))}
                </ul>
              )}

              {current.length > 0 && (
                <ul aria-label="Selected files" className="flex flex-col gap-2">
                  {current.map((file, index) => (
                    <li
                      key={`${file.name}-${file.size}-${file.lastModified}`}
                      className="flex items-center gap-3 rounded-md border border-border bg-card py-2 pr-2 pl-3"
                    >
                      <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">
                        {file.name}
                      </span>
                      <span className="shrink-0 text-sm text-muted-foreground">
                        {formatFileSize(file.size)}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove ${file.name}`}
                        onClick={() => {
                          field.onChange(current.filter((_, i) => i !== index))
                          revalidate()
                        }}
                      >
                        <X aria-hidden />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )
        }}
      />
    </FieldShell>
  )
}
