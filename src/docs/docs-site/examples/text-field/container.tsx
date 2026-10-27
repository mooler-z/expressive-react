import { useState } from "react"
import { TextField as AriaTextField } from "react-aria-components"

import { Kbd } from "@/components/ui/kbd"
import { FieldContainer, FieldInput, FieldSupportingText } from "@/components/ui/text-field"

const CLUSTERS = ["kestrel-prod-eu-01", "kestrel-prod-eu-02", "kestrel-prod-us-01"]

export default function TextFieldContainer() {
  const [value, setValue] = useState("kestrel-prod-")
  const match = value ? CLUSTERS.find((c) => c.startsWith(value) && c !== value) : undefined

  return (
    <AriaTextField
      value={value}
      onChange={setValue}
      onKeyDown={(e) => {
        if (e.key === "Tab" && match) {
          e.preventDefault()
          setValue(match)
        }
      }}
      className="group/field w-full max-w-sm"
    >
      <FieldContainer label="Cluster" trailing={match ? <Kbd className="mr-3">Tab</Kbd> : undefined}>
        <span className="relative flex min-w-0 flex-1">
          <span aria-hidden className="pointer-events-none absolute inset-0 truncate font-mono text-body-lg whitespace-pre text-on-surface-variant/60">
            <span className="invisible">{value}</span>
            {match?.slice(value.length)}
          </span>
          <FieldInput className="font-mono" />
        </span>
      </FieldContainer>
      <FieldSupportingText description={match ? "Tab accepts the suggestion" : "No more suggestions"} />
    </AriaTextField>
  )
}
