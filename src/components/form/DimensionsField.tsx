import { FieldShell, type FieldBaseProps } from './FieldShell'
import { TextField } from './TextField'
import { useFieldIds } from './useField'

const dimensions = [
  { key: 'length', label: 'Length' },
  { key: 'width', label: 'Width' },
  { key: 'height', label: 'Height' },
] as const

type DimensionsFieldProps = Omit<FieldBaseProps, 'optional'> & { unit: string; optional?: boolean }

/** Three number inputs stored as `{ length, width, height }`. Each shows its own error. */
export function DimensionsField({
  name,
  label,
  description,
  optional,
  className,
  unit,
}: DimensionsFieldProps) {
  const ids = useFieldIds()

  return (
    <FieldShell
      {...ids}
      group
      label={label}
      description={description}
      optional={optional}
      className={className}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {dimensions.map(({ key, label: dimensionLabel }) => (
          <TextField
            key={key}
            name={`${name}.${key}`}
            label={`${dimensionLabel} (${unit})`}
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
          />
        ))}
      </div>
    </FieldShell>
  )
}
