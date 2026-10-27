import { useState } from "react"

import { Message, MessageGroup, MessageMeta, type MessageStatusValue } from "@/components/ui/message"

export default function MessageStatus() {
  const [status, setStatus] = useState<MessageStatusValue>("failed")

  const retry = () => {
    setStatus("sending")
    setTimeout(() => setStatus("delivered"), 1200)
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <MessageGroup direction="outgoing" footer={<MessageMeta status="read">09:51</MessageMeta>}>
        <Message>Deploy window is 14:00–15:00.</Message>
      </MessageGroup>
      <MessageGroup
        direction="outgoing"
        footer={
          <MessageMeta status={status} onRetry={retry}>
            {status === "failed" ? undefined : "09:52"}
          </MessageMeta>
        }
      >
        <Message status={status === "failed" ? "failed" : status === "sending" ? "sending" : "sent"}>Can you approve the change request?</Message>
      </MessageGroup>
    </div>
  )
}
