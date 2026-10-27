import Demo from "@/docs/docs-site/examples/popover/demo"
import demoSrc from "@/docs/docs-site/examples/popover/demo?raw"
import Form from "@/docs/docs-site/examples/popover/form"
import formSrc from "@/docs/docs-site/examples/popover/form?raw"
import Placement from "@/docs/docs-site/examples/popover/placement"
import placementSrc from "@/docs/docs-site/examples/popover/placement?raw"
import Filters from "@/docs/docs-site/examples/popover/filters"
import filtersSrc from "@/docs/docs-site/examples/popover/filters?raw"
import HoverCard from "@/docs/docs-site/examples/popover/hover-card"
import hoverCardSrc from "@/docs/docs-site/examples/popover/hover-card?raw"
import { TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  title: "Popover & hover card",
  description:
    "Popovers are anchored surfaces that open on press and hold controls or extra information. Hover cards preview a person or thing on hover or focus. Both use the M3 rich tooltip container and grow from their anchor.",
  links: { m3: "https://m3.material.io/components/tooltips/specs", aria: "https://react-spectrum.adobe.com/react-aria/Popover.html" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Button } from "@/components/ui/button"
import { Popover, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"

<PopoverTrigger>
  <Button>Filters</Button>
  <Popover>
    <PopoverTitle>Filter deployments</PopoverTitle>
    …
  </Popover>
</PopoverTrigger>`,
  examples: [
    {
      id: "form",
      title: "With a form",
      description: <>Focus moves into the popover and returns to the trigger when it closes. Buttons with {c('slot="close"')} close it.</>,
      component: Form,
      source: formSrc,
    },
    {
      id: "placement",
      title: "Placement",
      description: <>{c("placement")} takes React Aria placements. The popover flips when there isn't room. start and end follow the reading direction.</>,
      component: Placement,
      source: placementSrc,
    },
    { id: "filters", title: "Filter chips", description: "Controlled filter chips inside a popover; the trigger shows the count.", component: Filters, source: filtersSrc },
    {
      id: "hover-card",
      title: "Hover card",
      description: "Opens 500ms after the pointer rests on the trigger, or when it gets keyboard focus. Moving onto the card keeps it open.",
      component: HoverCard,
      source: hoverCardSrc,
    },
  ],
  api: [
    { name: "PopoverTrigger", description: <>React Aria {c("DialogTrigger")}: pair a pressable trigger with a Popover. {c("isOpen")} and {c("onOpenChange")} control it.</>, props: [] },
    {
      name: "Popover",
      description: <>React Aria {c("Popover")} with a {c("Dialog")} inside for focus management. Its other props pass through.</>,
      props: [
        { name: "placement", type: "Placement", default: '"bottom start"', description: "Position relative to the trigger." },
        { name: "offset", type: "number", default: "8", description: "Gap to the trigger in px." },
        { name: "aria-label", type: "string", default: "—", description: "Accessible name when there's no PopoverTitle." },
        { name: "isNonModal", type: "boolean", default: "false", description: "Allow interaction outside while open." },
        { name: "className", type: "string | (state) => string", default: "—", description: "Width and padding, e.g. w-80." },
      ],
    },
    { name: "PopoverTitle", description: <>React Aria {c("Heading")} in the dialog's title slot: it names the popover.</>, props: [] },
    { name: "PopoverDescription", description: <>A {c("<p>")} in body-medium on-surface-variant.</>, props: [] },
    {
      name: "HoverCard",
      props: [
        { name: "openDelay", type: "number", default: "500", description: "ms before opening on hover." },
        { name: "closeDelay", type: "number", default: "200", description: "ms before closing once the pointer leaves trigger and card." },
      ],
    },
    { name: "HoverCardTrigger", description: <>React Aria {c("Link")}: give it the {c("href")} of the thing it previews.</>, props: [] },
    {
      name: "HoverCardContent",
      description: <>A non-modal React Aria {c("Popover")}, 288dp wide.</>,
      props: [
        { name: "placement", type: "Placement", default: '"bottom start"', description: "Position relative to the trigger." },
        { name: "offset", type: "number", default: "8", description: "Gap to the trigger in px." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Popover content is a dialog: focus moves into it, is contained while it's open, and returns to the trigger on close. Name it with{" "}
        {c("PopoverTitle")} or {c("aria-label")}. Hover cards are supplementary: everything in them should also be reachable from the link they preview.
      </>
    ),
    keyboard: [
      { keys: ["Space", "Enter"], description: "On the trigger: opens the popover." },
      { keys: ["Tab"], description: "Moves between controls inside the popover." },
      { keys: ["Esc"], description: "Closes the popover and returns focus to the trigger." },
      { label: "Hover card", description: "Opens when its link gets keyboard focus; Esc on the link closes it." },
    ],
    notes: [
      <>
        For a short label on an icon button, use a <TextLink to="/docs/tooltip">Tooltip</TextLink> instead.
      </>,
      "Hover cards don't open on touch; make sure the link itself leads to the full information.",
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Container", "surface-container · level 2 · 12dp corners · 16dp padding"],
          ["Title", <>{c("title-small")} on-surface</>],
          ["Supporting text", <>{c("body-medium")} on-surface-variant</>],
          ["Offset", "8dp from the trigger"],
          ["Hover card", "288dp wide · 500ms open delay · 200ms close delay"],
        ],
      },
    ],
    cards: [{ title: "Motion", items: [<>Enter: grows from the anchor on {c("fast-spatial")} 0.6 / 800</>, <>Exit: fades on {c("fast-effects")}</>] }],
    source: (
      <>
        Container from androidx {c("RichTooltipTokens")}: {c("ContainerColor")} surface-container, {c("ContainerElevation")} level 2,{" "}
        {c("ContainerShape")} corner-medium, {c("SupportingTextFont")} body-medium. M3 has no arrow on these surfaces.
      </>
    ),
  },
} satisfies ComponentDoc
