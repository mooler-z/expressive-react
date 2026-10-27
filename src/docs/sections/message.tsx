import * as React from "react"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CodeCommand } from "@/components/ui/code-block"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Menu, MenuItem, MenuPopover, MenuTrigger } from "@/components/ui/menu"
import {
  Message,
  MessageActions,
  MessageCard,
  MessageGroup,
  MessageMeta,
  MessageQuote,
  MessageReactions,
  SystemMessage,
  TypingIndicator,
  VoiceMessage,
} from "@/components/ui/message"
import { snackbar } from "@/components/ui/snackbar"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { Section, Variant, Variants } from "@/docs/section"

const tile = "flex min-h-24 flex-col justify-center gap-2 rounded-lg bg-surface p-4"
const bot = <Avatar size="sm" color="tertiary" icon="smart_toy" aria-label="Kestrel bot" />

function HoverActions() {
  return (
    <MessageActions>
      <TooltipTrigger>
        <IconButton size="xs" aria-label="Reply" onPress={() => snackbar("Replying to Maya")}>
          <Icon>reply</Icon>
        </IconButton>
        <Tooltip>Reply</Tooltip>
      </TooltipTrigger>
      <TooltipTrigger>
        <IconButton size="xs" aria-label="Copy text" onPress={() => snackbar("Copied message")}>
          <Icon>content_copy</Icon>
        </IconButton>
        <Tooltip>Copy</Tooltip>
      </TooltipTrigger>
      <MenuTrigger>
        <IconButton size="xs" aria-label="More actions">
          <Icon>more_vert</Icon>
        </IconButton>
        <MenuPopover placement="bottom end">
          <Menu onAction={(key) => snackbar(`${key} · demo action`)}>
            <MenuItem id="Pin" icon="keep">Pin</MenuItem>
            <MenuItem id="Forward" icon="forward">Forward</MenuItem>
            <MenuItem id="Mark unread" icon="mark_chat_unread">Mark unread</MenuItem>
          </Menu>
        </MenuPopover>
      </MenuTrigger>
    </MessageActions>
  )
}

export default function MessageSection() {
  return (
    <Section
      id="message"
      description="Incoming bubbles on surface-container-high, outgoing on primary, 20dp corners with a 4dp tail corner, reactions as chips and a centered system message. Hover a message for quick actions."
    >
      <div className="space-y-4">
        <SystemMessage>Today · Maya joined the thread</SystemMessage>
        <MessageGroup
          avatar={<Avatar name="Maya Lindqvist" size="sm" />}
          footer={
            <div className="flex items-center gap-2">
              <MessageMeta>Maya · 09:41</MessageMeta>
              <MessageReactions variant="tonal" picker={[]} defaultValue={[{ emoji: "👍", count: 2 }]} />
            </div>
          }
        >
          <div className="flex w-full items-center gap-2">
            <Message size="lg" className="max-w-[75%]">
              Canary held for 30 minutes with p95 under 200 ms. Promoting to 100%?
            </Message>
            <HoverActions />
          </div>
        </MessageGroup>
        <MessageGroup direction="outgoing" footer={<MessageMeta status="read">09:42</MessageMeta>}>
          <Message size="lg" className="max-w-[75%]">
            Yes. Ship it, I'll watch the dashboards.
          </Message>
        </MessageGroup>
        <MessageGroup
          avatar={bot}
          footer={<MessageReactions defaultValue={[{ emoji: "🎉", count: 1, reacted: true }]} />}
        >
          <Message size="lg" className="max-w-[75%]">
            Rollout complete. Error rate 0.02%, no policy warnings.
            <MessageCard icon="monitoring" title="checkout-api · live dashboard" description="grid.kestrel.io/d/checkout" />
          </Message>
        </MessageGroup>
      </div>

      <Variants cols="md:grid-cols-2">
        <Variant n={1} label="Grouped · corner shaping" className={tile}>
          <GroupedDemo />
        </Variant>

        <Variant n={2} label="Reply · quote" className={tile}>
          <MessageGroup avatar={<Avatar name="Maya Lindqvist" size="sm" />}>
            <Message>Can someone own the ledger p95 alert?</Message>
          </MessageGroup>
          <MessageGroup direction="outgoing" footer={<MessageMeta>09:44</MessageMeta>}>
            <Message className="px-3">
              <MessageQuote author="Maya">Can someone own the ledger p95 alert?</MessageQuote>
              <div className="px-1">I'll take it, looking at traces now.</div>
            </Message>
          </MessageGroup>
        </Variant>

        <Variant n={3} label="Failed to send" className={tile}>
          <FailedDemo />
        </Variant>

        <Variant n={4} label="Typing indicator" className={tile}>
          <TypingIndicator avatar={<Avatar name="Jonah Park" size="sm" color="secondary" />} label="Jonah is typing…" />
        </Variant>

        <Variant n={5} label="Voice message" className={tile}>
          <VoiceDemo />
        </Variant>

        <Variant n={6} label="Code snippet" className={tile}>
          <MessageGroup avatar={bot} footer={<MessageMeta>Kestrel bot</MessageMeta>}>
            <Message variant="card" className="max-w-[90%] p-3">
              <div className="px-1">Run this to roll back:</div>
              <CodeCommand
                command="kestrel rollback checkout-api --to 4.1.2"
                onCopied={() => snackbar("Command copied")}
                className="mt-2 h-10 bg-surface-container-lowest text-body-sm"
              />
            </Message>
          </MessageGroup>
        </Variant>

        <Variant n={7} label="Edited & deleted" className={tile}>
          <MessageGroup direction="outgoing" footer={<MessageMeta>11:20 · Edited</MessageMeta>}>
            <Message>Promoting at 14:00, not 13:30.</Message>
          </MessageGroup>
          <MessageGroup avatar={<Avatar name="Ana Ruiz" size="sm" color="tertiary" />}>
            <Message variant="deleted" />
          </MessageGroup>
        </Variant>

        <Variant n={8} label="Actions card" className={tile}>
          <ActionsCardDemo />
        </Variant>
      </Variants>
    </Section>
  )
}

