import { useState } from "react"

import { AssistChip, FilterChip, InputChip, InputChipGroup, SuggestionChip } from "@/components/ui/chip"
import { snackbar } from "@/components/ui/snackbar"

export default function ChipDemo() {
  const [people, setPeople] = useState([{ id: "maya", name: "Maya Lindqvist", initials: "ML" }])
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <AssistChip icon="calendar_today" onPress={() => snackbar("Added to calendar")}>Add to calendar</AssistChip>
      <FilterChip defaultSelected>Production</FilterChip>
      <InputChipGroup aria-label="Recipient" items={people} onRemove={() => setPeople([])}>
        {(p) => <InputChip id={p.id} avatar={p.initials}>{p.name}</InputChip>}
      </InputChipGroup>
      <SuggestionChip onPress={() => snackbar("Showing failed runs")}>Show failed runs</SuggestionChip>
    </div>
  )
}
