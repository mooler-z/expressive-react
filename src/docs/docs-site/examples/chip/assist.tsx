import { AssistChip } from "@/components/ui/chip"
import { snackbar } from "@/components/ui/snackbar"

export default function ChipAssist() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <AssistChip icon="calendar_today" onPress={() => snackbar("Added to calendar")}>Add to calendar</AssistChip>
      <AssistChip icon="directions" onPress={() => snackbar("Opening directions")}>Directions</AssistChip>
      <AssistChip icon="share" elevated onPress={() => snackbar("Link copied")}>Share</AssistChip>
      <AssistChip icon="alarm" isDisabled>Set alarm</AssistChip>
    </div>
  )
}
