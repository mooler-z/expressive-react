import { Field, FieldDescription, FieldLabel, Input } from "@/components/ui/field"

export default function FieldStates() {
  return (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <Field defaultValue="maya@kestrel.io" isDisabled>
        <FieldLabel>Email</FieldLabel>
        <Input size="sm" />
        <FieldDescription>Managed by your identity provider.</FieldDescription>
      </Field>
      <Field defaultValue="ws_7Hq2kD9xL" isReadOnly>
        <FieldLabel>Workspace ID</FieldLabel>
        <Input size="sm" className="font-mono" />
        <FieldDescription>Read-only fields get a dashed outline.</FieldDescription>
      </Field>
    </div>
  )
}
