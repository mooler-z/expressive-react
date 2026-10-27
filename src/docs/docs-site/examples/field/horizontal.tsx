import { Field, FieldDescription, FieldLabel, Input } from "@/components/ui/field"

export default function FieldHorizontal() {
  return (
    <div className="flex w-full max-w-3xl flex-col divide-y divide-outline-variant">
      <Field orientation="horizontal" defaultValue="Kestrel Ops" className="py-5">
        <div className="flex flex-col gap-1">
          <FieldLabel>Display name</FieldLabel>
          <FieldDescription>Shown in the sidebar and on invoices.</FieldDescription>
        </div>
        <Input size="sm" />
      </Field>
      <Field orientation="horizontal" defaultValue="billing@kestrel.io" type="email" className="py-5">
        <div className="flex flex-col gap-1">
          <FieldLabel>Billing email</FieldLabel>
          <FieldDescription>Receipts and renewal notices.</FieldDescription>
        </div>
        <Input size="sm" />
      </Field>
    </div>
  )
}
