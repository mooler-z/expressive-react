import Demo from "@/docs/docs-site/examples/use-drag-scroll/demo"
import demoSrc from "@/docs/docs-site/examples/use-drag-scroll/demo?raw"
import Free from "@/docs/docs-site/examples/use-drag-scroll/free"
import freeSrc from "@/docs/docs-site/examples/use-drag-scroll/free?raw"
import Vertical from "@/docs/docs-site/examples/use-drag-scroll/vertical"
import verticalSrc from "@/docs/docs-site/examples/use-drag-scroll/vertical?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  title: "useDragScroll",
  description: (
    <>
      Mouse drag-to-scroll for overflow containers. Touch and trackpads already scroll natively, so only mouse pointers are handled. Scroll snap is suspended
      while dragging, then the container glides to the nearest snap point, projected with release velocity. Used by <TextLink to="/docs/carousel">Carousel</TextLink>{" "}
      and <TextLink to="/docs/scroll-area">Scroll area</TextLink>.
    </>
  ),
  preview: { component: Demo, source: demoSrc },
  usage: `import { useRef } from "react"
import { useDragScroll } from "@/hooks/use-drag-scroll"

const ref = useRef<HTMLDivElement>(null)
useDragScroll(ref)
return <div ref={ref} className="flex snap-x overflow-x-auto">{cards}</div>`,
  examples: [
    {
      id: "vertical",
      title: "Vertical",
      description: (
        <>
          <InlineCode>axis="y"</InlineCode> drags vertically and settles on vertical snap points.
        </>
      ),
      component: Vertical,
      source: verticalSrc,
    },
    {
      id: "free",
      title: "Free scrolling",
      description: (
        <>
          Return no targets from <InlineCode>snapTargets</InlineCode> to stop exactly where the drag ends, for timelines and charts.
        </>
      ),
      component: Free,
      source: freeSrc,
    },
  ],
  api: [
    {
      name: "useDragScroll(ref, options?)",
      description: <>Sets {c("data-dragging")} on the container while dragging, for a grabbing cursor or disabled hover styles.</>,
      props: [
        { name: "ref", type: "RefObject<HTMLElement>", default: "—", description: "The scroll container." },
        { name: "axis", type: '"x" | "y" | "both"', default: '"x"', description: "Axis the drag scrolls." },
        { name: "snapTargets", type: "(el: HTMLElement) => number[]", default: "children with scroll-snap-align", description: "Scroll positions to settle on; return [] to skip settling." },
        { name: "disabled", type: "boolean", default: "false", description: "Turn dragging off." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        The container keeps native scrolling, so keyboard, touch and assistive tech work unchanged. A click that ends a drag is swallowed so items under the
        cursor don't activate. Drags never start on inputs, textareas, selects, contenteditable or {c("[data-no-drag]")} elements.
      </>
    ),
    notes: [<>Give scroll containers with no focusable children {c("tabIndex={0}")} and a label so keyboard users can scroll them.</>],
  },
  spec: {
    tables: [
      {
        columns: ["Behaviour", "Value"],
        rows: [
          ["Drag threshold", "4px before scrolling starts"],
          ["Settle projection", "release velocity × 160ms"],
          ["Settle", "smooth scroll to the nearest target; snap restored on scrollend (700ms fallback)"],
          ["RTL", "snap targets measured from rects, so negative scrollLeft works"],
        ],
      },
    ],
  },
} satisfies ComponentDoc
