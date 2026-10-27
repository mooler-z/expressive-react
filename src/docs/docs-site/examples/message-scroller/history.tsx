import { useState } from "react"

import { Message, MessageGroup, MessageMeta } from "@/components/ui/message"
import { ChatPanel, DateSeparator, MessageScroller } from "@/components/ui/message-scroller"

type Day = { label: string; lines: string[] }

const OLDER: Day[] = [
  { label: "Monday", lines: ["Kicked off the ledger migration.", "Shadow writes are on."] },
  { label: "Last week", lines: ["Capacity review moved to Thursday.", "Budget alert at 80%."] },
  { label: "October 2", lines: ["Welcome to #platform!"] },
]

export default function MessageScrollerHistory() {
  const [days, setDays] = useState<Day[]>([{ label: "Today", lines: ["Migration finished at 09:12.", "Verifying row counts now.", "All 4.2M rows match."] }])
  const hasMore = days.length <= OLDER.length

  const loadOlder = () =>
    new Promise<void>((resolve) =>
      setTimeout(() => {
        setDays((d) => [OLDER[d.length - 1], ...d])
        resolve()
      }, 900),
    )

  return (
    <ChatPanel className="h-80 w-full max-w-md border border-outline-variant">
      <MessageScroller onLoadMore={loadOlder} hasMore={hasMore} aria-label="Platform channel history">
        {days.map((d) => (
          <div key={d.label} className="space-y-3">
            <DateSeparator>{d.label}</DateSeparator>
            <MessageGroup footer={<MessageMeta>Kestrel bot</MessageMeta>}>
              {d.lines.map((line) => (
                <Message key={line}>{line}</Message>
              ))}
            </MessageGroup>
          </div>
        ))}
      </MessageScroller>
    </ChatPanel>
  )
}
