import { Button } from "@/components/ui/button"
import { Dialog, DialogActions, DialogBody, DialogHeadline, DialogTrigger } from "@/components/ui/dialog"

export default function BasicDialog() {
  return (
    <DialogTrigger>
      <Button variant="tonal">Show terms</Button>
      <Dialog>
        <DialogHeadline>Terms updated</DialogHeadline>
        <DialogBody>We've clarified how usage-based billing is calculated. Nothing changes for your current plan.</DialogBody>
        <DialogActions>
          <Button variant="text" slot="close">
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </DialogTrigger>
  )
}
