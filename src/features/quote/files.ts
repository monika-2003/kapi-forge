import type { FileSelection, FileValidator } from '@/components/form/types'
import { formatFileSize } from '@/lib/format'
import type { FileRule } from './specs/types'

// TODO(business): confirm these limits. They apply to what the form accepts, not to email/WhatsApp.
export const MAX_FILES = 10
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024

export function fileExtension(name: string): string {
  const dot = name.lastIndexOf('.')
  return dot <= 0 ? '' : name.slice(dot).toLowerCase()
}

export function isSameFile(a: File, b: File): boolean {
  return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified
}

export function formatAccepted(rule: FileRule): string {
  return rule.accept.map((extension) => extension.slice(1).toUpperCase()).join(', ')
}

/** Checks each incoming file on its own, so one bad file never blocks the rest. */
export function validateFiles(incoming: File[], current: File[], rule: FileRule): FileSelection {
  const accepted: File[] = []
  const rejected: FileSelection['rejected'] = []

  for (const file of incoming) {
    const extension = fileExtension(file.name)
    let reason: string | null = null

    if (!rule.accept.includes(extension)) {
      reason = `${extension ? extension.slice(1).toUpperCase() : 'This'} files are not accepted. Use ${formatAccepted(rule)}.`
    } else if (file.size === 0) {
      reason = 'The file is empty.'
    } else if (file.size > MAX_FILE_SIZE_BYTES) {
      reason = `The file is larger than ${formatFileSize(MAX_FILE_SIZE_BYTES)}.`
    } else if ([...current, ...accepted].some((existing) => isSameFile(existing, file))) {
      reason = 'The file is already added.'
    } else if (current.length + accepted.length >= MAX_FILES) {
      reason = `You can add up to ${MAX_FILES} files.`
    }

    if (reason) rejected.push({ name: file.name, reason })
    else accepted.push(file)
  }

  return { accepted, rejected }
}

export function createFileValidator(rule: FileRule): FileValidator {
  return (incoming, current) => validateFiles(incoming, current, rule)
}

/** Keeps only files the rule still accepts, used when the service changes. */
export function keepAcceptedFiles(files: File[], rule: FileRule): File[] {
  return files.filter((file) => rule.accept.includes(fileExtension(file.name)))
}
