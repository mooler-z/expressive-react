import { TextField } from "@/components/ui/text-field"

export default function TextFieldAffixes() {
  return (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <TextField
        variant="filled"
        label="Monthly budget"
        defaultValue="4,200"
        prefix="$"
        suffix="USD"
        inputMode="decimal"
        inputClassName="tabular-nums"
      />
      <TextField label="Subdomain" defaultValue="kestrel" suffix=".grid.app" />
    </div>
  )
}
