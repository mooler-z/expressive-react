import * as React from "react"

import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { CircularProgress } from "@/components/ui/progress"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"
import { Section, Variant, Variants } from "@/docs/section"

const WORKSPACE = "Kestrel Ops"

export default function AlertDialogSection() {
  const [typed, setTyped] = React.useState("")
  return (
    <Section
      id="alert-dialog"
      description="A basic dialog that requires a decision: no dismiss on scrim tap, destructive confirm on the error role."
    >
      <div className="grid min-h-[200px] place-items-center rounded-lg bg-surface p-4">
        <AlertDialogTrigger onOpenChange={(open) => open && setTyped("")}>
          <Button className="bg-error text-on-error">
            <Icon>delete</Icon>
            Delete workspace…
          </Button>
          <AlertDialog
            icon="delete_forever"
            destructive
            title={`Delete workspace “${WORKSPACE}”?`}
            confirmLabel="Delete workspace"
            isConfirmDisabled={typed !== WORKSPACE}
            onConfirm={() => snackbar("Workspace deleted", { action: { label: "Undo", onAction: () => snackbar("Workspace restored") } })}
          >
            <p>All 14 projects, their deployments and audit logs will be permanently removed. This can't be undone.</p>
            <TextField
              autoFocus
              aria-label={`Type ${WORKSPACE} to confirm`}
              label={`Type “${WORKSPACE}” to confirm`}
              value={typed}
              onChange={setTyped}
              isInvalid={typed.length > 0 && !WORKSPACE.startsWith(typed)}
              containerClassName="mt-5"
              inputClassName="font-mono"
            />
          </AlertDialog>
        </AlertDialogTrigger>
      </div>

      <Variants cols="md:grid-cols-2">
        <Variant n={1} label="Unsaved changes · 3 actions">
          <AlertDialogTrigger>
            <Button variant="tonal">Leave editor</Button>
            <AlertDialog
              title="Discard unsaved changes?"
              confirmLabel="Save"
              confirmVariant="filled"
              onConfirm={() => snackbar("Changes saved")}
              extraActions={
                <Button variant="text" slot="close" className="text-error" onPress={() => snackbar("Changes discarded")}>
                  Discard
                </Button>
              }
            >
              You edited 3 fields in “Rollout policy”. They'll be lost if you leave now.
            </AlertDialog>
          </AlertDialogTrigger>
        </Variant>
        <Variant n={2} label="Session timeout">
          <AlertDialogTrigger>
            <Button variant="tonal">Simulate idle</Button>
            <SessionTimeout />
          </AlertDialogTrigger>
        </Variant>
      </Variants>
    </Section>
  )
}

function SessionTimeout() {
  const [left, setLeft] = React.useState(45)
  React.useEffect(() => {
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <AlertDialog
      title={<span className="block text-center">Still there?</span>}
      cancelLabel="Sign out"
      confirmLabel="Stay signed in"
      confirmVariant="filled"
      onCancel={() => snackbar("Signed out")}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <CircularProgress value={left} maxValue={45} size={64} tone="tertiary" aria-label="Time left">
          <Icon className="text-tertiary">timer</Icon>
        </CircularProgress>
        <p>
          For security you'll be signed out in <span className="font-medium text-on-surface tabular-nums">0:{String(left).padStart(2, "0")}</span>.
        </p>
      </div>
    </AlertDialog>
  )
}
