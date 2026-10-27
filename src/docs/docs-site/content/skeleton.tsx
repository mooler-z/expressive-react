import Demo from "@/docs/docs-site/examples/skeleton/demo"
import demoSrc from "@/docs/docs-site/examples/skeleton/demo?raw"
import Animations from "@/docs/docs-site/examples/skeleton/animations"
import animationsSrc from "@/docs/docs-site/examples/skeleton/animations?raw"
import Text from "@/docs/docs-site/examples/skeleton/text"
import textSrc from "@/docs/docs-site/examples/skeleton/text?raw"
import Stagger from "@/docs/docs-site/examples/skeleton/stagger"
import staggerSrc from "@/docs/docs-site/examples/skeleton/stagger?raw"
import Loading from "@/docs/docs-site/examples/skeleton/loading"
import loadingSrc from "@/docs/docs-site/examples/skeleton/loading?raw"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Skeletons hold the shape of content while it loads: surface-container-highest blocks that mirror the final layout, with a pulse, a shimmer or no animation.",
  preview: { component: Demo, source: demoSrc },
  usage: `import { Skeleton, SkeletonText } from "@/components/ui/skeleton"

<Skeleton className="size-10 rounded-full" />
<SkeletonText lines={3} />`,
  examples: [
    { id: "animations", title: "Animation", description: "pulse fades the block, shimmer sweeps a highlight across it, none stays still. All stop under reduced motion.", component: Animations, source: animationsSrc },
    {
      id: "text",
      title: "Text",
      description: <>{c("SkeletonText")} draws a paragraph whose last line is shorter. Set the line height with {c("lineClassName")}.</>,
      component: Text,
      source: textSrc,
    },
    { id: "stagger", title: "Staggered rows", description: "Offset each row's delay so the pulse travels down a list.", component: Stagger, source: staggerSrc },
    {
      id: "loading",
      title: "Swap to content",
      description: <>Mirror the final layout, then replace it. Mark the container {c('aria-busy')} while it loads.</>,
      component: Loading,
      source: loadingSrc,
    },
  ],
  api: [
    {
      name: "Skeleton",
      description: <>Renders a {c("<div>")}. Size and shape it with classes ({c("h-3 rounded-full")}, {c("size-10 rounded-full")}).</>,
      props: [
        { name: "animation", type: '"pulse" | "shimmer" | "none"', default: '"pulse"', description: "Loading animation." },
        { name: "delay", type: "number", default: "—", description: "Animation delay in ms, for staggering rows." },
      ],
    },
    {
      name: "SkeletonText",
      description: <>Same {c("animation")} and {c("delay")} props as Skeleton.</>,
      props: [
        { name: "lines", type: "number", default: "3", description: "Number of lines." },
        { name: "lastLineWidth", type: "string", default: '"60%"', description: "Width of the last line (any CSS width)." },
        { name: "lineClassName", type: "string", default: "—", description: "Classes for each line, e.g. h-4. Lines are 12dp tall by default." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Skeletons are {c('aria-hidden')}: they carry no information. Tell assistive technology about the loading state on the container instead, with{" "}
        {c('aria-busy="true"')} or a visually hidden "Loading…" message.
      </>
    ),
    notes: ["Animations stop when the user prefers reduced motion.", "Don't keep skeletons up indefinitely; show an error or empty state when loading fails."],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Block", "surface-container-highest · 4dp corners"],
          ["Text line", "12dp tall · full corners · 8dp apart"],
          ["Pulse", "Tailwind animate-pulse, 2s"],
          ["Shimmer", "surface-container highlight sweeping across, 1.6s linear"],
        ],
      },
    ],
    source: "Not an M3 component. Colors from the M3 surface-container roles.",
  },
} satisfies ComponentDoc
