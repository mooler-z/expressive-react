import Collapsible from "@/docs/docs-site/examples/accordion/collapsible"
import collapsibleSrc from "@/docs/docs-site/examples/accordion/collapsible?raw"
import Demo from "@/docs/docs-site/examples/accordion/demo"
import demoSrc from "@/docs/docs-site/examples/accordion/demo?raw"
import Expressive from "@/docs/docs-site/examples/accordion/expressive"
import expressiveSrc from "@/docs/docs-site/examples/accordion/expressive?raw"
import ListExample from "@/docs/docs-site/examples/accordion/list"
import listSrc from "@/docs/docs-site/examples/accordion/list?raw"
import Numbered from "@/docs/docs-site/examples/accordion/numbered"
import numberedSrc from "@/docs/docs-site/examples/accordion/numbered?raw"
import Outlined from "@/docs/docs-site/examples/accordion/outlined"
import outlinedSrc from "@/docs/docs-site/examples/accordion/outlined?raw"
import { InlineCode } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>
const indicatorType = '"chevron" | "chevron-right" | "plus" | "unfold" | "none"'

export default {
  description:
    "Accordions stack expandable sections; Collapsible is a single show/hide region. Six styles, panels that animate their height on an M3 spring, and full keyboard support from React Aria's Disclosure.",
  links: { aria: "https://react-spectrum.adobe.com/react-aria/DisclosureGroup.html" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Accordion, AccordionItem } from "@/components/ui/accordion"

<Accordion defaultExpandedKeys={["install"]}>
  <AccordionItem id="install" title="How do I install it?">
    Run npx shadcn add @expressive/accordion.
  </AccordionItem>
</Accordion>`,
  examples: [
    {
      id: "expressive",
      title: "Expressive",
      description: "Pill items that morph to 20dp corners and primary-container when open. The plus indicator turns into a ×.",
      component: Expressive,
      source: expressiveSrc,
    },
    {
      id: "list",
      title: "List with icons and counts",
      description: (
        <>
          In the <InlineCode>list</InlineCode> variant a <InlineCode>leading</InlineCode> string renders a primary icon; <InlineCode>trailing</InlineCode> shows
          meta before the indicator.
        </>
      ),
      component: ListExample,
      source: listSrc,
    },
    {
      id: "numbered",
      title: "Numbered steps",
      description: "The number badge fills with primary while its step is open.",
      component: Numbered,
      source: numberedSrc,
    },
    {
      id: "outlined",
      title: "Outlined and flush",
      description: "allowsMultipleExpanded keeps several panels open; isDisabled on an item removes it from interaction.",
      component: Outlined,
      source: outlinedSrc,
    },
    {
      id: "collapsible",
      title: "Collapsible",
      description: "A single disclosure. Outlined uses a trailing unfold indicator; tonal and plain lead with a chevron that turns.",
      component: Collapsible,
      source: collapsibleSrc,
    },
  ],
  api: [
    {
      name: "Accordion",
      description: <>React Aria {c("DisclosureGroup")}: also takes expandedKeys, defaultExpandedKeys, onExpandedChange, isDisabled.</>,
      props: [
        { name: "variant", type: '"tonal" | "flush" | "outlined" | "list" | "expressive" | "numbered"', default: '"tonal"', description: "Visual style." },
        { name: "allowsMultipleExpanded", type: "boolean", default: "false", description: "Let more than one item be open." },
        { name: "defaultExpandedKeys", type: "Iterable<Key>", default: "—", description: "Items open initially (match AccordionItem ids)." },
        { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", default: "3", description: "Heading level wrapping each trigger." },
      ],
    },
    {
      name: "AccordionItem",
      description: <>React Aria {c("Disclosure")}: also takes id, isExpanded, defaultExpanded, onExpandedChange, isDisabled.</>,
      props: [
        { name: "title", type: "ReactNode", default: "—", description: "Trigger label (required)." },
        { name: "children", type: "ReactNode", default: "—", description: "Panel content." },
        { name: "leading", type: "ReactNode", default: "—", description: "Leading slot. A string renders a primary Material Symbol." },
        { name: "trailing", type: "ReactNode", default: "—", description: "Meta before the indicator, e.g. a count." },
        { name: "number", type: "ReactNode", default: "—", description: "Numbered badge (numbered variant)." },
        { name: "indicator", type: indicatorType, default: "per variant", description: "Open/closed glyph. Expressive defaults to plus, the rest to chevron." },
        { name: "triggerClassName · panelClassName", type: "string", default: "—", description: "Classes for the trigger button and the panel's inner box." },
      ],
    },
    {
      name: "Collapsible",
      description: <>A single React Aria {c("Disclosure")}.</>,
      props: [
        { name: "title", type: "ReactNode", default: "—", description: "Trigger label (required)." },
        { name: "variant", type: '"outlined" | "tonal" | "plain"', default: '"outlined"', description: "Visual style." },
        { name: "indicator", type: indicatorType, default: "outlined → unfold, else chevron-right", description: "chevron-right renders leading; the others trailing." },
        { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", default: "3", description: "Heading level wrapping the trigger." },
        { name: "triggerClassName · panelClassName", type: "string", default: "—", description: "Classes for the trigger and the panel." },
      ],
    },
    {
      name: "DisclosureIndicatorIcon",
      description: "The animated glyph on its own, for custom disclosures.",
      props: [{ name: "kind", type: indicatorType, default: "—", description: "Which glyph to render. none renders nothing." }],
    },
  ],
  accessibility: {
    description: (
      <>
        Each trigger is a {c("<button>")} inside a heading, with {c("aria-expanded")} and {c("aria-controls")} pointing at its panel. Closed panels use
        {c(" hidden=\"until-found\"")}, so the browser's find-in-page can open them.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves between triggers and into open panels." },
      { keys: ["Space", "Enter"], description: "Expands or collapses the focused item." },
    ],
    notes: ["Set headingLevel so triggers fit your page's heading outline.", "Height animation is skipped under prefers-reduced-motion."],
  },
  spec: {
    tables: [
      {
        columns: ["Variant", "Item", "Open", "Trigger"],
        rows: [
          ["Tonal", <>{c("surface")}, 16dp corners</>, c("surface-container-high"), <>56dp, {c("title-medium")}</>],
          ["Flush", "dividers only", "—", <>48dp, {c("title-small")}</>],
          ["Outlined", <>1dp {c("outline-variant")}, 16dp</>, <>border {c("primary")}</>, <>48dp, {c("title-small")}</>],
          ["List", "12dp corners", c("surface-container"), <>48dp, {c("label-large")}</>],
          ["Expressive", <>{c("surface-container-high")}, 28dp</>, <>{c("primary-container")}, 20dp</>, <>56dp, {c("title-small")}</>],
          ["Numbered", <>{c("surface")}, 16dp</>, <>badge {c("primary")}</>, <>48dp, {c("title-small")}</>],
        ],
      },
    ],
    cards: [{ title: "Motion", items: ["Panel height: default-spatial (0.8 / 380)", "Indicator turn and shape morph: fast-spatial (0.6 / 800)", "No height animation under reduced motion"] }],
    source: <>M3 has no accordion component; these follow the kit's styles with M3 role tokens and the Expressive motion scheme.</>,
  },
} satisfies ComponentDoc
