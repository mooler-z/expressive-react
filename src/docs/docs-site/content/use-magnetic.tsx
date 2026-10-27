import Demo from "@/docs/docs-site/examples/use-magnetic/demo"
import demoSrc from "@/docs/docs-site/examples/use-magnetic/demo?raw"
import Strength from "@/docs/docs-site/examples/use-magnetic/strength"
import strengthSrc from "@/docs/docs-site/examples/use-magnetic/strength?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  title: "useMagnetic",
  description: (
    <>
      Magnetic hover: the element drifts toward the pointer while it's inside, then springs home on leave. For hero calls to action and playful targets. It
      animates {c("translate")}, so it composes with <TextLink to="/docs/use-press-scale">usePressScale</TextLink> and{" "}
      <TextLink to="/docs/use-tilt">useTilt</TextLink>.
    </>
  ),
  preview: { component: Demo, source: demoSrc },
  usage: `import { useRef } from "react"
import { useMagnetic } from "@/hooks/use-magnetic"

const ref = useRef<HTMLButtonElement>(null)
useMagnetic(ref, { strength: 0.35 })`,
  examples: [
    {
      id: "strength",
      title: "Strength",
      description: (
        <>
          <InlineCode>strength</InlineCode> is the fraction of the pointer's offset from center the element follows. Keep it at 0.35 or below for buttons.
        </>
      ),
      component: Strength,
      source: strengthSrc,
    },
  ],
  api: [
    {
      name: "useMagnetic(ref, options?)",
      props: [
        { name: "ref", type: "RefObject<HTMLElement>", default: "—", description: "The element to move." },
        { name: "strength", type: "number", default: "0.35", description: "Fraction of the pointer offset to follow." },
        { name: "disabled", type: "boolean", default: "false", description: "Turn the effect off." },
      ],
    },
  ],
  accessibility: {
    description: "Mouse only: touch and pen pointers are ignored, and so is everything under reduced motion. The resting box is measured once per hover, so the hit area doesn't chase the pointer.",
  },
  spec: {
    tables: [
      {
        columns: ["Phase", "Curve", "Duration"],
        rows: [
          ["Follow", c("emphasized"), "300ms"],
          ["Return", c("slow-spatial") + " 0.8 / 200", "567ms"],
        ],
      },
    ],
    source: <>androidx {c("ExpressiveMotionTokens")}.</>,
  },
} satisfies ComponentDoc
