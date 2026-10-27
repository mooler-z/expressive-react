import { ExtendedFab, Fab } from "@/components/ui/fab"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"

export default function FabDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <Fab aria-label="Compose" onPress={() => snackbar("New message")}>
        <Icon name="edit" />
      </Fab>
      <Fab size="md" color="tertiary-container" aria-label="Navigate" onPress={() => snackbar("Starting navigation")}>
        <Icon name="navigation" />
      </Fab>
      <ExtendedFab icon="add" onPress={() => snackbar("New project")}>
        New project
      </ExtendedFab>
    </div>
  )
}
