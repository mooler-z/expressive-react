import { useState } from "react"

import { ComboBox, ComboBoxItem } from "@/components/ui/combobox"

const TAGS = ["frontend", "backend", "infra", "security", "design"]

export default function ComboBoxCustomValue() {
  const [tag, setTag] = useState("")
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <ComboBox
        label="Tag"
        allowsCustomValue
        inputValue={tag}
        onInputChange={setTag}
        defaultItems={TAGS.map((t) => ({ id: t }))}
        description="Pick a tag or type a new one"
      >
        {(t) => <ComboBoxItem id={t.id}>{t.id}</ComboBoxItem>}
      </ComboBox>
      <p className="px-4 text-body-sm text-on-surface-variant">
        Value: <span className="text-on-surface">{tag || "—"}</span> {tag && !TAGS.includes(tag) && "(new)"}
      </p>
    </div>
  )
}
