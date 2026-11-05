import type { z } from 'zod'
import type { FieldOption } from '@/components/form/types'
import type { ServiceSlug } from '@/content/services'

type Base<TName extends string> = {
  name: TName
  label: string
  description?: string
  optional?: boolean
  /** Display rule for conditional fields, e.g. a custom size when the paper size is "custom". */
  visibleWhen?: (specs: Record<string, unknown>) => boolean
}

/** One field in a service's specification step. `SpecField` is the only renderer of these. */
export type FieldDefinition<TName extends string = string> = Base<TName> &
  (
    | { kind: 'select' | 'radio' | 'checkbox-group'; options: readonly FieldOption[] }
    | { kind: 'number'; min?: number; max?: number; unit?: string }
    | { kind: 'text' | 'textarea'; placeholder?: string; maxLength?: number }
    | { kind: 'dimensions'; unit: 'mm' | 'cm' }
  )

export type FileRule = {
  requirement: 'required' | 'optional'
  /** Lower-case extensions including the dot. */
  accept: readonly string[]
}

type KeyOf<T> = Extract<keyof T, string>

/** Written against the schema so a renamed or removed key fails type-checking. */
export type ServiceSpec<TSchema extends z.ZodType = z.ZodType> = {
  slug: ServiceSlug
  schema: TSchema
  defaults: Partial<z.input<TSchema>>
  fields: readonly FieldDefinition<KeyOf<z.input<TSchema>>>[]
  files: FileRule
}

/** Type-checks a spec against its own schema, then widens it so all five fit one registry. */
export function defineSpec<TSchema extends z.ZodType>(spec: ServiceSpec<TSchema>): ServiceSpec {
  return spec as unknown as ServiceSpec
}
