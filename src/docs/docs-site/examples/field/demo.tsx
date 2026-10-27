import { useState } from "react"

import { Field, FieldDescription, FieldError, FieldLabel, Input } from "@/components/ui/field"

export default function FieldDemo() {
  const [slug, setSlug] = useState("kestrel ops")

  return (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <Field defaultValue="Kestrel Ops" isRequired>
        <FieldLabel isRequired>Workspace name</FieldLabel>
        <Input />
        <FieldDescription>Shown in the sidebar and on invoices.</FieldDescription>
      </Field>
      <Field value={slug} onChange={setSlug} isInvalid={!/^[a-z0-9-]+$/.test(slug)}>
        <FieldLabel hint="Optional">Slug</FieldLabel>
        <Input className="font-mono" />
        <FieldError>Use lowercase letters, numbers and dashes only.</FieldError>
      </Field>
    </div>
  )
}
