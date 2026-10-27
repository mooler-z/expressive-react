import Colors from "@/docs/docs-site/examples/loading-indicator/colors"
import colorsSrc from "@/docs/docs-site/examples/loading-indicator/colors?raw"
import Demo from "@/docs/docs-site/examples/loading-indicator/demo"
import demoSrc from "@/docs/docs-site/examples/loading-indicator/demo?raw"
import Inline from "@/docs/docs-site/examples/loading-indicator/inline"
import inlineSrc from "@/docs/docs-site/examples/loading-indicator/inline?raw"
import Shapes from "@/docs/docs-site/examples/loading-indicator/shapes"
import shapesSrc from "@/docs/docs-site/examples/loading-indicator/shapes?raw"
import Sizes from "@/docs/docs-site/examples/loading-indicator/sizes"
import sizesSrc from "@/docs/docs-site/examples/loading-indicator/sizes?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "New in M3 Expressive: a rotating shape that morphs through the shape library, for waits too short to measure. Use it in place of an indeterminate circular progress indicator for waits under about five seconds.",
  links: { m3: "https://m3.material.io/components/loading-indicator/overview" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { LoadingIndicator } from "@/components/ui/loading-indicator"

<LoadingIndicator aria-label="Loading messages" />
<LoadingIndicator contained />`,
  examples: [
    {
      id: "sizes",
      title: "Sizes",
      description: (
        <>
          <InlineCode>size</InlineCode> sets the outer box; the shape fills 79% of it, the spec's 38dp in 48dp.
        </>
      ),
      component: Sizes,
      source: sizesSrc,
    },
    {
      id: "colors",
      title: "Colors",
      description: "The shape fills with currentColor and the container is a background, so text and bg utilities recolor both.",
      component: Colors,
      source: colorsSrc,
    },
    {
      id: "inline",
      title: "Inline and in buttons",
      description: (
        <>
          At small sizes it sits next to text. <TextLink to="/docs/button">Button</TextLink>'s <InlineCode>isPending</InlineCode> swaps its icon for one.
        </>
      ),
      component: Inline,
      source: inlineSrc,
    },
    {
      id: "shapes",
      title: "Custom shape sequence",
      description: (
        <>
          <InlineCode>shapes</InlineCode> takes any names from the <TextLink to="/docs/shape">shape library</TextLink>. Each morph takes 520ms, one every 650ms.
        </>
      ),
      component: Shapes,
      source: shapesSrc,
    },
  ],
  api: [
    {
      name: "LoadingIndicator",
      description: <>A {c("div")} with {c('role="progressbar"')}. Accepts any div attribute. Also exported: {c("loadingIndicatorVariants")}.</>,
      props: [
        { name: "size", type: "number", default: "48", description: "Outer size in px. The shape is 79% of it." },
        { name: "contained", type: "boolean", default: "false", description: "Draw the round primary-container disc behind the shape." },
        {
          name: "shapes",
          type: "ShapeName[]",
          default: '["softBurst", "cookie9", "pentagon", "puffy", "sunny", "cookie4", "oval"]',
          description: "Shapes to morph through, in order.",
        },
        { name: "aria-label", type: "string", default: '"Loading"', description: "What is loading." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Renders {c('role="progressbar"')} with no value, which screen readers announce as a busy indicator, named by {c("aria-label")} (“Loading” by
        default). Inside a pending Button it is {c("aria-hidden")}, since the button already announces its state.
      </>
    ),
    notes: [
      "Under prefers-reduced-motion the rotation slows to a 12s turn; the morph keeps going so the wait still reads as active.",
      "Not focusable, no keyboard interaction.",
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Size", "Color", "Contained color"],
        rows: [
          ["Container", "48dp, full corners", "—", "primary-container"],
          ["Active indicator", "38dp", "primary", "on-primary-container"],
        ],
      },
    ],
    cards: [
      { title: "Motion", items: ["Morph every 650ms, 520ms per morph on the spring curve", "Continuous rotation, one turn every 4s"] },
      { title: "Shapes", items: ["Soft burst → cookie 9 → pentagon → puffy → sunny → cookie 4 → oval"] },
    ],
    source: (
      <>
        androidx {c("LoadingIndicatorTokens")} and the indeterminate polygons in {c("LoadingIndicatorDefaults")}. Compose's sequence uses a pill where this
        uses puffy, and rotates every 4.67s.
      </>
    ),
  },
} satisfies ComponentDoc
