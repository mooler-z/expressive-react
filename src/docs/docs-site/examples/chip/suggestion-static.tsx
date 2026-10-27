import { Chip, SuggestionChip } from "@/components/ui/chip"
import { snackbar } from "@/components/ui/snackbar"

export default function ChipSuggestionStatic() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        <SuggestionChip onPress={() => snackbar("Comparing with last week")}>Compare with last week</SuggestionChip>
        <SuggestionChip elevated onPress={() => snackbar("Exporting CSV")}>Export CSV</SuggestionChip>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Chip icon="check_circle" className="border-transparent bg-tertiary-container text-on-tertiary-container">Healthy</Chip>
        <Chip icon="warning" className="border-transparent bg-error-container text-on-error-container">Degraded</Chip>
        <Chip dense>v4.2.0</Chip>
        <Chip dense icon="schedule">2m ago</Chip>
      </div>
    </div>
  )
}
