import { Button } from "@/components/ui/button"
import { Dialog, DialogActions, DialogBody, DialogHeadline, DialogIcon, DialogTrigger } from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"
import { Row, Section } from "@/docs/section"

export default function DialogsSection() {
  return (
    <Section
      id="dialogs"
      description="Basic dialog: 28dp corners, surface-container-high, headline-small, right-aligned text buttons. Focus is trapped and restored."
      spec="https://m3.material.io/components/dialogs/overview"
    >
      <Row label="Basic · alert">
        <DialogTrigger>
          <Button>
            <Icon>open_in_full</Icon>
            Open dialog
          </Button>
          <Dialog>
            <DialogIcon>restart_alt</DialogIcon>
            <DialogHeadline>Reset settings?</DialogHeadline>
            <DialogBody>
              This will reset your app preferences back to their default settings. The following accounts will also be
              signed out: alex@kestrel.io, ops-team@kestrel.io.
            </DialogBody>
            <DialogActions>
              <Button variant="text" slot="close">
                Cancel
              </Button>
              <Button variant="text" slot="close">
                Accept
              </Button>
            </DialogActions>
          </Dialog>
        </DialogTrigger>
        <DialogTrigger>
          <Button variant="tonal">Discard draft</Button>
          <Dialog role="alertdialog">
            <DialogHeadline>Discard draft?</DialogHeadline>
            <DialogActions>
              <Button variant="text" slot="close">
                Cancel
              </Button>
              <Button variant="text" slot="close">
                Discard
              </Button>
            </DialogActions>
          </Dialog>
        </DialogTrigger>
      </Row>
    </Section>
  )
}
