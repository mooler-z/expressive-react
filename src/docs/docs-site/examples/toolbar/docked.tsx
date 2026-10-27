import { snackbar } from "@/components/ui/snackbar"
import { DockedToolbar, DockedToolbarAction } from "@/components/ui/toolbar"

export default function ToolbarDocked() {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-outline-variant">
      <DockedToolbar aria-label="Message actions" justify="around">
        <DockedToolbarAction icon="reply" onPress={() => snackbar("Reply")}>Reply</DockedToolbarAction>
        <DockedToolbarAction icon="reply_all" onPress={() => snackbar("Reply all")}>Reply all</DockedToolbarAction>
        <DockedToolbarAction icon="forward" onPress={() => snackbar("Forward")}>Forward</DockedToolbarAction>
        <DockedToolbarAction icon="delete" onPress={() => snackbar("Deleted")}>Delete</DockedToolbarAction>
      </DockedToolbar>
    </div>
  )
}
