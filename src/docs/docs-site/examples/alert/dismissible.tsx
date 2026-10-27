import * as React from "react"

import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function AlertDismissible() {
  const [open, setOpen] = React.useState(true)

  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-3">
      {open ? (
        <Alert tone="info" className="w-full" title="Maintenance" onDismiss={() => setOpen(false)}>
          The EU cluster restarts on Sunday at 02:00 UTC.
        </Alert>
      ) : (
        <Button variant="tonal" onPress={() => setOpen(true)}>
          Show the alert again
        </Button>
      )}
    </div>
  )
}
