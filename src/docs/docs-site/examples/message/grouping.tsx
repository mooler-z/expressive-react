import { useState } from "react"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Message, MessageGroup, MessageMeta } from "@/components/ui/message"

const REPLIES = ["Pager is quiet now.", "Closing the incident.", "Postmortem draft is in the doc."]

export default function MessageGrouping() {
  const [sent, setSent] = useState(["Rolled back checkout-api to 4.1.2."])

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <MessageGroup avatar={<Avatar name="Jonah Park" size="sm" color="secondary" />} footer={<MessageMeta>Jonah · 10:02</MessageMeta>}>
        <Message>Saw the spike too.</Message>
        <Message>Was it the new pool size?</Message>
      </MessageGroup>
      <MessageGroup direction="outgoing" footer={<MessageMeta status="delivered">10:04</MessageMeta>}>
        {sent.map((text) => (
          <Message key={text} animate>
            {text}
          </Message>
        ))}
      </MessageGroup>
      <Button
        variant="tonal"
        size="sm"
        className="self-center"
        isDisabled={sent.length > REPLIES.length}
        onPress={() => setSent((s) => [...s, REPLIES[s.length - 1]])}
      >
        Send another
      </Button>
    </div>
  )
}
