import { useState } from "react"
import type { Selection } from "react-aria-components"

import { ChipGroup, FilterChip } from "@/components/ui/chip"

export default function ChipFilter() {
  const [selected, setSelected] = useState<Selection>(new Set(["production"]))
  return (
    <div className="flex flex-col items-center gap-3">
      <ChipGroup aria-label="Environments" selectedKeys={selected} onSelectionChange={setSelected}>
        <FilterChip id="production">Production</FilterChip>
        <FilterChip id="staging">Staging</FilterChip>
        <FilterChip id="preview" icon="science">Preview</FilterChip>
        <FilterChip id="region" trailingIcon="arrow_drop_down">Region</FilterChip>
      </ChipGroup>
      <p className="text-body-sm text-on-surface-variant">Showing: {[...selected].join(", ") || "everything"}</p>
    </div>
  )
}
