import Demo from "@/docs/docs-site/examples/scroll-area/demo"
import demoSrc from "@/docs/docs-site/examples/scroll-area/demo?raw"
import Horizontal from "@/docs/docs-site/examples/scroll-area/horizontal"
import horizontalSrc from "@/docs/docs-site/examples/scroll-area/horizontal?raw"
import Both from "@/docs/docs-site/examples/scroll-area/both"
import bothSrc from "@/docs/docs-site/examples/scroll-area/both?raw"
import Snap from "@/docs/docs-site/examples/scroll-area/snap"
import snapSrc from "@/docs/docs-site/examples/scroll-area/snap?raw"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Scroll areas keep native scrolling and add thin themed scrollbars, edge fades on the sides that have more content, prev/next buttons and mouse drag-to-scroll.",
  preview: { component: Demo, source: demoSrc },
  usage: `import { ScrollArea } from "@/components/ui/scroll-area"

<ScrollArea fade className="h-72">
  {items}
</ScrollArea>`,
  examples: [
    {
      id: "horizontal",
      title: "Horizontal with buttons",
      description: (
        <>
          {c('orientation="horizontal"')} with {c("scrollButtons")}: they appear only when there's more content in that direction and scroll 80% of the
          viewport. {c("dragScroll")} adds mouse dragging; {c("hideScrollbar")} hides the bar.
        </>
      ),
      component: Horizontal,
      source: horizontalSrc,
    },
    { id: "both", title: "Both axes", description: "A wide table with a sticky header row and first column.", component: Both, source: bothSrc },
    {
      id: "snap",
      title: "Snap points",
      description: <>Add CSS scroll snapping through {c("viewportClassName")}; drag-to-scroll settles on the nearest snap point.</>,
      component: Snap,
      source: snapSrc,
    },
  ],
  api: [
    {
      name: "ScrollArea",
      description: <>Renders a positioned {c("<div>")} with a focusable scrolling viewport inside. Other HTML attributes go on the outer element.</>,
      props: [
        { name: "orientation", type: '"vertical" | "horizontal" | "both"', default: '"vertical"', description: "Which axes scroll." },
        { name: "fade", type: "boolean | number", default: "false", description: "Fade the edges with more content: true = 40px, or a length in px. Not with both." },
        { name: "scrollButtons", type: "boolean", default: "false", description: "Horizontal only: floating prev/next buttons." },
        { name: "dragScroll", type: "boolean", default: "false", description: "Drag with the mouse to scroll. Touch and trackpads already do." },
        { name: "hideScrollbar", type: "boolean", default: "false", description: "Hide the scrollbar; content still scrolls." },
        { name: "viewportClassName", type: "string", default: "—", description: "Classes for the scrolling element, e.g. snap-x snap-mandatory." },
        { name: "viewportRef", type: "Ref<HTMLDivElement>", default: "—", description: "The scrolling element, for scrollTo and measurements." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Scrolling stays native, so wheel, touch, keyboard and assistive technology work as usual. The viewport is focusable ({c("tabIndex={0}")}) so keyboard
        users can scroll content that has no focusable children; it shows the 3dp secondary focus ring.
      </>
    ),
    keyboard: [
      { keys: ["↑", "↓", "←", "→"], description: "Scroll the focused viewport." },
      { keys: ["Page Up", "Page Down"], description: "Scroll by a page." },
      { keys: ["Home", "End"], description: "Jump to the start or end." },
    ],
    notes: [
      "The prev/next buttons are excluded from the tab order; keyboard users scroll the viewport directly.",
      "In right-to-left layouts the prev/next buttons swap sides and scroll in the reading direction.",
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Scrollbar", "8dp · outline thumb · full corners · transparent track"],
          ["Edge fade", "40dp mask by default, only on edges with more content"],
          ["Scroll buttons", "XS icon button · surface-container-high · level 1"],
          ["Button motion", <>{c("fast-spatial")} spring: fade and scale in at the edges</>],
        ],
      },
    ],
    source: "Not an M3 component. Colors from the M3 roles; buttons are Expressive icon buttons.",
  },
} satisfies ComponentDoc