function GroupedDemo() {
  const [mine, setMine] = React.useState(["On it.", "PR is up, 15 → 40 min."])
  return (
    <>
      <MessageGroup name="Jonah" avatar={<Avatar name="Jonah Park" size="sm" color="secondary" />}>
        <Message>Scheduler alerts are noisy again.</Message>
        <Message>Three pages overnight, all the same cron.</Message>
        <Message>Can we raise the threshold?</Message>
      </MessageGroup>
      <MessageGroup
        direction="outgoing"
        footer={
          <div className="flex items-center gap-2">
            <Button
              size="xs"
              variant="text"
              isDisabled={mine.length > 4}
              onPress={() => setMine((m) => [...m, ["Merged.", "Deploying now.", "Done ✅"][m.length - 2]])}
            >
              <Icon>add_comment</Icon>
              Send another
            </Button>
            <MessageMeta status="read">09:12</MessageMeta>
          </div>
        }
      >
        {mine.map((t, i) => (
          <Message key={t} animate={i > 1}>
            {t}
          </Message>
        ))}
      </MessageGroup>
    </>
  )
}

function FailedDemo() {
  const [sent, setSent] = React.useState(false)
  return (
    <MessageGroup
      direction="outgoing"
      footer={
        sent ? (
          <MessageMeta status="delivered">09:51</MessageMeta>
        ) : (
          <MessageMeta
            status="failed"
            onRetry={() => {
              setSent(true)
              snackbar("Message sent")
            }}
          />
        )
      }
    >
      <Message status={sent ? "sent" : "failed"}>Rolling back checkout-api to 4.1.2</Message>
    </MessageGroup>
  )
}

const VOICE_SECONDS = 14

function VoiceDemo() {
  const [playing, setPlaying] = React.useState(false)
  const [progress, setProgress] = React.useState(0.38)
  React.useEffect(() => {
    if (!playing) return
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 1) {
          setPlaying(false)
          return 0
        }
        return Math.min(1, p + 0.1 / VOICE_SECONDS)
      })
    }, 100)
    return () => clearInterval(t)
  }, [playing])
  return (
    <MessageGroup avatar={<Avatar name="Maya Lindqvist" size="sm" />} footer={<MessageMeta>Maya · 10:02</MessageMeta>}>
      <Message variant="card" className="w-full max-w-[280px]">
        <VoiceMessage duration={VOICE_SECONDS} progress={progress} isPlaying={playing} onPlayingChange={setPlaying} />
      </Message>
    </MessageGroup>
  )
}

function ActionsCardDemo() {
  const [state, setState] = React.useState<"idle" | "pending" | "approved">("idle")
  return (
    <MessageGroup avatar={bot} footer={<MessageMeta>Kestrel bot · 13:58</MessageMeta>}>
      <Message variant="card" className="w-full max-w-[300px]">
        <div className="p-4">
          <div className="flex items-start gap-2 text-title-md">
            <Icon className="mt-0.5 text-primary">rocket_launch</Icon>
            Promote checkout-api 4.2.0 to 100%?
          </div>
          <div className="mt-1 text-body-sm text-on-surface-variant">Canary healthy for 30 min · p95 142 ms · errors 0.02%</div>
        </div>
        <div className="flex gap-2 border-t border-outline-variant p-3">
          <Button
            className="flex-1"
            isPending={state === "pending"}
            isDisabled={state === "approved"}
            onPress={() => {
              setState("pending")
              setTimeout(() => {
                setState("approved")
                snackbar("Promotion approved")
              }, 1200)
            }}
          >
            {state === "approved" ? "Approved" : state === "pending" ? "Approving…" : "Approve"}
          </Button>
          <Button variant="outlined" isDisabled={state !== "idle"} onPress={() => snackbar("Rollout held at 50%")}>
            Hold
          </Button>
        </div>
      </Message>
    </MessageGroup>
  )
}
