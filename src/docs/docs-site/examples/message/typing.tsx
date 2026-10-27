import { Avatar } from "@/components/ui/avatar"
import { Message, MessageGroup, TypingIndicator } from "@/components/ui/message"

export default function MessageTyping() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <MessageGroup direction="outgoing">
        <Message>Any idea why the queue backed up?</Message>
      </MessageGroup>
      <TypingIndicator avatar={<Avatar name="Jonah Park" size="sm" color="secondary" />} label="Jonah is typing…" />
    </div>
  )
}
