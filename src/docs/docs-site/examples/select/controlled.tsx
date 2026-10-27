import { useState } from "react"
import type { Key } from "react-aria-components"

import { Select, SelectItem } from "@/components/ui/select"

const TIMEZONES = [
  { id: "utc", name: "UTC" },
  { id: "berlin", name: "Europe/Berlin" },
  { id: "nyc", name: "America/New_York" },
  { id: "tokyo", name: "Asia/Tokyo" },
]

export default function SelectControlled() {
  const [zone, setZone] = useState<Key | null>("berlin")
  return (
    <div className="flex w-72 flex-col gap-2">
      <Select label="Time zone" items={TIMEZONES} selectedKey={zone} onSelectionChange={setZone}>
        {(tz) => <SelectItem id={tz.id}>{tz.name}</SelectItem>}
      </Select>
      <p className="px-4 text-body-sm text-on-surface-variant">Reports run at 09:00 {TIMEZONES.find((t) => t.id === zone)?.name}</p>
    </div>
  )
}
