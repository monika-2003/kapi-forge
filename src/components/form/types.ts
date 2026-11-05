export type FieldOption = {
  value: string
  label: string
  description?: string
}

export type FileSelection = {
  accepted: File[]
  rejected: { name: string; reason: string }[]
}

/** Decides which of the `incoming` files may join the `current` ones. Provided by the owning feature. */
export type FileValidator = (incoming: File[], current: File[]) => FileSelection
