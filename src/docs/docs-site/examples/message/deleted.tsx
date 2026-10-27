import { Avatar } from "@/components/ui/avatar"
import { Message, MessageGroup, MessageMeta } from "@/components/ui/message"

export default function MessageDeleted() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <MessageGroup avatar={<Avatar name="Jonah Park" size="sm" color="secondary" />} footer={<MessageMeta>Jonah · edited 10:21</MessageMeta>}>
        <Message>Bumping the pool to 64 connections, not 128.</Message>
      </MessageGroup>
      <MessageGroup direction="outgoing" footer={<MessageMeta>10:22</MessageMeta>}>
        <Message variant="deleted" />
      </MessageGroup>
    </div>
  )
}
