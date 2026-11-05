import { describe, expect, it } from 'vitest'
import { serviceSlugs } from '@/content/services'
import { DRAFT_KEY, parseDraft, serializeDraft } from './draft'
import { MAX_FILES, MAX_FILE_SIZE_BYTES, validateFiles } from './files'
import { type QuoteFormValues, quoteDefaults, quoteSchema } from './schema'
import { serviceSpecs } from './specs'
import { findInvalidStep, lastStepIndex, quoteSteps } from './steps'
import { buildQuoteSummary, formatFieldValue } from './summary'

const customer = {
  name: 'Asha Rao',
  company: '',
  email: 'asha@example.com',
  phone: '98765 43210',
  city: 'Delhi',
  pinCode: '110001',
  address: '12 Example Street, Karol Bagh',
  requiredBy: '',
}

function file(name: string, size = 1024) {
  return new File([new Uint8Array(size)], name, { lastModified: 1 })
}

function valid3d(overrides: Partial<QuoteFormValues> = {}): QuoteFormValues {
  return {
    ...quoteDefaults,
    service: '3d-printing',
    specifications: { ...serviceSpecs['3d-printing'].defaults },
    files: [file('part.stl')],
    customer,
    ...overrides,
  }
}

describe('service spec registry', () => {
  it('has a spec for every service in the catalogue', () => {
    expect(Object.keys(serviceSpecs).sort()).toEqual([...serviceSlugs].sort())
    for (const slug of serviceSlugs) expect(serviceSpecs[slug].slug).toBe(slug)
  })

  it('declares unique field names and lower-case dotted file extensions', () => {
    for (const spec of Object.values(serviceSpecs)) {
      const names = spec.fields.map((field) => field.name)
      expect(new Set(names).size).toBe(names.length)
      for (const extension of spec.files.accept) expect(extension).toMatch(/^\.[a-z0-9]+$/)
    }
  })

  it('only offers options with unique values', () => {
    for (const spec of Object.values(serviceSpecs)) {
      for (const field of spec.fields) {
        if ('options' in field) {
          const values = field.options.map((option) => option.value)
          expect(new Set(values).size).toBe(values.length)
        }
      }
    }
  })
})

describe('quoteSchema', () => {
  it('accepts a valid 3D printing enquiry', () => {
    expect(quoteSchema.safeParse(valid3d()).success).toBe(true)
  })

  it('requires files for 3D printing but not for digital printing', () => {
    expect(quoteSchema.safeParse(valid3d({ files: [] })).success).toBe(false)

    const digital: QuoteFormValues = {
      ...valid3d(),
      service: 'digital-printing',
      specifications: {
        ...serviceSpecs['digital-printing'].defaults,
        productType: 'flyers',
        paperSize: 'a4',
      },
      files: [],
    }
    expect(quoteSchema.safeParse(digital).success).toBe(true)
  })

  it('validates only the selected service specification', () => {
    const result = quoteSchema.safeParse(valid3d({ specifications: { material: 'wood' } }))
    expect(result.success).toBe(false)
  })

  it('requires a custom size when paper size is custom', () => {
    const base = {
      ...serviceSpecs['digital-printing'].defaults,
      productType: 'flyers',
      paperSize: 'custom',
    }
    const values: QuoteFormValues = {
      ...valid3d(),
      service: 'digital-printing',
      specifications: base,
      files: [],
    }
    expect(quoteSchema.safeParse(values).success).toBe(false)
    expect(
      quoteSchema.safeParse({ ...values, specifications: { ...base, customSize: '210 x 100 mm' } })
        .success,
    ).toBe(true)
  })

  it('rejects a non-positive or blank quantity', () => {
    for (const quantity of [0, undefined, 1.5]) {
      const specifications = { ...serviceSpecs['3d-printing'].defaults, quantity }
      expect(quoteSchema.safeParse(valid3d({ specifications })).success).toBe(false)
    }
  })

  it('rejects an invalid customer', () => {
    const bad = { ...customer, phone: '123', pinCode: '12' }
    expect(quoteSchema.safeParse(valid3d({ customer: bad })).success).toBe(false)
  })
})

describe('findInvalidStep', () => {
  it('returns -1 for a complete enquiry', () => {
    expect(findInvalidStep(valid3d())).toBe(-1)
  })

  it('points at the earliest step with a problem', () => {
    expect(findInvalidStep(quoteDefaults)).toBe(0)
    expect(findInvalidStep(valid3d({ files: [] }))).toBe(1)
    expect(findInvalidStep(valid3d({ customer: { ...customer, name: '' } }))).toBe(2)
  })
})

