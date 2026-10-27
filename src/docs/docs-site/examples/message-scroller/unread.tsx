import { useEffect, useState } from "react"

import { Avatar } from "@/components/ui/avatar"
import { Message, MessageGroup } from "@/components/ui/message"
import { ChatPanel, MessageScroller, UnreadDivider } from "@/components/ui/message-scroller"

const LINES = ["Queue depth back under 1k.", "Consumer lag 4s.", "Scaling workers to 12.", "Lag 1s.", "All clear."]

export default function MessageScrollerUnread() {
  const [count, setCount] = useState(6)

  // A new message every 2.5s: scroll up to see the jump button count them
  useEffect(() => {
    const t = setInterval(() => setCount((c) => (c < 40 ? c + 1 : c)), 2500)
    return () => clearInterval(t)
  }, [])

  return (
    <ChatPanel className="h-80 w-full max-w-md border border-outline-variant">
      <MessageScroller jumpLabel={false} aria-label="Incident updates">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="space-y-3">
            {i === 4 && <UnreadDivider />}
            <MessageGroup avatar={<Avatar name="Ops Bot" size="sm" color="tertiary" />}>
              <Message>
                {i + 1}. {LINES[i % LINES.length]}
              </Message>
            </MessageGroup>
          </div>
        ))}
      </MessageScroller>
    </ChatPanel>
  )
}
