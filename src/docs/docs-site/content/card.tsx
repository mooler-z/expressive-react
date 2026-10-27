import Clickable from "@/docs/docs-site/examples/card/clickable"
import clickableSrc from "@/docs/docs-site/examples/card/clickable?raw"
import Demo from "@/docs/docs-site/examples/card/demo"
import demoSrc from "@/docs/docs-site/examples/card/demo?raw"
import Header from "@/docs/docs-site/examples/card/header"
import headerSrc from "@/docs/docs-site/examples/card/header?raw"
import Horizontal from "@/docs/docs-site/examples/card/horizontal"
import horizontalSrc from "@/docs/docs-site/examples/card/horizontal?raw"
import Media from "@/docs/docs-site/examples/card/media"
import mediaSrc from "@/docs/docs-site/examples/card/media?raw"
import Variants from "@/docs/docs-site/examples/card/variants"
import variantsSrc from "@/docs/docs-site/examples/card/variants?raw"
import { InlineCode } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>
const div = "HTMLAttributes<HTMLDivElement>"

export default {
  description:
    "Cards hold content and actions about a single subject. Three M3 styles (elevated, filled, outlined), composable parts for media, headers and actions, and whole-card button and link variants.",
  links: { m3: "https://m3.material.io/components/cards/overview" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Button } from "@/components/ui/button"
import { Card, CardActions, CardContent, CardDescription, CardTitle } from "@/components/ui/card"

<Card variant="elevated">
  <CardContent>
    <CardTitle>Glacier Peak</CardTitle>
    <CardDescription>A stratovolcano in the North Cascades.</CardDescription>
  </CardContent>
  <CardActions>
    <Button>Open</Button>
  </CardActions>
</Card>`,
  examples: [
    {
      id: "variants",
      title: "Variants",
      description: "Elevated separates from patterned backgrounds, filled gives the subtlest separation, outlined reads on busy surfaces.",
      component: Variants,
      source: variantsSrc,
    },
    {
      id: "media",
      title: "Media",
      description: (
        <>
          <InlineCode>CardMedia</InlineCode> is an edge-to-edge slot, 16:9 by default. Pass <InlineCode>ratio</InlineCode> for another aspect, or{" "}
          <InlineCode>null</InlineCode> to size it yourself. Images and video inside get <InlineCode>object-cover</InlineCode>.
        </>
      ),
      component: Media,
      source: mediaSrc,
    },
    {
      id: "header",
      title: "Header",
      description: "CardHeader aligns an avatar, a title block and trailing actions in one 16dp-padded row.",
      component: Header,
      source: headerSrc,
    },
    {
      id: "clickable",
      title: "Clickable cards",
      description: (
        <>
          When the whole card is one action, use <InlineCode>CardButton</InlineCode> or <InlineCode>CardLink</InlineCode>. They add the state layer, ripple,
          focus ring and the hover elevation step. Don't nest other interactive elements inside them.
        </>
      ),
      component: Clickable,
      source: clickableSrc,
    },
    {
      id: "horizontal",
      title: "Horizontal layout",
      description: (
        <>
          Cards are flex columns; add flex-row and give CardMedia a width with <InlineCode>{"ratio={null}"}</InlineCode>.{" "}
          <InlineCode>CardOverline</InlineCode> carries short metadata (the episode and length) in label-medium.
        </>
      ),
      component: Horizontal,
      source: horizontalSrc,
    },
  ],
  api: [
    {
      name: "Card",
      description: <>A static {c("<div>")} container. Accepts every div attribute.</>,
      props: [{ name: "variant", type: '"elevated" | "filled" | "outlined"', default: '"elevated"', description: "Container color, border and elevation." }],
    },
    {
      name: "CardButton",
      description: <>React Aria {c("Button")} styled as a card. Accepts everything Button accepts.</>,
      props: [
        { name: "variant", type: '"elevated" | "filled" | "outlined"', default: '"elevated"', description: "Same as Card." },
        { name: "onPress", type: "(e: PressEvent) => void", default: "—", description: "Pressing anywhere on the card." },
        { name: "isDisabled", type: "boolean", default: "false", description: "Fades the card to 38% and removes it from the tab order." },
      ],
    },
    {
      name: "CardLink",
      description: <>React Aria {c("Link")} styled as a card. Accepts everything Link accepts.</>,
      props: [
        { name: "variant", type: '"elevated" | "filled" | "outlined"', default: '"elevated"', description: "Same as Card." },
        { name: "href", type: "string", default: "—", description: "Destination. Client-side routing works through React Aria's RouterProvider." },
      ],
    },
    {
      name: "CardMedia",
      description: <>Edge-to-edge media slot. Also takes {c(div)}.</>,
      props: [
        { name: "ratio", type: "number | null", default: "16 / 9", description: "Aspect ratio (width / height). null leaves sizing to you." },
      ],
    },
    {
      name: "CardHeader · CardContent · CardActions",
      description: <>Layout parts, each a {c("<div>")}: header is a 16dp row with 12dp gaps, content has 16dp padding, actions wrap and align to the end.</>,
      props: [{ name: "className", type: "string", default: "—", description: "Merged with the part's classes (tailwind-merge), e.g. justify-start on CardActions." }],
    },
    {
      name: "CardOverline · CardTitle · CardSubtitle · CardDescription",
      description: <>Text parts: label-medium overline, title-large title, body-medium subtitle and description in on-surface-variant.</>,
      props: [{ name: "className", type: "string", default: "—", description: "Override the type style, e.g. text-title-md for a smaller title." }],
    },
  ],
  accessibility: {
    description: (
      <>
        {c("Card")} is a plain container with no role. Give it a heading inside if it introduces a region. {c("CardButton")} renders a native{" "}
        {c("<button>")} and {c("CardLink")} a native {c("<a>")}, so their whole text content becomes the accessible name; keep it short or set{" "}
        {c("aria-label")}.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Focuses a CardButton or CardLink and shows the 3dp secondary focus ring." },
      { keys: ["Space", "Enter"], description: "Activates a CardButton. Enter follows a CardLink." },
    ],
    notes: [
      "Don't put buttons, links or inputs inside CardButton or CardLink: nested interactive elements aren't allowed inside a button or link. Use a static Card with CardActions instead.",
      "Disabled CardButtons keep their content readable to assistive tech and announce as disabled.",
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Variant", "Container", "Border", "Elevation", "Hover", "Pressed"],
        rows: [
          ["Elevated", c("surface-container-low"), "—", "Level 1", "Level 2", "Level 1"],
          ["Filled", c("surface-container-highest"), "—", "Level 0", "Level 1", "Level 0"],
          ["Outlined", c("surface"), <>1dp {c("outline-variant")}</>, "Level 0", "Level 1", "Level 0"],
        ],
      },
    ],
    cards: [
      { title: "Shape", items: ["12dp corners (corner medium)", "Expressive layouts may round up with className, e.g. rounded-xl (28dp)"] },
      { title: "Spacing", items: ["Content padding 16dp", "Header gap 12dp", "Actions: 8dp gap, 16dp from the edges"] },
      { title: "States", items: ["Hover state layer 8% of on-surface", "Pressed 12% + ripple", "Disabled: whole card at 38%"] },
    ],
    source: (
      <>
        androidx {c("ElevatedCardTokens")}, {c("FilledCardTokens")} and {c("OutlinedCardTokens")}.
      </>
    ),
  },
} satisfies ComponentDoc
