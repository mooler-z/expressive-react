import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"

export default function AlertDialogDemo() {
  return (
    <AlertDialogTrigger>
      <Button variant="outlined" icon={<Icon name="delete" />}>
        Delete project
      </Button>
      <AlertDialog
        icon="delete"
        title="Delete project?"
        confirmLabel="Delete"
        destructive
        onConfirm={() => snackbar("Project deleted", { action: { label: "Undo", onAction: () => snackbar("Restored") } })}
      >
        The project, its deployments and 14 environment variables will be removed. This can't be undone.
      </AlertDialog>
    </AlertDialogTrigger>
  )
}
