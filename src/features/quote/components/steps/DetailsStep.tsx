import { TextField } from '@/components/form/TextField'
import { TextareaField } from '@/components/form/TextareaField'

export function DetailsStep() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField name="customer.name" label="Name" autoComplete="name" />
        <TextField name="customer.company" label="Company" optional autoComplete="organization" />
        <TextField name="customer.email" label="Email" type="email" autoComplete="email" />
        <TextField
          name="customer.phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField name="customer.city" label="Delivery city" autoComplete="address-level2" />
        <TextField
          name="customer.pinCode"
          label="PIN code"
          autoComplete="postal-code"
          inputMode="numeric"
          maxLength={6}
        />
      </div>
      <TextareaField
        name="customer.address"
        label="Delivery address"
        rows={3}
        autoComplete="street-address"
      />
      <TextField
        name="customer.requiredBy"
        label="Needed by"
        type="date"
        optional
        description="If you have a deadline, tell us. We will confirm what is possible."
      />
      <TextareaField
        name="notes"
        label="Anything else we should know?"
        optional
        rows={4}
        maxLength={1000}
      />
    </div>
  )
}
