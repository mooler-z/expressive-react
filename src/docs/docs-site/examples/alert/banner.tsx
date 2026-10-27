import * as React from "react"

import { Banner } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { snackbar } from "@/components/ui/snackbar"

export default function AlertBanner() {
  const [open, setOpen] = React.useState(true)

  return (
    <div className="w-full max-w-xl overflow-hidden rounded-lg bg-surface-container-low">
      <div className="flex h-14 items-center px-4 text-title-lg text-on-surface">Billing</div>
      {open ? (
        <Banner
          icon="credit_card_off"
          actions={
            <>
              <Button variant="text" onPress={() => setOpen(false)}>
                Dismiss
              </Button>
              <Button variant="text" onPress={() => snackbar("Opening payment settings")}>
                Update card
              </Button>
            </>
          }
        >
          Your card on file was declined. Update it to keep production deploys running.
        </Banner>
      ) : (
        <div className="p-4">
          <Button variant="tonal" onPress={() => setOpen(true)}>
            Show banner
          </Button>
        </div>
      )}
    </div>
  )
}
