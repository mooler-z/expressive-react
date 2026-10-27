import { useState } from "react"

import { Checkbox } from "@/components/ui/checkbox"

const REGIONS = ["US East", "Europe", "Asia Pacific"]

export default function CheckboxSelectAll() {
  const [selected, setSelected] = useState<string[]>(["Europe"])
  const all = selected.length === REGIONS.length
  const some = selected.length > 0 && !all

  return (
    <div className="flex flex-col items-start">
      <Checkbox isSelected={all} isIndeterminate={some} onChange={(on) => setSelected(on ? REGIONS : [])}>
        All regions
      </Checkbox>
      <div className="flex flex-col pl-6">
        {REGIONS.map((region) => (
          <Checkbox
            key={region}
            isSelected={selected.includes(region)}
            onChange={(on) => setSelected((s) => (on ? [...s, region] : s.filter((r) => r !== region)))}
          >
            {region}
          </Checkbox>
        ))}
      </div>
    </div>
  )
}