describe('validateFiles', () => {
  const rule = serviceSpecs['3d-printing'].files

  it('accepts supported files and rejects others with a reason', () => {
    const { accepted, rejected } = validateFiles(
      [file('a.STL'), file('b.pdf'), file('c.stl', 0)],
      [],
      rule,
    )
    expect(accepted.map((f) => f.name)).toEqual(['a.STL'])
    expect(rejected.map((r) => r.name)).toEqual(['b.pdf', 'c.stl'])
    expect(rejected[0]?.reason).toContain('not accepted')
  })

  it('rejects oversize, duplicate and over-limit files', () => {
    const big = file('big.stl', 1)
    Object.defineProperty(big, 'size', { value: MAX_FILE_SIZE_BYTES + 1 })
    const existing = [file('dup.stl')]
    const { rejected } = validateFiles([big, file('dup.stl')], existing, rule)
    expect(rejected.map((r) => r.reason)).toEqual([
      expect.stringContaining('larger than'),
      expect.stringContaining('already added'),
    ])

    const many = Array.from({ length: MAX_FILES }, (_, i) => file(`f${i}.stl`))
    expect(validateFiles([file('extra.stl')], many, rule).rejected[0]?.reason).toContain(
      `${MAX_FILES}`,
    )
  })
})

describe('buildQuoteSummary', () => {
  it('resolves option labels, skips hidden and blank fields and lists files', () => {
    const summary = buildQuoteSummary(
      valid3d({
        specifications: { ...serviceSpecs['3d-printing'].defaults, material: 'petg', colour: '' },
        notes: 'Please call first.',
      }),
    )
    expect(summary.subject).toBe('Quote enquiry: 3D Printing')
    const specRows = summary.sections.find((s) => s.id === 'specifications')?.rows ?? []
    expect(specRows).toContainEqual({ label: 'Material', value: 'PETG' })
    expect(specRows.some((row) => row.label === 'Colour')).toBe(false)
    expect(summary.sections.find((s) => s.id === 'files')?.rows[0]?.value).toBe('part.stl (1 KB)')
    expect(summary.notes).toBe('Please call first.')
  })

  it('hides conditional fields that are not visible', () => {
    const summary = buildQuoteSummary({
      ...valid3d(),
      service: 'digital-printing',
      files: [],
      specifications: {
        ...serviceSpecs['digital-printing'].defaults,
        productType: 'flyers',
        paperSize: 'a4',
        customSize: 'stale value',
      },
    })
    const labels = summary.sections.find((s) => s.id === 'specifications')?.rows.map((r) => r.label)
    expect(labels).not.toContain('Custom size')
  })

  it('formats dimensions and checkbox values', () => {
    const dimensions = serviceSpecs['3d-printing'].fields.find((f) => f.kind === 'dimensions')
    const finishing = serviceSpecs['digital-printing'].fields.find((f) => f.name === 'finishing')
    expect(dimensions && formatFieldValue(dimensions, { length: 10, width: 20 })).toBe(
      '10 × 20 × ? mm',
    )
    expect(finishing && formatFieldValue(finishing, ['lamination', 'folding'])).toBe(
      'Lamination, Folding',
    )
    expect(finishing && formatFieldValue(finishing, [])).toBeNull()
  })
})

describe('draft persistence', () => {
  it('never serialises files and round-trips the rest', () => {
    const raw = serializeDraft(valid3d({ notes: 'hello' }), 2)
    expect(raw).not.toContain('part.stl')
    const parsed = parseDraft(raw)
    expect(parsed?.values.service).toBe('3d-printing')
    expect(parsed?.values.files).toEqual([])
    expect(parsed?.values.notes).toBe('hello')
    expect(parsed?.values.customer.email).toBe('asha@example.com')
  })

  it('clamps the step to the first incomplete one (files are not restored)', () => {
    // 3D printing requires files, so a restored draft cannot go beyond the specifications step.
    expect(parseDraft(serializeDraft(valid3d(), lastStepIndex))?.stepIndex).toBe(1)
  })

  it('ignores corrupt or empty drafts and falls back to defaults for bad fields', () => {
    expect(parseDraft(null)).toBeNull()
    expect(parseDraft('not json')).toBeNull()
    expect(parseDraft(JSON.stringify({ values: { service: 'laser' } }))).toBeNull()

    const parsed = parseDraft(
      JSON.stringify({
        values: {
          service: 'prototyping',
          specifications: 'oops',
          customer: { name: 42 },
          notes: 5,
        },
        stepIndex: 'x',
      }),
    )
    expect(parsed?.values.customer.name).toBe('')
    expect(parsed?.values.notes).toBe('')
    expect(parsed?.values.specifications).toEqual(serviceSpecs.prototyping.defaults)
    expect(parsed?.stepIndex).toBe(0)
  })

  it('uses a versioned key', () => {
    expect(DRAFT_KEY).toMatch(/:v\d+$/)
  })
})

describe('steps', () => {
  it('ends with a review step that validates nothing', () => {
    expect(quoteSteps.at(-1)?.id).toBe('review')
    expect(quoteSteps.at(-1)?.fields).toEqual([])
  })
})
