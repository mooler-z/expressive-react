import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogActions, DialogBody, DialogHeadline } from "@/components/ui/dialog"

export default function ControlledDialog() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="tonal" onPress={() => setOpen(true)}>
        Open from state
      </Button>
      <span className="text-body-sm text-on-surface-variant">isOpen: {String(open)}</span>
      <Dialog overlayProps={{ isOpen: open, onOpenChange: setOpen }} modalClassName="max-w-[400px]">
        <DialogHeadline>Session expiring</DialogHeadline>
        <DialogBody>You'll be signed out in 2 minutes. Stay signed in?</DialogBody>
        <DialogActions>
          <Button variant="text" slot="close">
            Sign out
          </Button>
          <Button variant="text" slot="close">
            Stay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
