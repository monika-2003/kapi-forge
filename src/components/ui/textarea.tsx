import * as React from 'react'
import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex min-h-28 w-full resize-y rounded-md border border-input bg-card px-3.5 py-3 text-base text-foreground transition-colors duration-150 placeholder:text-muted-foreground hover:border-foreground/60 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:bg-destructive/5',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
