import { useState } from "react"

import { BadgeAnchor } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"

export default function BadgeLive() {
  const [count, setCount] = useState(2)

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <IconButton size="md" aria-label={count ? `Inbox, ${count} unread` : "Inbox"}>
        <BadgeAnchor count={count}>
          <Icon name="inbox" />
        </BadgeAnchor>
      </IconButton>
      <Button variant="tonal" icon={<Icon name="add" />} onPress={() => setCount((n) => n + 1)}>
        New message
      </Button>
      <Button variant="text" onPress={() => setCount(0)}>
        Mark all read
      </Button>
    </div>
  )
}
