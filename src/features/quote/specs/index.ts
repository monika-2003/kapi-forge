import type { ServiceSlug } from '@/content/services'
import { bulkPrintingSpec } from './bulk-printing'
import { digitalPrintingSpec } from './digital-printing'
import { offsetPrintingSpec } from './offset-printing'
import { prototypingSpec } from './prototyping'
import { threeDPrintingSpec } from './three-d-printing'
import type { ServiceSpec } from './types'

/** One spec per service. The wizard, schema and summary are all driven from this registry. */
export const serviceSpecs: Record<ServiceSlug, ServiceSpec> = {
  '3d-printing': threeDPrintingSpec,
  'digital-printing': digitalPrintingSpec,
  'offset-printing': offsetPrintingSpec,
  prototyping: prototypingSpec,
  'bulk-printing': bulkPrintingSpec,
}

export type { FieldDefinition, FileRule, ServiceSpec } from './types'
