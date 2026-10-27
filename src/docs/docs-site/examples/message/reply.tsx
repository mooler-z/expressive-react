import { Avatar } from "@/components/ui/avatar"
import { Message, MessageGroup, MessageMeta, MessageQuote } from "@/components/ui/message"

export default function MessageReply() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <MessageGroup avatar={<Avatar name="Maya Lindqvist" size="sm" />}>
        <Message>Can someone own the ledger p95 alert?</Message>
      </MessageGroup>
      <MessageGroup direction="outgoing" footer={<MessageMeta>09:44</MessageMeta>}>
        <Message className="px-3">
          <MessageQuote author="Maya">Can someone own the ledger p95 alert?</MessageQuote>
          <div className="px-1">I'll take it, looking at traces now.</div>
        </Message>
      </MessageGroup>
    </div>
  )
}
