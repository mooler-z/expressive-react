import { Avatar } from "@/components/ui/avatar"
import { Message, MessageCard, MessageGroup, MessageMeta, MessageReactions, SystemMessage } from "@/components/ui/message"

export default function MessageDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <SystemMessage>Today · Maya joined the thread</SystemMessage>
      <MessageGroup
        avatar={<Avatar name="Maya Lindqvist" size="sm" />}
        name="Maya"
        footer={<MessageReactions variant="tonal" defaultValue={[{ emoji: "👍", count: 2 }]} />}
      >
        <Message>Canary held for 30 minutes with p95 under 200 ms.</Message>
        <Message>Promoting to 100%?</Message>
      </MessageGroup>
      <MessageGroup direction="outgoing" footer={<MessageMeta status="read">09:42</MessageMeta>}>
        <Message>Yes. Ship it, I'll watch the dashboards.</Message>
      </MessageGroup>
      <MessageGroup avatar={<Avatar size="sm" color="tertiary" icon="smart_toy" aria-label="Kestrel bot" />} footer={<MessageMeta>Kestrel bot · 09:47</MessageMeta>}>
        <Message>
          Rollout complete. Error rate 0.02%.
          <MessageCard icon="monitoring" title="checkout-api · live dashboard" description="grid.kestrel.io/d/checkout" />
        </Message>
      </MessageGroup>
    </div>
  )
}
