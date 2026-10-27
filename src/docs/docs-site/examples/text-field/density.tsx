import { TextField } from "@/components/ui/text-field"

export default function TextFieldDensity() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <TextField density="md" label="Service · 56dp" defaultValue="checkout-api" />
      <TextField density="sm" label="Service · 48dp" defaultValue="checkout-api" />
      <TextField density="xs" label="Service · 40dp" defaultValue="checkout-api" />
    </div>
  )
}
