import Card from "@/docs/docs-site/examples/ripple/card"
import cardSrc from "@/docs/docs-site/examples/ripple/card?raw"
import Colors from "@/docs/docs-site/examples/ripple/colors"
import colorsSrc from "@/docs/docs-site/examples/ripple/colors?raw"
import Demo from "@/docs/docs-site/examples/ripple/demo"
import demoSrc from "@/docs/docs-site/examples/ripple/demo?raw"
import { InlineCode } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "The press ripple used by every Expressive button, as a drop-in child for your own pressable elements. Pair it with the state-layer utility for hover, focus and pressed overlays.",
  preview: { component: Demo, source: demoSrc },
  usage: `import { Ripple } from "@/components/ui/ripple"

<button className="state-layer relative rounded-xl bg-primary-container">
  Press me
  <Ripple />
</button>`,
  examples: [
    {
      id: "card",
      title: "On a card or link",
      description: (
        <>
          Any element works: a link, a card, a list row. The parent needs <InlineCode>relative</InlineCode>; the ripple clips to its corners.
        </>
      ),
      component: Card,
      source: cardSrc,
    },
    {
      id: "colors",
      title: "Color",
      description: (
        <>
          The ripple paints in {c("currentColor")} at 14%, like the state layer, so it follows the content color. Set a text color on the Ripple to change it.
        </>
      ),
      component: Colors,
      source: colorsSrc,
    },
  ],
  api: [
    {
      name: "Ripple",
      description: "Listens to its parent's pointer events, so it works inside React Aria components and plain elements alike.",
      props: [{ name: "className", type: "string", default: "—", description: "Classes for the clipping layer, e.g. a text color." }],
    },
    {
      name: "state-layer · focus-ring (CSS utilities)",
      description: "From expressive.css. They read React Aria's data attributes and fall back to :hover / :focus-visible / :active on plain elements.",
      props: [
        { name: "state-layer", type: "utility", default: "—", description: "currentColor overlay: hover 8%, focus 10%, pressed 12%. Off when disabled." },
        { name: "focus-ring", type: "utility", default: "—", description: "3dp secondary outline, offset 2dp, for keyboard focus only." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Purely visual: the ripple layer is {c("aria-hidden")} and ignores pointer events. The element you put it in is responsible for being focusable and having a
        role; a native {c("<button>")} or {c("<a>")} gets that for free.
      </>
    ),
    notes: [
      "No ripple under prefers-reduced-motion; the state layer still shows the press.",
      "Disabled parents (disabled, data-disabled or aria-disabled) don't ripple.",
      "Keyboard presses show the state layer, not a ripple.",
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Phase", "Value"],
        rows: [
          ["Size", "2.2 × the element's longest side, centred on the pointer"],
          ["Grow", "scale 0 → 1 over 450ms, emphasized easing"],
          ["Opacity", "14% currentColor"],
          ["Release", "fades out over 350ms"],
        ],
      },
    ],
    cards: [{ title: "State layer", items: ["Hover 8%", "Focus 10%", "Pressed 12%", "Overlay transition: fast-effects spring"] }],
    source: "M3 interaction states (m3.material.io/foundations/interaction/states).",
  },
} satisfies ComponentDoc
