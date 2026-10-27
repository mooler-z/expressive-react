import { BottomAppBar } from "@/components/ui/app-bar"
import { Fab } from "@/components/ui/fab"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { snackbar } from "@/components/ui/snackbar"

export default function AppBarBottom() {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-lg border border-outline-variant">
      <BottomAppBar
        aria-label="Note actions"
        fab={
          <Fab aria-label="New note" className="shadow-none" onPress={() => snackbar("New note")}>
            <Icon name="add" />
          </Fab>
        }
      >
        <IconButton aria-label="New checklist" onPress={() => snackbar("New checklist")}>
          <Icon name="check_box" />
        </IconButton>
        <IconButton aria-label="New drawing" onPress={() => snackbar("New drawing")}>
          <Icon name="brush" />
        </IconButton>
        <IconButton aria-label="New voice note" onPress={() => snackbar("New voice note")}>
          <Icon name="mic" />
        </IconButton>
        <IconButton aria-label="New image note" onPress={() => snackbar("New image note")}>
          <Icon name="image" />
        </IconButton>
      </BottomAppBar>
    </div>
  )
}
