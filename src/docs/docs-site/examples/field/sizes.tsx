import { Field, FieldLabel, Input } from "@/components/ui/field"

export default function FieldSizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {(["md", "sm", "xs"] as const).map((size, i) => (
        <Field key={size} defaultValue="checkout-api">
          <FieldLabel>Service · {[56, 48, 40][i]}dp</FieldLabel>
          <Input size={size} />
        </Field>
      ))}
    </div>
  )
}
