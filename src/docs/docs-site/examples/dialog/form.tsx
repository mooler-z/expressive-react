import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogActions, DialogBody, DialogHeadline, DialogTrigger } from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"

export default function FormDialog() {
  const [name, setName] = useState("")

  return (
    <DialogTrigger>
      <Button icon={<Icon name="create_new_folder" />}>New project</Button>
      <Dialog>
        {({ close }) => (
          <>
            <DialogHeadline>New project</DialogHeadline>
            <DialogBody className="pt-2">
              <TextField label="Project name" value={name} onChange={setName} autoFocus />
            </DialogBody>
            <DialogActions>
              <Button variant="text" slot="close">
                Cancel
              </Button>
              <Button
                variant="text"
                isDisabled={!name.trim()}
                onPress={() => {
                  snackbar(`Created ${name.trim()}`)
                  setName("")
                  close()
                }}
              >
                Create
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  )
}
