import { useState } from "react"

import { Avatar } from "@/components/ui/avatar"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Message, MessageGroup, MessageMeta, TypingIndicator } from "@/components/ui/message"
import { ChatComposer, ChatHeader, ChatPanel, DateSeparator, MessageScroller } from "@/components/ui/message-scroller"

type Turn = { id: number; from: "me" | "maya"; text: string }

const maya = <Avatar name="Maya Lindqvist" size="sm" />

export default function MessageScrollerDemo() {
  const [turns, setTurns] = useState<Turn[]>([
    { id: 1, from: "maya", text: "Canary is at 25%." },
    { id: 2, from: "maya", text: "p95 is flat, error rate 0.02%." },
    { id: 3, from: "me", text: "Nice. Hold there for ten minutes?" },
  ])
  const [typing, setTyping] = useState(false)

  const send = (text: string) => {
    setTurns((t) => [...t, { id: Date.now(), from: "me", text }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setTurns((t) => [...t, { id: Date.now(), from: "maya", text: "On it. I'll post when we promote." }])
    }, 1400)
  }

  // Consecutive turns from one sender form a group
  const groups = turns.reduce<Turn[][]>((acc, t) => {
    const last = acc[acc.length - 1]
    if (last && last[0].from === t.from) last.push(t)
    else acc.push([t])
    return acc
  }, [])

  return (
    <ChatPanel elevated className="h-[480px] w-full max-w-lg">
      <ChatHeader
        title="checkout-rollout"
        subtitle="Maya, you"
        avatar={maya}
        bordered
        actions={
          <IconButton aria-label="Channel info">
            <Icon name="info" />
          </IconButton>
        }
      />
      <MessageScroller aria-label="checkout-rollout messages">
        <DateSeparator>Today</DateSeparator>
        {groups.map((g) =>
          g[0].from === "me" ? (
            <MessageGroup key={g[0].id} direction="outgoing" footer={<MessageMeta status="read">now</MessageMeta>}>
              {g.map((t) => (
                <Message key={t.id} animate>
                  {t.text}
                </Message>
              ))}
            </MessageGroup>
          ) : (
            <MessageGroup key={g[0].id} avatar={maya}>
              {g.map((t) => (
                <Message key={t.id} animate>
                  {t.text}
                </Message>
              ))}
            </MessageGroup>
          ),
        )}
        {typing && <TypingIndicator avatar={maya} />}
      </MessageScroller>
      <ChatComposer placeholder="Message #checkout-rollout" onSend={send} />
    </ChatPanel>
  )
}
