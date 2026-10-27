import Compose from "@/docs/docs-site/examples/use-press-scale/compose"
import composeSrc from "@/docs/docs-site/examples/use-press-scale/compose?raw"
import Demo from "@/docs/docs-site/examples/use-press-scale/demo"
import demoSrc from "@/docs/docs-site/examples/use-press-scale/demo?raw"
import Strength from "@/docs/docs-site/examples/use-press-scale/strength"
import strengthSrc from "@/docs/docs-site/examples/use-press-scale/strength?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  title: "usePressScale",
  description: (
    <>
      An elastic press for any element: it squishes to {c("scale")} on pointer down and springs back on release. It animates the independent {c("scale")}{" "}
      property, so it composes with <TextLink to="/docs/use-magnetic">useMagnetic</TextLink> ({c("translate")}) and{" "}
      <TextLink to="/docs/use-tilt">useTilt</TextLink> ({c("transform")}) on the same element.
    </>
  ),
  preview: { component: Demo, source: demoSrc },
  usage: `import { useRef } from "react"
import { usePressScale } from "@/hooks/use-press-scale"

const ref = useRef<HTMLButtonElement>(null)
usePressScale(ref)
return <button ref={ref}>Press</button>`,
  examples: [
    {
      id: "strength",
      title: "Scale",
      description: "0.96 for large surfaces, 0.92 (default) for cards, 0.85 for small playful targets.",
      component: Strength,
      source: strengthSrc,
    },
    {
      id: "compose",
      title: "Compose with useMagnetic",
      description: (
        <>
          Both hooks on one IconButton: it drifts toward the pointer and squishes when pressed. The buttons accept <InlineCode>ref</InlineCode>.
        </>
      ),
      component: Compose,
      source: composeSrc,
    },
  ],
  api: [
    {
      name: "usePressScale(ref, options?)",
      props: [
        { name: "ref", type: "RefObject<HTMLElement>", default: "—", description: "The element to animate." },
        { name: "scale", type: "number", default: "0.92", description: "Scale while pressed." },
        { name: "disabled", type: "boolean", default: "false", description: "Turn the effect off." },
      ],
    },
  ],
  accessibility: {
    description: "Purely visual: it doesn't change press handling or focus. It's skipped with reduced motion, for non-primary buttons, and on disabled elements.",
    notes: [<>Keyboard presses don't trigger it (it listens to pointer events). The element's own pressed state, like a state layer, still covers keyboard users.</>],
  },
  spec: {
    tables: [
      {
        columns: ["Phase", "Curve", "Duration"],
        rows: [
          ["Press", c("emphasized-accelerate"), "110ms"],
          ["Release", c("fast-spatial") + " 0.6 / 800", "374ms (overshoots ≈ 9%)"],
        ],
      },
    ],
    source: <>androidx {c("ExpressiveMotionTokens")}; press timing matches the state-layer press feel.</>,
  },
} satisfies ComponentDoc
