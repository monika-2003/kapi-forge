import * as React from 'react'
import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-11 w-full min-w-0 rounded-md border border-input bg-card px-3.5 text-base text-foreground transition-colors duration-150 placeholder:text-muted-foreground hover:border-foreground/60 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:bg-destructive/5',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
