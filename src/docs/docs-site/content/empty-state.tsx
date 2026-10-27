import Demo from "@/docs/docs-site/examples/empty-state/demo"
import demoSrc from "@/docs/docs-site/examples/empty-state/demo?raw"
import Shapes from "@/docs/docs-site/examples/empty-state/shapes"
import shapesSrc from "@/docs/docs-site/examples/empty-state/shapes?raw"
import Variants from "@/docs/docs-site/examples/empty-state/variants"
import variantsSrc from "@/docs/docs-site/examples/empty-state/variants?raw"
import Media from "@/docs/docs-site/examples/empty-state/media"
import mediaSrc from "@/docs/docs-site/examples/empty-state/media?raw"
import Search from "@/docs/docs-site/examples/empty-state/search"
import searchSrc from "@/docs/docs-site/examples/empty-state/search?raw"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Empty states explain why a view has nothing in it and what to do next: an Expressive shape carrying an icon, a headline, one sentence and up to two actions.",
  preview: { component: Demo, source: demoSrc },
  usage: `import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"

<EmptyState
  icon="dns"
  title="Connect your first cluster"
  description="Clusters report health, deploys and incidents here."
  actions={<Button>Connect cluster</Button>}
/>`,
  examples: [
    {
      id: "shapes",
      title: "Shape",
      description: (
        <>
          Without {c("shape")}, the shape morphs clover → cookie → sunny every 3s. Pass a {c("ShapeName")} to hold one shape, {c("shapeCycle")} for your own
          sequence, or {c("false")} for a bare icon.
        </>
      ),
      component: Shapes,
      source: shapesSrc,
    },
    { id: "variants", title: "Variants & size", description: "default sits on surface, dashed outlines a drop target, plain has no container. sm fits cards and side panels.", component: Variants, source: variantsSrc },
    {
      id: "media",
      title: "Custom media",
      description: <>{c("media")} replaces the shape and icon: an error disc, a lock tile, an illustration.</>,
      component: Media,
      source: mediaSrc,
    },
    { id: "search", title: "No results", description: "Suggest the next step with assist chips instead of a single button.", component: Search, source: searchSrc },
  ],
  api: [
    {
      name: "EmptyState",
      description: <>Renders a {c("<div>")}; other HTML attributes pass through. Also exported: {c("emptyStateVariants")}.</>,
      props: [
        { name: "title", type: "ReactNode", default: "—", description: "Headline. Required." },
        { name: "description", type: "ReactNode", default: "—", description: "One sentence under the headline." },
        { name: "actions", type: "ReactNode", default: "—", description: "Buttons, primary first. Centered and wrapping." },
        { name: "icon", type: "string", default: '"inbox"', description: "Material Symbol on the shape." },
        { name: "shape", type: "ShapeName | false", default: "morphing", description: "Shape behind the icon, or false for a bare icon." },
        { name: "shapeCycle", type: "ShapeName[]", default: '["clover4", "cookie7", "sunny"]', description: "Shapes to morph through (only without a fixed shape)." },
        { name: "media", type: "ReactNode", default: "—", description: "Replaces the shape and icon entirely." },
        { name: "variant", type: '"default" | "dashed" | "plain"', default: '"default"', description: "Surface, dashed outline or no container." },
        { name: "size", type: '"md" | "sm"', default: '"md"', description: "md: 112dp shape, headline-small. sm: 80dp shape, title-medium." },
        { name: "children", type: "ReactNode", default: "—", description: "Extra content after the actions." },
      ],
    },
  ],
  accessibility: {
    description: <>The headline is an {c("<h4>")} and the icon is decorative. Actions are ordinary buttons in reading order, primary first.</>,
    notes: [
      "When an empty state replaces search results or a filtered list, announce the change (e.g. a live region with the result count) so screen reader users know the view updated.",
      "Keep the description to one sentence; it's read in full every time the view is empty.",
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Size", "Shape", "Icon", "Headline", "Description", "Padding"],
        rows: [
          ["md", "112dp", "40dp", c("headline-small"), c("body-medium"), "48dp × 24dp"],
          ["sm", "80dp", "32dp", c("title-medium"), c("body-small"), "24dp × 24dp"],
        ],
      },
    ],
    cards: [
      { title: "Color", items: ["Shape: primary-container", "Icon: on-primary-container", "Headline: on-surface · description: on-surface-variant"] },
      { title: "Motion", items: ["Default cycle every 3000ms", <>Morph on {c("Shape")}'s spring easing</>] },
    ],
    source: "Not an M3 component. Shapes come from the M3 Expressive shape library; type and color from the M3 scales.",
  },
} satisfies ComponentDoc
