import Autoplay from "@/docs/docs-site/examples/carousel/autoplay"
import autoplaySrc from "@/docs/docs-site/examples/carousel/autoplay?raw"
import CenterHero from "@/docs/docs-site/examples/carousel/center-hero"
import centerHeroSrc from "@/docs/docs-site/examples/carousel/center-hero?raw"
import Demo from "@/docs/docs-site/examples/carousel/demo"
import demoSrc from "@/docs/docs-site/examples/carousel/demo?raw"
import FullScreen from "@/docs/docs-site/examples/carousel/full-screen"
import fullScreenSrc from "@/docs/docs-site/examples/carousel/full-screen?raw"
import Hero from "@/docs/docs-site/examples/carousel/hero"
import heroSrc from "@/docs/docs-site/examples/carousel/hero?raw"
import Uncontained from "@/docs/docs-site/examples/carousel/uncontained"
import uncontainedSrc from "@/docs/docs-site/examples/carousel/uncontained?raw"
import { InlineCode } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>
const div = "HTMLAttributes<HTMLDivElement>"

export default {
  description:
    "A scrolling collection of visual items. The five M3 layouts: multi-browse, hero and center-aligned hero mask items to keylines so they grow and shrink as they scroll; uncontained and full-screen scroll natively with parallax and fading labels.",
  links: { m3: "https://m3.material.io/components/carousel/overview" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Carousel, CarouselContent, CarouselItem, CarouselLabel } from "@/components/ui/carousel"

<Carousel aria-label="Highlights">
  <CarouselContent className="h-56">
    <CarouselItem className="bg-primary-container text-on-primary-container">
      <CarouselLabel>Edge regions</CarouselLabel>
    </CarouselItem>
  </CarouselContent>
</Carousel>`,
  examples: [
    {
      id: "hero",
      title: "Hero",
      description: "One large item and one small peek. Good for featured content that deserves most of the width.",
      component: Hero,
      source: heroSrc,
    },
    {
      id: "center-hero",
      title: "Center-aligned hero",
      description: "The large item sits in the middle with a small item on each side.",
      component: CenterHero,
      source: centerHeroSrc,
    },
    {
      id: "uncontained",
      title: "Uncontained",
      description: (
        <>
          Fixed-width items that scroll past the container edge. Set the width with <InlineCode>itemSize</InlineCode> on Carousel; items shrink slightly as
          they leave the viewport.
        </>
      ),
      component: Uncontained,
      source: uncontainedSrc,
    },
    {
      id: "full-screen",
      title: "Full-screen",
      description: "One item at a time, scrolling vertically with snap. Pair it with vertical CarouselDots.",
      component: FullScreen,
      source: fullScreenSrc,
    },
    {
      id: "autoplay",
      title: "Autoplay and dots",
      description: (
        <>
          <InlineCode>autoplay</InlineCode> advances every N ms and pauses on hover, focus, hidden tabs and reduced motion.{" "}
          <InlineCode>onIndexChange</InlineCode> reports the focal item.
        </>
      ),
      component: Autoplay,
      source: autoplaySrc,
    },
  ],
  api: [
    {
      name: "Carousel",
      description: <>Root {c('role="region"')} with carousel state. Also takes {c(div)}.</>,
      props: [
        { name: "layout", type: '"multi-browse" | "hero" | "center-hero" | "uncontained" | "full-screen"', default: '"multi-browse"', description: "M3 carousel layout." },
        { name: "itemSize", type: "number", default: "240 · 160", description: "multi-browse: preferred large-item width. uncontained: item width. Others size from the container." },
        { name: "gap", type: "number", default: "8", description: "Space between items, in px." },
        { name: "autoplay", type: "number", default: "—", description: "Advance every N ms; pauses on hover, focus, hidden tab and reduced motion." },
        { name: "onIndexChange", type: "(index: number) => void", default: "—", description: "Called when the focal item changes." },
        { name: "aria-label", type: "string", default: "—", description: "Names the region." },
      ],
    },
    {
      name: "CarouselContent",
      description: <>The scroller; children are {c("CarouselItem")}s. Give it a height ({c("h-56")}). Also takes {c(div)}.</>,
      props: [
        { name: "parallax", type: "number", default: "10 · 6 · 8", description: "CarouselMedia drift, in % of its size (keyline · uncontained · full-screen)." },
        { name: "minScale", type: "number", default: "1 · 0.97 · 0.96", description: "Native layouts: scale of an item that has fully left the viewport." },
      ],
    },
    {
      name: "CarouselItem",
      description: <>One slide ({c('role="group"')}, "n of m"). Color it with bg-* and text-*. In uncontained it takes the itemSize width.</>,
      props: [{ name: "className", type: "string", default: "—", description: "Item colors and any extra styling." }],
    },
    {
      name: "CarouselMedia · CarouselLabel",
      description: "Media is a background layer that drifts with scroll (put artwork or an <img> inside). Label is text over it that fades as the item narrows.",
      props: [{ name: "className", type: "string", default: "—", description: "Merged with the part's classes." }],
    },
    {
      name: "CarouselPrevious · CarouselNext",
      description: "Icon buttons that step one item. Disabled at the ends. Take IconButton props.",
      props: [
        { name: "variant", type: '"standard" | "filled" | "tonal" | "outlined"', default: '"outlined"', description: "Icon button style." },
        { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"sm"', description: "Icon button size." },
        { name: "aria-label", type: "string", default: '"Previous" · "Next"', description: "Override the labels." },
      ],
    },
    {
      name: "CarouselDots · CarouselCount",
      description: "Page indicator (the active dot stretches into a pill) and a mono \"3 / 7\" readout.",
      props: [{ name: "className", type: "string", default: "—", description: "Merged with the part's classes." }],
    },
    {
      name: "useCarousel()",
      description: "State for custom controls inside Carousel.",
      props: [{ name: "returns", type: "{ index, count, canPrev, canNext, goTo(i), step(±1), layout }", default: "—", description: "Current item, item count and navigation." }],
    },
  ],
  accessibility: {
    description: (
      <>
        The root is a {c('role="region"')} with {c('aria-roledescription="carousel"')}; each item is a group announced as "n of m". Items masked off-screen
        by a keyline layout are inert, so focus never lands on something you can't see.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Focuses the scroller (3dp secondary focus ring), then the controls." },
      { keys: ["←", "→"], description: "Steps one item (↑ ↓ for full-screen). Mirrored in RTL." },
      { keys: ["Home", "End"], description: "Jumps to the first or last item." },
    ],
    notes: ["Always set aria-label on Carousel.", "Autoplay stops for reduced motion and while the carousel has focus or hover."],
  },
  spec: {
    tables: [
      {
        columns: ["Layout", "Visible items", "Sizing"],
        rows: [
          ["Multi-browse", "large × n, medium, small", "large ≈ itemSize (240), medium = (large + small) / 2"],
          ["Hero", "large, small", "large = width − small − gap"],
          ["Center-aligned hero", "small, large, small", "large = width − 2 × (small + gap)"],
          ["Uncontained", "as many as fit", "itemSize (160)"],
          ["Full-screen", "one", "container height, vertical"],
        ],
      },
    ],
    cards: [
      { title: "Shape & spacing", items: ["Item corners 28dp (extra-large)", "Gap 8dp", "Small items 40–56dp", "Off-screen anchors 10dp"] },
      { title: "Motion", items: ["Mask and position follow scroll directly", "Dots stretch on fast-spatial (0.6 / 800)", "Parallax off under reduced motion"] },
    ],
    source: <>M3 carousel spec and Compose's keyline carousel ({c("CarouselDefaults")}).</>,
  },
} satisfies ComponentDoc
