import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { ModalNavigationDrawer, NavigationDrawerHeadline, NavigationDrawerItem } from "@/components/ui/navigation-drawer"
import { snackbar } from "@/components/ui/snackbar"

export default function NavigationDrawerEnd() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="outlined" trailingIcon={<Icon name="filter_list" />} onPress={() => setOpen(true)}>
        Filters
      </Button>
      <ModalNavigationDrawer
        aria-label="Filters"
        side="end"
        keepOpenOnSelect
        isOpen={open}
        onOpenChange={setOpen}
        onValueChange={(v) => snackbar(`Showing ${v}`)}
        defaultValue="all"
      >
        <NavigationDrawerHeadline>Show</NavigationDrawerHeadline>
        <NavigationDrawerItem value="all" icon="select_all">All tasks</NavigationDrawerItem>
        <NavigationDrawerItem value="assigned" icon="person">Assigned to me</NavigationDrawerItem>
        <NavigationDrawerItem value="overdue" icon="schedule" badge={3}>Overdue</NavigationDrawerItem>
        <div className="mt-auto p-2">
          <Button variant="tonal" className="w-full" onPress={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </ModalNavigationDrawer>
    </>
  )
}
