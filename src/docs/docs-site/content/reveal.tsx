import Demo from "@/docs/docs-site/examples/reveal/demo"
import demoSrc from "@/docs/docs-site/examples/reveal/demo?raw"
import Scroll from "@/docs/docs-site/examples/reveal/scroll"
import scrollSrc from "@/docs/docs-site/examples/reveal/scroll?raw"
import Words from "@/docs/docs-site/examples/reveal/words"
import wordsSrc from "@/docs/docs-site/examples/reveal/words?raw"
import { InlineCode } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Entrance motion for marketing pages and dashboards. Reveal fades a block up as it scrolls into view; RevealWords staggers a headline in word by word. Both use the M3 emphasized-decelerate curve.",
  preview: { component: Demo, source: demoSrc },
  usage: `import { Reveal, RevealWords } from "@/components/ui/reveal"

<RevealWords as="h1">Run everything. <span className="text-primary">Sweat nothing.</span></RevealWords>

<Reveal delay={90}>
  <FeatureCard />
</Reveal>`,
  examples: [
    {
      id: "scroll",
      title: "Reveal on scroll",
      description: (
        <>
          Each card rises 28px and fades in as it enters the viewport. A <InlineCode>delay</InlineCode> per index staggers siblings. Content already on screen at mount
          stays put, so nothing flashes on load. This example starts below the fold, so it plays as you scroll to it.
        </>
      ),
      component: Scroll,
      source: scrollSrc,
    },
    {
      id: "words",
      title: "Stagger and delay",
      description: (
        <>
          <InlineCode>stagger</InlineCode> is the gap between words, <InlineCode>delay</InlineCode> the wait before the first. Element children count as one word, so
          you can color words.
        </>
      ),
      component: Words,
      source: wordsSrc,
    },
  ],
  api: [
    {
      name: "Reveal",
      description: <>A {c("div")}. Accepts any div attribute.</>,
      props: [
        { name: "delay", type: "number", default: "0", description: "Extra delay in ms, e.g. index × 90 to stagger siblings." },
        { name: "distance", type: "number", default: "28", description: "How far it travels up, in px." },
      ],
    },
    {
      name: "RevealWords",
      description: "Splits string children into words; each element child is one word. Plays on mount.",
      props: [
        { name: "as", type: "ElementType", default: '"span"', description: "Element to render, e.g. “h1”." },
        { name: "stagger", type: "number", default: "70", description: "Milliseconds between words." },
        { name: "delay", type: "number", default: "0", description: "Milliseconds before the first word." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Both keep the text in the DOM in reading order, so screen readers read it normally whatever the animation is doing. RevealWords wraps each word in a span;
        the heading level comes from {c("as")}.
      </>
    ),
    notes: [
      "Under prefers-reduced-motion nothing animates: Reveal leaves content visible and RevealWords renders static words.",
      "Use entrance motion sparingly on pages people revisit often; it's most at home on landing pages.",
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Component", "Motion", "Duration", "Curve"],
        rows: [
          ["Reveal", "translateY 28px → 0, opacity 0 → 1", "700ms", "emphasized-decelerate (0.05, 0.7, 0.1, 1)"],
          ["RevealWords", "each word rises 60% of its height and fades in", "800ms per word, 70ms apart", "emphasized-decelerate"],
        ],
      },
    ],
    cards: [{ title: "Trigger", items: ["Reveal: IntersectionObserver, 8% bottom margin", "Skipped if on screen at mount", "RevealWords: on mount"] }],
    source: "M3 easing and duration tokens (emphasized-decelerate, long durations for large entering elements).",
  },
} satisfies ComponentDoc
