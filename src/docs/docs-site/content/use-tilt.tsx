import Demo from "@/docs/docs-site/examples/use-tilt/demo"
import demoSrc from "@/docs/docs-site/examples/use-tilt/demo?raw"
import Options from "@/docs/docs-site/examples/use-tilt/options"
import optionsSrc from "@/docs/docs-site/examples/use-tilt/options?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  title: "useTilt",
  description: (
    <>
      A perspective tilt toward the pointer, with a spring reset on leave. For feature cards, pricing tiers and hero media. It animates {c("transform")}, so it
      composes with <TextLink to="/docs/use-press-scale">usePressScale</TextLink> and <TextLink to="/docs/use-magnetic">useMagnetic</TextLink>.
    </>
  ),
  preview: { component: Demo, source: demoSrc },
  usage: `import { useRef } from "react"
import { useTilt } from "@/hooks/use-tilt"

const ref = useRef<HTMLDivElement>(null)
useTilt(ref, { max: 8 })`,
  examples: [
    {
      id: "options",
      title: "Angle and perspective",
      description: (
        <>
          <InlineCode>max</InlineCode> is the tilt in degrees at the card's edge; a smaller <InlineCode>perspective</InlineCode> exaggerates depth.
        </>
      ),
      component: Options,
      source: optionsSrc,
    },
  ],
  api: [
    {
      name: "useTilt(ref, options?)",
      props: [
        { name: "ref", type: "RefObject<HTMLElement>", default: "—", description: "The element to tilt." },
        { name: "max", type: "number", default: "8", description: "Degrees at the element's edge." },
        { name: "perspective", type: "number", default: "900", description: "CSS perspective in px." },
        { name: "disabled", type: "boolean", default: "false", description: "Turn the effect off." },
      ],
    },
  ],
  accessibility: {
    description: "Mouse only, and off under reduced motion. Keep tilted content readable: small angles for text-heavy cards.",
  },
  spec: {
    tables: [
      {
        columns: ["Phase", "Curve", "Duration"],
        rows: [
          ["Follow", c("emphasized"), "400ms"],
          ["Return", c("slow-spatial") + " 0.8 / 200", "567ms"],
        ],
      },
    ],
    source: <>androidx {c("ExpressiveMotionTokens")}.</>,
  },
} satisfies ComponentDoc
