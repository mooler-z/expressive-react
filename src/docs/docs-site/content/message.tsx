import Actions from "@/docs/docs-site/examples/message/actions"
import actionsSrc from "@/docs/docs-site/examples/message/actions?raw"
import Deleted from "@/docs/docs-site/examples/message/deleted"
import deletedSrc from "@/docs/docs-site/examples/message/deleted?raw"
import Demo from "@/docs/docs-site/examples/message/demo"
import demoSrc from "@/docs/docs-site/examples/message/demo?raw"
import Grouping from "@/docs/docs-site/examples/message/grouping"
import groupingSrc from "@/docs/docs-site/examples/message/grouping?raw"
import Reply from "@/docs/docs-site/examples/message/reply"
import replySrc from "@/docs/docs-site/examples/message/reply?raw"
import Status from "@/docs/docs-site/examples/message/status"
import statusSrc from "@/docs/docs-site/examples/message/status?raw"
import Typing from "@/docs/docs-site/examples/message/typing"
import typingSrc from "@/docs/docs-site/examples/message/typing?raw"
import Voice from "@/docs/docs-site/examples/message/voice"
import voiceSrc from "@/docs/docs-site/examples/message/voice?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  title: "Message",
  description: (
    <>
      Chat bubbles. Incoming on surface-container-high, outgoing on primary, 20dp corners with a 4dp tail. Consecutive messages from one sender share an edge,
      and the corners re-shape on a spring when a message joins the group. Reactions, quotes, link cards, voice notes, delivery status and hover actions
      included. Pair with <TextLink to="/docs/message-scroller">Message scroller</TextLink> for the thread.
    </>
  ),
  preview: { component: Demo, source: demoSrc },
  usage: `import { Message, MessageGroup, MessageMeta } from "@/components/ui/message"

<MessageGroup direction="outgoing" footer={<MessageMeta status="read">09:42</MessageMeta>}>
  <Message>Ship it.</Message>
</MessageGroup>`,
  examples: [
    {
      id: "grouping",
      title: "Grouping and corner shaping",
      description: (
        <>
          MessageGroup works out first, middle and last for each bubble. Send another: the corners where bubbles meet spring to the shared 4dp edge, and{" "}
          <InlineCode>animate</InlineCode> scales the new bubble in from its tail.
        </>
      ),
      component: Grouping,
      source: groupingSrc,
    },
    {
      id: "reply",
      title: "Reply with quote",
      description: "MessageQuote sits inside a bubble and takes the bubble's content color, so it works on both directions.",
      component: Reply,
      source: replySrc,
    },
    {
      id: "status",
      title: "Delivery status and retry",
      description: (
        <>
          <InlineCode>MessageMeta status</InlineCode> shows sending, sent, delivered, read or failed. Failed adds “Not delivered” and a Retry action; dim the
          bubble with <InlineCode>status</InlineCode> on Message. Press Retry.
        </>
      ),
      component: Status,
      source: statusSrc,
    },
    {
      id: "typing",
      title: "Typing indicator",
      description: "Three dots in an incoming bubble with an optional label. Announced politely as a status.",
      component: Typing,
      source: typingSrc,
    },
    {
      id: "voice",
      title: "Voice message",
      description: (
        <>
          Pass <InlineCode>src</InlineCode> to play audio, or drive <InlineCode>progress</InlineCode> and <InlineCode>isPlaying</InlineCode> yourself. The play
          button morphs round → square while playing.
        </>
      ),
      component: Voice,
      source: voiceSrc,
    },
    {
      id: "actions",
      title: "Hover actions",
      description: "MessageActions reveals on hover or keyboard focus within the group (always visible on touch). Fill it with icon buttons, tooltips and a menu.",
      component: Actions,
      source: actionsSrc,
    },
    {
      id: "deleted",
      title: "Edited and deleted",
      description: 'variant="deleted" renders an outlined tombstone with “This message was deleted” unless you pass children. Note edits in the meta line.',
      component: Deleted,
      source: deletedSrc,
    },
  ],
  api: [
    {
      name: "MessageGroup",
      description: <>Consecutive messages from one sender. Extends {c("<div>")} props.</>,
      props: [
        { name: "direction", type: '"incoming" | "outgoing"', default: '"incoming"', description: "Side, colors and tail corner for every bubble inside." },
        { name: "avatar", type: "ReactNode", default: "—", description: "Usually an Avatar size=\"sm\". Sits beside the last bubble." },
        { name: "name", type: "ReactNode", default: "—", description: "Sender label above the first bubble." },
        { name: "footer", type: "ReactNode", default: "—", description: "Under the last bubble: MessageMeta, MessageReactions…" },
        { name: "reserveAvatar", type: "boolean", default: "false", description: "Indent as if there were an avatar, for runs that continue a previous group." },
      ],
    },
    {
      name: "Message",
      description: <>One bubble. Extends {c("<div>")} props.</>,
      props: [
        { name: "direction", type: '"incoming" | "outgoing"', default: "group's", description: "Override the group's direction." },
        { name: "variant", type: '"default" | "card" | "deleted"', default: '"default"', description: "card: no padding, clips rich content. deleted: outlined tombstone." },
        { name: "size", type: '"md" | "lg"', default: '"md"', description: "body-medium or body-large text." },
        { name: "status", type: '"sent" | "sending" | "failed"', default: '"sent"', description: "Dims the bubble while sending (80%) or after a failure (60%)." },
        { name: "animate", type: "boolean", default: "false", description: "Scale in from the tail corner on mount (skipped with reduced motion)." },
      ],
    },
    {
      name: "MessageMeta",
      props: [
        { name: "status", type: '"sending" | "sent" | "delivered" | "read" | "failed"', default: "—", description: "Delivery icon after the text, with an accessible label. Read is primary." },
        { name: "onRetry", type: "() => void", default: "—", description: "Shows a Retry text button when status is failed." },
      ],
    },
    {
      name: "MessageReactions",
      props: [
        { name: "value · defaultValue", type: "{ emoji, count, reacted? }[]", default: "[]", description: "Reaction chips; reacted ones show selected." },
        { name: "onChange", type: "(value) => void", default: "—", description: "Called with the updated list when a chip or the picker toggles a reaction." },
        { name: "picker", type: "string[]", default: '["👍","❤️","🚀","👀","😂"]', description: "Emoji in the add-reaction popover; [] hides the add button." },
        { name: "variant", type: '"outlined" | "tonal"', default: '"outlined"', description: "outlined: 28dp chips. tonal: compact 24dp chips for meta rows." },
      ],
    },
    {
      name: "VoiceMessage",
      props: [
        { name: "src", type: "string", default: "—", description: "Audio URL; playback and progress are handled internally." },
        { name: "duration", type: "number", default: "0", description: "Seconds; read from the audio once it loads." },
        { name: "progress · isPlaying · onPlayingChange", type: "number · boolean · (playing) => void", default: "—", description: "Controlled playback when there's no src." },
        { name: "waveform", type: "number[]", default: "24 bars", description: "Bar heights 0–1." },
      ],
    },
    {
      name: "More parts",
      props: [
        { name: "MessageQuote", type: "{ author?, children }", default: "—", description: "Quoted message inside a bubble." },
        { name: "MessageCard", type: "{ icon?, title, description?, children? }", default: "—", description: "Link or resource preview inside a bubble." },
        { name: "TypingIndicator", type: "{ avatar?, label? }", default: "—", description: "Incoming bubble with three dots; role=status." },
        { name: "SystemMessage", type: "HTMLAttributes", default: "—", description: "Centered pill for joins, renames and dates; role=note." },
        { name: "MessageActions", type: "HTMLAttributes", default: "—", description: "Hover/focus action row." },
        { name: "MessageTextAction", type: "ButtonProps", default: "—", description: "Small text button for meta rows (Retry, View thread)." },
        { name: "ReactionPicker · toggleReaction", type: "—", default: "—", description: "The add-reaction popover on its own, and the pure toggle helper." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Bubbles are plain text in reading order, so a screen reader reads sender, message and meta naturally. Delivery icons carry labels (“Read”, “Not
        delivered”). Reaction chips are toggle buttons named “👍 2”; the picker is a labelled dialog. Put messages inside a{" "}
        <TextLink to="/docs/message-scroller">MessageScroller</TextLink>, a {c("role=\"log\"")} region, so new messages are announced.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Reaches reaction chips, the add-reaction button, hover actions and Retry. Focusing inside a group reveals its actions." },
      { keys: ["Space", "Enter"], description: "Toggles a reaction or activates an action." },
      { keys: ["Esc"], description: "Closes the reaction picker or menu." },
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Incoming", "surface-container-high, on-surface"],
          ["Outgoing", "primary, on-primary"],
          ["Corners", "20dp; 4dp on the tail and where grouped bubbles meet"],
          ["Padding · text", <>16 × 10dp {c("body-medium")} · 16 × 12dp {c("body-large")}</>],
          ["Max width", "80% of the row"],
          ["Grouped gap", "2dp"],
          ["Avatar", "32dp column, 8dp from the bubble"],
          ["Reactions", <>28dp outlined / 24dp tonal; selected secondary-container</>],
          ["Meta", <>{c("label-small")}, 16dp icons</>],
        ],
      },
    ],
    cards: [
      {
        title: "Motion",
        items: [<>Corner re-shape: {c("fast-spatial")} 0.6 / 800 (374ms)</>, <>New bubble: {c("default-spatial")} 0.8 / 380 (414ms)</>, "Typing dots: 1.2s, 150ms stagger"],
      },
      { title: "Voice", items: ["40dp play button, 20dp → 12dp corners while playing", "Waveform fills primary as it plays"] },
    ],
    source: <>From the kit's message article, with corner and motion values on the M3 shape scale and Expressive springs.</>,
  },
} satisfies ComponentDoc
