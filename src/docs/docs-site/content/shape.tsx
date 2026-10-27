import Clip from "@/docs/docs-site/examples/shape/clip"
import clipSrc from "@/docs/docs-site/examples/shape/clip?raw"
import Demo from "@/docs/docs-site/examples/shape/demo"
import demoSrc from "@/docs/docs-site/examples/shape/demo?raw"
import Library from "@/docs/docs-site/examples/shape/library"
import librarySrc from "@/docs/docs-site/examples/shape/library?raw"
import Morph from "@/docs/docs-site/examples/shape/morph"
import morphSrc from "@/docs/docs-site/examples/shape/morph?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "The M3 Expressive shape library as a component. Every shape is the same 120-point polygon, so any two morph smoothly with a plain CSS clip-path transition. No canvas, no animation library.",
  links: { m3: "https://m3.material.io/styles/shape/overview-principles" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Shape } from "@/components/ui/shape"

<Shape shape="cookie9" hoverShape="sunny" className="size-24 text-primary" />`,
  examples: [
    {
      id: "library",
      title: "The library",
      description: (
        <>
          All {c("shapeNames")}. Each fills a square box with {c("currentColor")}: size it with <InlineCode>size-*</InlineCode>, color it with{" "}
          <InlineCode>text-*</InlineCode>. Hover one.
        </>
      ),
      component: Library,
      source: librarySrc,
    },
    {
      id: "morph",
      title: "Morph on state",
      description: "Change the shape prop and it morphs on the spring curve. morphDuration sets how long.",
      component: Morph,
      source: morphSrc,
    },
    {
      id: "clip",
      title: "Clip anything",
      description: (
        <>
          <InlineCode>shapePolygon(name)</InlineCode> returns the CSS <InlineCode>polygon()</InlineCode>, so you can clip images, gradients or avatars directly.
          Two polygons transition between each other as well.
        </>
      ),
      component: Clip,
      source: clipSrc,
    },
  ],
  api: [
    {
      name: "Shape",
      description: <>A {c("div")} filled with {c("currentColor")}. Accepts any div attribute.</>,
      props: [
        { name: "shape", type: "ShapeName", default: '"circle"', description: "Resting shape." },
        { name: "cycle", type: "ShapeName[]", default: "—", description: "Morph through these on a timer. Overrides shape." },
        { name: "interval", type: "number", default: "2400", description: "Milliseconds between cycle steps." },
        { name: "hoverShape", type: "ShapeName", default: "—", description: "Shape to morph to while hovered." },
        { name: "morphDuration", type: "number", default: "80% of interval, max 900", description: "Morph duration in ms." },
      ],
    },
    {
      name: "shapePolygon(name) · shapeNames · ShapeName",
      description: "Helpers for using the library without the component.",
      props: [
        { name: "shapePolygon", type: "(name: ShapeName) => string", default: "—", description: "CSS polygon() for the shape, normalised to fill a square. Cached." },
        { name: "shapeNames", type: "ShapeName[]", default: "—", description: "Every available name." },
        {
          name: "ShapeName",
          type: "union",
          default: "—",
          description:
            "circle, oval, squircle, triangle, diamond, pentagon, hexagon, cookie4, cookie6, cookie7, cookie9, cookie12, clover4, clover8, sunny, verySunny, burst, softBurst, puffy, gem, arch.",
        },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        A shape is decoration: an empty {c("div")} with no role. Give it {c('aria-hidden="true"')} where it sits next to meaningful content, and use{" "}
        <TextLink to="/docs/loading-indicator">Loading indicator</TextLink> when the shape means “busy”.
      </>
    ),
    notes: ["Shapes that cycle keep cycling under reduced motion; prefer a static shape for large decorative areas.", "Not focusable, no keyboard interaction."],
  },
  spec: {
    tables: [
      {
        columns: ["Family", "Shapes"],
        rows: [
          ["Basic", "circle, oval, squircle, triangle, diamond, pentagon, hexagon, gem, arch"],
          ["Cookies", "cookie4, cookie6, cookie7, cookie9, cookie12, puffy"],
          ["Clovers", "clover4, clover8"],
          ["Bursts", "sunny, verySunny, burst, softBurst"],
        ],
      },
    ],
    cards: [
      { title: "Geometry", items: ["120 points per shape", "Normalised to fill a square box", "Polygons are cached after first use"] },
      { title: "Motion", items: [<>{c("clip-path")} transition on the {c("ease-spring")} curve</>, "Default morph: 80% of the cycle interval, up to 900ms"] },
    ],
    source: "Approximates the M3 Expressive shape library (androidx MaterialShapes) with polar radius functions, so every shape shares one point count.",
  },
} satisfies ComponentDoc
