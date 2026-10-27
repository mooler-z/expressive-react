import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { snackbar } from "@/components/ui/snackbar"

export default function BasicAlertDialog() {
  return (
    <AlertDialogTrigger>
      <Button variant="tonal">Leave meeting</Button>
      <AlertDialog title="Leave the meeting?" confirmLabel="Leave" cancelLabel="Stay" onConfirm={() => snackbar("You left the meeting")}>
        Others can keep talking. You can rejoin from the invite.
      </AlertDialog>
    </AlertDialogTrigger>
  )
}
