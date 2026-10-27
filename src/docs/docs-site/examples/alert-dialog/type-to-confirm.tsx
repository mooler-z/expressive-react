import { useState } from "react"

import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"

const WORKSPACE = "kestrel-ops"

export default function TypeToConfirm() {
  const [value, setValue] = useState("")

  return (
    <AlertDialogTrigger onOpenChange={(open) => !open && setValue("")}>
      <Button color="error" variant="tonal">
        Delete workspace
      </Button>
      <AlertDialog
        icon="warning"
        title="Delete workspace?"
        confirmLabel="Delete workspace"
        destructive
        isConfirmDisabled={value !== WORKSPACE}
        onConfirm={() => snackbar(`Deleted ${WORKSPACE}`)}
      >
        <p>
          Everything in <strong className="text-on-surface">{WORKSPACE}</strong> is deleted permanently. Type its name to confirm.
        </p>
        <TextField aria-label="Workspace name" placeholder={WORKSPACE} value={value} onChange={setValue} className="mt-4" autoFocus />
      </AlertDialog>
    </AlertDialogTrigger>
  )
}
