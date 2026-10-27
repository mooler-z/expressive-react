import { Button } from "@/components/ui/button"
import { Dialog, DialogActions, DialogBody, DialogHeadline, DialogIcon, DialogTrigger } from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"

export default function DialogDemo() {
  return (
    <DialogTrigger>
      <Button icon={<Icon name="restart_alt" />}>Reset settings</Button>
      <Dialog>
        <DialogIcon>restart_alt</DialogIcon>
        <DialogHeadline>Reset settings?</DialogHeadline>
        <DialogBody>
          This resets your app preferences to their defaults. Your projects and files aren't affected.
        </DialogBody>
        <DialogActions>
          <Button variant="text" slot="close">
            Cancel
          </Button>
          <Button variant="text" slot="close" onPress={() => snackbar("Settings reset")}>
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </DialogTrigger>
  )
}
