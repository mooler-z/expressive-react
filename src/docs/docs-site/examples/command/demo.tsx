import { useState } from "react"

import { Button } from "@/components/ui/button"
import { CommandDialog, CommandFooter, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"

export default function CommandDemo() {
  const [open, setOpen] = useState(false)
  const run = (message: string) => () => {
    snackbar(message)
    setOpen(false)
  }

  return (
    <>
      <Button variant="tonal" icon={<Icon name="search" />} onPress={() => setOpen(true)}>
        Open command palette
      </Button>
      <CommandDialog isOpen={open} onOpenChange={setOpen} shortcut={null}>
        <CommandInput placeholder="Search commands" />
        <CommandList>
          <CommandGroup title="Actions">
            <CommandItem icon="rocket_launch" shortcut={["⌘", "N"]} onAction={run("New deployment started")}>
              New deployment
            </CommandItem>
            <CommandItem icon="history" onAction={run("Rolling back")}>Roll back last deployment</CommandItem>
            <CommandItem icon="pause_circle" onAction={run("Deploys paused for 1 hour")}>Pause deploys for 1 hour</CommandItem>
          </CommandGroup>
          <CommandGroup title="Go to">
            <CommandItem icon="dns" meta="Service" onAction={run("Opening checkout-api")}>checkout-api</CommandItem>
            <CommandItem icon="group" meta="Team" onAction={run("Opening Platform")}>Platform</CommandItem>
          </CommandGroup>
        </CommandList>
        <CommandFooter />
      </CommandDialog>
    </>
  )
}
