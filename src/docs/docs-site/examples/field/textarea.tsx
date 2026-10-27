import { useState } from "react"

import { Field, FieldDescription, FieldLabel, TextArea } from "@/components/ui/field"

const MAX = 280

export default function FieldTextArea() {
  const [value, setValue] = useState("Rotated the signing keys for the checkout webhook.")

  return (
    <Field value={value} onChange={setValue} maxLength={MAX} className="w-full max-w-md">
      <FieldLabel>Change note</FieldLabel>
      <TextArea rows={4} />
      <div className="flex justify-between gap-4">
        <FieldDescription>Visible to everyone with access to the audit log.</FieldDescription>
        <span className="shrink-0 text-body-sm text-on-surface-variant tabular-nums">
          {value.length} / {MAX}
        </span>
      </div>
    </Field>
  )
}
