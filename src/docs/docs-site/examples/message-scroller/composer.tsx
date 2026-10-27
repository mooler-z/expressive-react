import { useState } from "react"

import { AttachmentChip } from "@/components/ui/attachment"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { ChatComposer } from "@/components/ui/message-scroller"
import { snackbar } from "@/components/ui/snackbar"

export default function MessageScrollerComposer() {
  const [files, setFiles] = useState(["incident-timeline.pdf", "p95-latency.png"])

  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <ChatComposer
        placeholder="Reply to #incident-412"
        onSend={(text) => {
          snackbar(`Sent: ${text}`)
          setFiles([])
        }}
        onAttach={() => snackbar("Pick files")}
        attachments={
          files.length > 0 &&
          files.map((name) => <AttachmentChip key={name} name={name} onRemove={() => setFiles((f) => f.filter((n) => n !== name))} />)
        }
        trailing={
          <IconButton aria-label="Record voice note" className="h-12 w-12 rounded-[24px]">
            <Icon name="mic" />
          </IconButton>
        }
        className="rounded-xl border-t-0 bg-surface"
      />
      <ChatComposer variant="compact" placeholder="Quick reply" onSend={(text) => snackbar(`Sent: ${text}`)} className="rounded-xl border-t-0" />
    </div>
  )
}
