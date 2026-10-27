import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { snackbar } from "@/components/ui/snackbar"

export default function ThreeActionAlertDialog() {
  return (
    <AlertDialogTrigger>
      <Button variant="outlined">Close draft</Button>
      <AlertDialog
        title="Save changes to this draft?"
        confirmLabel="Save"
        confirmVariant="filled"
        onConfirm={() => snackbar("Draft saved")}
        extraActions={
          <Button variant="text" slot="close" onPress={() => snackbar("Draft discarded")}>
            Discard
          </Button>
        }
      >
        Your edits since 10:42 haven't been saved.
      </AlertDialog>
    </AlertDialogTrigger>
  )
}
