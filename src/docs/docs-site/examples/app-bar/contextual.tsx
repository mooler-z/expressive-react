import { useState } from "react"

import { TopAppBar } from "@/components/ui/app-bar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { snackbar } from "@/components/ui/snackbar"

export default function AppBarContextual() {
  const [selected, setSelected] = useState(3)
  const selecting = selected > 0

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <div className="w-full overflow-hidden rounded-lg border border-outline-variant">
        {selecting ? (
          <TopAppBar
            title={`${selected} selected`}
            scrolled={false}
            rowClassName="bg-secondary-container text-on-secondary-container"
            navigation={
              <IconButton aria-label="Clear selection" onPress={() => setSelected(0)}>
                <Icon name="close" />
              </IconButton>
            }
            actions={
              <>
                <IconButton aria-label="Archive" onPress={() => snackbar(`Archived ${selected}`)}>
                  <Icon name="archive" />
                </IconButton>
                <IconButton aria-label="Delete" onPress={() => snackbar(`Deleted ${selected}`)}>
                  <Icon name="delete" />
                </IconButton>
              </>
            }
          />
        ) : (
          <TopAppBar
            title="Messages"
            navigation={
              <IconButton aria-label="Open navigation">
                <Icon name="menu" />
              </IconButton>
            }
          />
        )}
      </div>
      <Button variant="tonal" size="xs" onPress={() => setSelected((n) => (n === 0 ? 3 : 0))}>
        {selecting ? "Clear selection" : "Select 3 messages"}
      </Button>
    </div>
  )
}
