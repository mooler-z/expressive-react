import { useState } from "react"

import { Button } from "@/components/ui/button"
import { InputChip, InputChipGroup } from "@/components/ui/chip"

const PEOPLE = [
  { id: "maya", name: "Maya Lindqvist", initials: "ML" },
  { id: "jonah", name: "Jonah Park", initials: "JP" },
  { id: "ops", name: "ops-team@kestrel.io" },
]

export default function ChipInputGroup() {
  const [people, setPeople] = useState(PEOPLE)
  return (
    <div className="flex flex-col items-center gap-3">
      <InputChipGroup
        aria-label="Recipients"
        items={people}
        onRemove={(keys) => setPeople((p) => p.filter((x) => !keys.has(x.id)))}
        renderEmptyState={() => <span className="text-body-md text-on-surface-variant">No recipients</span>}
      >
        {(p) => (
          <InputChip id={p.id} avatar={p.initials} icon={p.initials ? undefined : "mail"}>
            {p.name}
          </InputChip>
        )}
      </InputChipGroup>
      <Button variant="text" size="xs" onPress={() => setPeople(PEOPLE)}>Restore</Button>
    </div>
  )
}
