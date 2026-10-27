import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { snackbar } from "@/components/ui/snackbar"

export default function CommandInline() {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl bg-surface-container-high">
      <Command className="max-h-80">
        <CommandInput placeholder="Filter actions" autoFocus={false} hint={null} />
        <CommandList emptyState="No matching actions">
          <CommandItem icon="rocket_launch" shortcut={["⌘", "N"]} onAction={() => snackbar("New deployment")}>New deployment</CommandItem>
          <CommandItem icon="history" onAction={() => snackbar("Rolling back checkout-api")}>Roll back checkout-api</CommandItem>
          <CommandItem icon="person_add" shortcut={["⌘", "I"]} onAction={() => snackbar("Invite sent")}>Invite teammate</CommandItem>
          <CommandItem icon="article" onAction={() => snackbar("Opening runbook")}>Open runbook</CommandItem>
        </CommandList>
      </Command>
    </div>
  )
}
