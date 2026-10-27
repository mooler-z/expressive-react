import Delay from "@/docs/docs-site/examples/tooltip/delay"
import delaySrc from "@/docs/docs-site/examples/tooltip/delay?raw"
import Demo from "@/docs/docs-site/examples/tooltip/demo"
import demoSrc from "@/docs/docs-site/examples/tooltip/demo?raw"
import Placement from "@/docs/docs-site/examples/tooltip/placement"
import placementSrc from "@/docs/docs-site/examples/tooltip/placement?raw"
import Rich from "@/docs/docs-site/examples/tooltip/rich"
import richSrc from "@/docs/docs-site/examples/tooltip/rich?raw"
import RichActions from "@/docs/docs-site/examples/tooltip/rich-actions"
import richActionsSrc from "@/docs/docs-site/examples/tooltip/rich-actions?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Tooltips name an element on hover or focus. Plain tooltips are a short label on the inverse surface; rich tooltips add a subhead and supporting text on a card.",
  links: {
    m3: "https://m3.material.io/components/tooltips/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/Tooltip.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"

<TooltipTrigger>
  <IconButton aria-label="Bookmark"><Icon name="bookmark" /></IconButton>
  <Tooltip>Save to bookmarks</Tooltip>
</TooltipTrigger>`,
  examples: [
    {
      id: "placement",
      title: "Placement",
      description: (
        <>
          Plain tooltips sit 4dp from the trigger, on top by default. <InlineCode>start</InlineCode> and <InlineCode>end</InlineCode> follow the reading direction,
          and every placement flips when there isn't room.
        </>
      ),
      component: Placement,
      source: placementSrc,
    },
    {
      id: "rich",
      title: "Rich tooltip",
      description: "A subhead and up to a few lines of supporting text, below the trigger by default. Still non-interactive: nothing inside can take focus.",
      component: Rich,
      source: richSrc,
    },
    {
      id: "rich-actions",
      title: "Rich tooltip with actions",
      description: (
        <>
          Tooltip content can't be focused, so a rich tooltip with actions is a <TextLink to="/docs/popover">Popover</TextLink> styled with{" "}
          <InlineCode>richTooltipStyles</InlineCode>. It opens on press instead of hover.
        </>
      ),
      component: RichActions,
      source: richActionsSrc,
    },
    {
      id: "delay",
      title: "Delay",
      description: (
        <>
          TooltipTrigger waits 500ms before showing and 150ms before hiding. Once one tooltip is open, moving to another trigger shows its tooltip right away.
        </>
      ),
      component: Delay,
      source: delaySrc,
    },
  ],
  api: [
    {
      name: "TooltipTrigger",
      description: <>React Aria's {c("TooltipTrigger")} with M3 timing. Its first child must be a focusable React Aria element (Button, Link, IconButton…).</>,
      props: [
        { name: "delay", type: "number", default: "500", description: "Hover delay in ms before showing." },
        { name: "closeDelay", type: "number", default: "150", description: "Delay in ms before hiding." },
        { name: "isOpen · defaultOpen", type: "boolean", default: "—", description: "Controlled or initial open state." },
        { name: "onOpenChange", type: "(isOpen: boolean) => void", default: "—", description: "Called when it opens or closes." },
        { name: "isDisabled", type: "boolean", default: "false", description: "Never show the tooltip." },
        { name: "trigger", type: '"focus"', default: "—", description: "Show only on keyboard focus, not hover." },
      ],
    },
    {
      name: "Tooltip",
      description: <>Plain tooltip. React Aria {c("Tooltip")} props, plus:</>,
      props: [
        { name: "children", type: "ReactNode", default: "—", description: "The label. Keep it to a few words." },
        { name: "shortcut", type: "string", default: "—", description: "Keyboard shortcut shown after the label, e.g. “⌘B”." },
        { name: "placement", type: "Placement", default: '"top"', description: "Preferred side; flips when there isn't room." },
        { name: "offset", type: "number", default: "4", description: "Distance from the trigger in px." },
      ],
    },
    {
      name: "RichTooltip",
      description: <>React Aria {c("Tooltip")} props, plus:</>,
      props: [
        { name: "title", type: "ReactNode", default: "—", description: "Optional subhead." },
        { name: "children", type: "ReactNode", default: "—", description: "Supporting text." },
        { name: "placement", type: "Placement", default: '"bottom"', description: "Preferred side." },
        { name: "offset", type: "number", default: "4", description: "Distance from the trigger in px." },
      ],
    },
    {
      name: "RichTooltipSubhead · RichTooltipActions · richTooltipStyles",
      description: "Building blocks for an interactive rich tooltip inside a Popover.",
      props: [
        { name: "RichTooltipSubhead", type: "div", default: "—", description: "title-small, on-surface." },
        { name: "RichTooltipActions", type: "div", default: "—", description: "Row of up to two text buttons aligned to the text." },
        { name: "richTooltipStyles", type: "string", default: "—", description: "Card classes for the Popover: surface-container, 12dp corners, elevation 2, 312dp max." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        The tooltip gets {c('role="tooltip"')} and the trigger is described by it with {c("aria-describedby")}. It opens on hover after the delay and immediately
        on keyboard focus, and never on touch, so the trigger still needs its own label: an <TextLink to="/docs/icon-button">Icon button</TextLink> keeps its{" "}
        {c("aria-label")}.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Focusing the trigger shows its tooltip." },
      { keys: ["Esc"], description: "Hides the tooltip without moving focus." },
    ],
    notes: [
      <>A disabled control can't take focus, so wrap it in React Aria's {c("<Focusable>")} with a focusable span to give it a tooltip.</>,
      "Tooltip content must not be interactive; use a Popover for actions.",
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Tooltip", "Container", "Corner", "Padding", "Text"],
        rows: [
          ["Plain", "inverse-surface, min 24dp tall", "4dp", "8dp × 4dp", <>{c("body-small")} inverse-on-surface</>],
          ["Rich", "surface-container, elevation 2, max 312dp", "12dp", "16dp, 12dp top", <>subhead {c("title-small")} · body {c("body-medium")} on-surface-variant</>],
        ],
      },
    ],
    cards: [
      { title: "Timing", items: ["Show after 500ms hover", "Hide after 150ms", "Instant on keyboard focus"] },
      { title: "Position", items: ["Plain: 4dp from trigger, top", "Rich: 4dp from trigger, bottom", "Flips at viewport edges"] },
    ],
    source: <>androidx {c("PlainTooltipTokens")} and {c("RichTooltipTokens")}.</>,
  },
} satisfies ComponentDoc
