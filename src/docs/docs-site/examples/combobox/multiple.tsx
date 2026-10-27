import { useState } from "react"
import type { Key } from "react-aria-components"

import { ComboBox, ComboBoxItem } from "@/components/ui/combobox"

const REGIONS = [
  { id: "iad", name: "US East" },
  { id: "pdx", name: "US West" },
  { id: "fra", name: "Frankfurt" },
  { id: "arn", name: "Stockholm" },
  { id: "nrt", name: "Tokyo" },
  { id: "syd", name: "Sydney" },
]

export default function ComboBoxMultiple() {
  const [value, setValue] = useState<Key[]>(["fra", "nrt"])
  return (
    <div className="w-full max-w-sm">
      <ComboBox
        label="Replicate to"
        selectionMode="multiple"
        defaultItems={REGIONS}
        value={value}
        onChange={setValue}
        isInvalid={value.length === 0}
        errorMessage="Select at least one region"
        description={`${value.length} selected`}
      >
        {(region) => <ComboBoxItem id={region.id}>{region.name}</ComboBoxItem>}
      </ComboBox>
    </div>
  )
}
