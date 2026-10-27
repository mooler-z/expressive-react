import Demo from "@/docs/docs-site/examples/use-motion/demo"
import demoSrc from "@/docs/docs-site/examples/use-motion/demo?raw"
import Reduced from "@/docs/docs-site/examples/use-motion/reduced"
import reducedSrc from "@/docs/docs-site/examples/use-motion/reduced?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  title: "useMotion",
  description: (
    <>
      The M3 Expressive springs for JavaScript animation. {c("springTiming()")} returns the easing curve and duration of a spring from the theme's{" "}
      {c("--md-spring-*")} tokens, ready for the Web Animations API, and {c("useReducedMotion()")} tracks the user's motion preference. The interaction hooks
      are built on it.
    </>
  ),
  links: { m3: "https://m3.material.io/styles/motion/overview/how-it-works" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { prefersReducedMotion, springTiming } from "@/hooks/use-motion"

const { easing, duration } = springTiming("fast-spatial")
if (!prefersReducedMotion()) el.animate([{ scale: "0.9" }, { scale: "1" }], { easing, duration })`,
  examples: [
    {
      id: "reduced",
      title: "Respect reduced motion",
      description: (
        <>
          <InlineCode>useReducedMotion()</InlineCode> re-renders when the preference changes; <InlineCode>prefersReducedMotion()</InlineCode> is the one-off
          check for event handlers. Turn on “Reduce motion” in your OS to see it skip.
        </>
      ),
      component: Reduced,
      source: reducedSrc,
    },
  ],
  api: [
    {
      name: "springTiming(name)",
      description: <>Reads the compiled spring from the document's computed style; falls back to a cubic-bezier approximation on the server.</>,
      props: [
        { name: "name", type: "SpringName", default: "—", description: '"fast-spatial" | "default-spatial" | "slow-spatial" | "fast-effects" | "default-effects" | "slow-effects"' },
        { name: "returns", type: "{ easing: string; duration: number }", default: "—", description: "A linear() easing and its settle time in ms." },
      ],
    },
    {
      name: "useReducedMotion() · prefersReducedMotion()",
      props: [
        { name: "useReducedMotion", type: "() => boolean", default: "—", description: "Reactive prefers-reduced-motion: reduce." },
        { name: "prefersReducedMotion", type: "() => boolean", default: "—", description: "Non-reactive check for handlers and effects; false on the server." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Always gate decorative motion on {c("prefersReducedMotion()")}: jump to the end state instead. Every Expressive hook and component does, and CSS
        animations in the library use {c("motion-reduce:")}.
      </>
    ),
  },
  spec: {
    description: "The M3 Expressive motion scheme, compiled to linear() curves in expressive.css. Spatial springs move things; effects springs change things (color, opacity).",
    tables: [
      {
        columns: ["Spring", "Damping", "Stiffness", "Duration", "Used for"],
        rows: [
          [c("fast-spatial"), "0.6", "800", "374ms", "Shape morph, press, toggles"],
          [c("default-spatial"), "0.8", "380", "414ms", "Enter/exit, new messages, steps"],
          [c("slow-spatial"), "0.8", "200", "567ms", "Magnetic and tilt return"],
          [c("fast-effects"), "1.0", "3800", "154ms", "State layers, outlines"],
          [c("default-effects"), "1.0", "1600", "223ms", "Container color"],
          [c("slow-effects"), "1.0", "800", "301ms", "Slower fades (not used by components yet)"],
        ],
      },
    ],
    source: (
      <>
        androidx {c("ExpressiveMotionTokens")}. See <TextLink to="/tokens#springs">Motion &amp; springs</TextLink> for the live curves.
      </>
    ),
  },
} satisfies ComponentDoc
