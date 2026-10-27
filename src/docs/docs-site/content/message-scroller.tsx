import Composer from "@/docs/docs-site/examples/message-scroller/composer"
import composerSrc from "@/docs/docs-site/examples/message-scroller/composer?raw"
import Demo from "@/docs/docs-site/examples/message-scroller/demo"
import demoSrc from "@/docs/docs-site/examples/message-scroller/demo?raw"
import History from "@/docs/docs-site/examples/message-scroller/history"
import historySrc from "@/docs/docs-site/examples/message-scroller/history?raw"
import Unread from "@/docs/docs-site/examples/message-scroller/unread"
import unreadSrc from "@/docs/docs-site/examples/message-scroller/unread?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  title: "Message scroller",
  description: (
    <>
      The thread around <TextLink to="/docs/message">messages</TextLink>: a 64dp header, a scroll region that sticks to the newest message and keeps its
      place when history loads above, sticky date pills, a “jump to latest” button that counts unread arrivals, and a composer whose textarea grows.
    </>
  ),
  preview: { component: Demo, source: demoSrc },
  usage: `import { ChatComposer, ChatHeader, ChatPanel, MessageScroller } from "@/components/ui/message-scroller"

<ChatPanel className="h-[480px]">
  <ChatHeader title="#platform" subtitle="8 members" />
  <MessageScroller onLoadMore={loadOlder} hasMore={hasMore}>
    {messages}
  </MessageScroller>
  <ChatComposer onSend={send} placeholder="Message #platform" />
</ChatPanel>`,
  examples: [
    {
      id: "history",
      title: "Loading history",
      description: (
        <>
          <InlineCode>onLoadMore</InlineCode> fires when you scroll near the top, or pull, PageUp or ↑ at the top of a short thread. Return a promise: a loading
          row shows, and the visible message stays exactly where it was while older rows are inserted above. Scroll up.
        </>
      ),
      component: History,
      source: historySrc,
    },
    {
      id: "unread",
      title: "Unread count and jump to latest",
      description: (
        <>
          At the bottom, new messages scroll into view. Scroll up and they're counted on the jump button instead. <InlineCode>jumpLabel={false}</InlineCode> gives
          the icon-only small FAB; UnreadDivider marks where new messages start. A message arrives every 2.5s here.
        </>
      ),
      component: Unread,
      source: unreadSrc,
    },
    {
      id: "composer",
      title: "Composer",
      description: (
        <>
          Enter sends the trimmed text and clears the field; Shift+Enter adds a line. The tonal composer takes <InlineCode>attachments</InlineCode> above the
          text and <InlineCode>trailing</InlineCode> controls before Send. The compact variant is a one-line pill.
        </>
      ),
      component: Composer,
      source: composerSrc,
    },
  ],
  api: [
    {
      name: "MessageScroller",
      description: <>The scroll region. Extends {c("<div>")} props; give its parent a height (ChatPanel with a height does).</>,
      props: [
        { name: "onLoadMore", type: "() => void | Promise<void>", default: "—", description: "Load older messages. The scroll position is preserved while they're inserted." },
        { name: "hasMore", type: "boolean", default: "false", description: "Whether onLoadMore should fire." },
        { name: "loadingLabel", type: "ReactNode", default: '"Loading earlier messages…"', description: "Text beside the loading indicator." },
        { name: "jumpLabel", type: "string | false", default: '"Jump to latest"', description: "Extended button label; false renders the icon-only small FAB." },
        { name: "contentClassName", type: "string", default: "—", description: "Classes for the inner list (spacing, padding)." },
        { name: "aria-label", type: "string", default: '"Messages"', description: "Name of the log region." },
      ],
    },
    {
      name: "ChatComposer",
      description: <>React Aria {c("TextField")} props (value, onChange, isDisabled…), plus:</>,
      props: [
        { name: "onSend", type: "(text: string) => void", default: "—", description: "Called with the trimmed text on Enter or Send. The field then clears." },
        { name: "placeholder", type: "string", default: '"Message"', description: "Also the field's accessible name unless aria-label is set." },
        { name: "onAttach", type: "() => void", default: "—", description: "Shows the attach button." },
        { name: "attachLabel", type: "string", default: '"Attach"', description: "Accessible name of the attach button." },
        { name: "attachments", type: "ReactNode", default: "—", description: "Chips or thumbnails above the text row." },
        { name: "trailing", type: "ReactNode", default: "—", description: "Extra controls before Send (emoji, mic)." },
        { name: "variant", type: '"tonal" | "compact"', default: '"tonal"', description: "tonal: 28dp container, textarea grows to 160dp. compact: one-line pill." },
      ],
    },
    {
      name: "ChatPanel · ChatHeader",
      props: [
        { name: "ChatPanel elevated", type: "boolean", default: "false", description: "Clipped surface stacking header, scroller and composer; elevated adds level 1." },
        { name: "ChatHeader title · subtitle", type: "ReactNode", default: "—", description: "Title and supporting line." },
        { name: "ChatHeader avatar", type: "ReactNode", default: "—", description: "Avatar or channel glyph." },
        { name: "ChatHeader onBack", type: "() => void", default: "—", description: "Shows a back arrow." },
        { name: "ChatHeader actions", type: "ReactNode", default: "—", description: "Trailing icon buttons or a menu." },
        { name: "ChatHeader bordered", type: "boolean", default: "false", description: "Divider under the header." },
      ],
    },
    {
      name: "DateSeparator · UnreadDivider",
      props: [
        { name: "DateSeparator", type: "HTMLAttributes", default: "—", description: "Day pill that sticks to the top while its messages scroll under it." },
        { name: "UnreadDivider", type: "HTMLAttributes", default: '"New messages"', description: "Labelled rule marking the first unread message." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        The scroll region is a focusable {c("role=\"log\"")}, so screen readers announce messages as they're added without moving focus. The jump button
        leaves the tab order while hidden and names the unread count when it's icon-only. The composer's textarea is labelled by its placeholder (or{" "}
        {c("aria-label")}).
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Focuses the log, then its interactive messages, the jump button when visible, and the composer." },
      { keys: ["↑", "PageUp", "Home"], description: "Scroll the focused log; at the top, these also load older messages." },
      { keys: ["Enter"], description: "In the composer: send. Ignored while an IME is composing." },
      { keys: ["Shift", "Enter"], description: "In the composer: new line." },
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Header", "64dp, title-medium + body-small subtitle"],
          ["Date pill", "surface-container-high, label-medium, level 1, sticky"],
          ["Jump to latest", "40dp, 12dp corners → 8dp pressed, level 3; extended on secondary-container, icon-only on primary-container"],
          ["Unread badge", "Large badge on the button, max 99"],
          ["Composer (tonal)", "28dp surface-container-high container, 48dp attach/send buttons, textarea 48–160dp"],
          ["Composer (compact)", "40dp pill on surface-container-high"],
        ],
      },
    ],
    cards: [{ title: "Motion", items: [<>Jump button in/out and press: {c("fast-spatial")} 0.6 / 800</>, "Jump scroll is smooth unless reduced motion is on"] }],
    source: <>From the kit's message-scroller article; FAB sizes from androidx {c("FabSmallTokens")}.</>,
  },
} satisfies ComponentDoc
