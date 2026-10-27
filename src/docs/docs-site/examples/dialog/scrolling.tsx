import { Button } from "@/components/ui/button"
import { Dialog, DialogActions, DialogBody, DialogHeadline, DialogTrigger } from "@/components/ui/dialog"
import { Divider } from "@/components/ui/divider"

const SECTIONS = Array.from({ length: 12 }, (_, i) => `Section ${i + 1}. Usage is metered per project and rounded up to the nearest minute. Credits apply before charges.`)

export default function ScrollingDialog() {
  return (
    <DialogTrigger>
      <Button variant="outlined">Read the policy</Button>
      <Dialog className="max-h-[min(560px,calc(100dvh-2rem))]">
        <DialogHeadline>Billing policy</DialogHeadline>
        <Divider className="-mx-6 mt-4" />
        <DialogBody className="mt-0 space-y-3 py-4">
          {SECTIONS.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </DialogBody>
        <Divider className="-mx-6" />
        <DialogActions>
          <Button variant="text" slot="close">
            Decline
          </Button>
          <Button variant="text" slot="close">
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </DialogTrigger>
  )
}
