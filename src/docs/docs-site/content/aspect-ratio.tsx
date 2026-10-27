import Demo from "@/docs/docs-site/examples/aspect-ratio/demo"
import demoSrc from "@/docs/docs-site/examples/aspect-ratio/demo?raw"
import Ratios from "@/docs/docs-site/examples/aspect-ratio/ratios"
import ratiosSrc from "@/docs/docs-site/examples/aspect-ratio/ratios?raw"
import Image from "@/docs/docs-site/examples/aspect-ratio/image"
import imageSrc from "@/docs/docs-site/examples/aspect-ratio/image?raw"
import Card from "@/docs/docs-site/examples/aspect-ratio/card"
import cardSrc from "@/docs/docs-site/examples/aspect-ratio/card?raw"
import Video from "@/docs/docs-site/examples/aspect-ratio/video"
import videoSrc from "@/docs/docs-site/examples/aspect-ratio/video?raw"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Aspect ratio frames hold media at a fixed width-to-height ratio. Images and videos inside are cropped to fill the frame, and the M3 media placeholder fills the space until real media arrives.",
  preview: { component: Demo, source: demoSrc },
  usage: `import { AspectRatio } from "@/components/ui/aspect-ratio"

<AspectRatio ratio={16 / 9} className="rounded-lg">
  <img src="/covers/launch.jpg" alt="Launch event" />
</AspectRatio>`,
  examples: [
    { id: "ratios", title: "Common ratios", description: "Landscape 21:9, portrait 4:5 and full-screen 9:16. The frame always takes the full width it's given.", component: Ratios, source: ratiosSrc },
    {
      id: "image",
      title: "Image",
      description: <>A direct {c("<img>")} or {c("<video>")} child is sized to the frame with {c("object-cover")}.</>,
      component: Image,
      source: imageSrc,
    },
    { id: "card", title: "In a card", description: "Media at the top of a card, with a scrim gradient for a title over the image.", component: Card, source: cardSrc },
    {
      id: "video",
      title: "Video",
      description: <>{c("MediaLabel")} pins a duration tag; layer your own play button and progress on top.</>,
      component: Video,
      source: videoSrc,
    },
  ],
  api: [
    {
      name: "AspectRatio",
      description: <>Renders a {c("<div>")}; other HTML attributes pass through.</>,
      props: [{ name: "ratio", type: "number", default: "1", description: "Width divided by height, e.g. 16 / 9." }],
    },
    {
      name: "MediaPlaceholder",
      description: <>Fills its parent. Also exported: {c("mediaPlaceholderVariants")}.</>,
      props: [
        { name: "icon", type: "string", default: '"image"', description: "Material Symbol in the center (40dp)." },
        { name: "color", type: '"primary" | "secondary" | "tertiary" | "neutral" | "error"', default: '"primary"', description: "Container role and its on-color." },
        { name: "label", type: "ReactNode", default: "—", description: "Corner tag, e.g. \"16 : 9\" or a duration." },
      ],
    },
    {
      name: "MediaLabel",
      description: <>A small tag pinned to the bottom-end corner. Renders a {c("<span>")}.</>,
      props: [{ name: "className", type: "string", default: "—", description: "Move it with position classes, e.g. top-2 left-2." }],
    },
  ],
  accessibility: {
    description: <>The frame is a plain {c("<div>")} with no role. Give images real {c("alt")} text, and add captions or a transcript for video.</>,
    notes: ["MediaPlaceholder is decorative: its icon is hidden from assistive technology.", "Custom play buttons need an accessible name (aria-label=\"Play\")."],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Placeholder icon", "40dp, on-color of the container role"],
          ["Media label", <>surface at 80% · {c("label-small")} Roboto Mono · 4dp corners · 8dp from the corner</>],
          ["Fit", <>{c("object-cover")}, cropped to the frame</>],
        ],
      },
    ],
    source: "Not an M3 component. Placeholder colors use the M3 container roles; corners come from the shape scale you set on the frame.",
  },
} satisfies ComponentDoc
