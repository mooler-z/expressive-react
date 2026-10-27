import Adaptive from "@/docs/docs-site/examples/use-window-size-class/adaptive"
import adaptiveSrc from "@/docs/docs-site/examples/use-window-size-class/adaptive?raw"
import Classify from "@/docs/docs-site/examples/use-window-size-class/classify"
import classifySrc from "@/docs/docs-site/examples/use-window-size-class/classify?raw"
import Demo from "@/docs/docs-site/examples/use-window-size-class/demo"
import demoSrc from "@/docs/docs-site/examples/use-window-size-class/demo?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  title: "useWindowSizeClass",
  description: (
    <>
      The current M3 window size class (compact, medium, expanded, large, extra-large) for adaptive layouts: navigation bar → rail → drawer, one pane → two.
      It re-renders only when a breakpoint is crossed, not on every resize. The breakpoints match the Tailwind prefixes in the theme, so JS and CSS agree.
    </>
  ),
  links: { m3: "https://m3.material.io/foundations/layout/applying-layout/window-size-classes" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { useWindowSizeClass } from "@/hooks/use-window-size-class"

const size = useWindowSizeClass()
return size === "compact" ? <NavigationBar /> : <NavigationRail />`,
  examples: [
    {
      id: "adaptive",
      title: "Adaptive navigation",
      description: (
        <>
          <InlineCode>useWindowSizeAtLeast("expanded")</InlineCode> is the usual switch: a bar below 840dp, a rail from 840dp. The{" "}
          <TextLink to="/docs/sidebar">Sidebar</TextLink> and <TextLink to="/docs/navigation-bar">Navigation bar</TextLink> use the same breakpoints.
        </>
      ),
      component: Adaptive,
      source: adaptiveSrc,
    },
    {
      id: "classify",
      title: "Classify any width",
      description: (
        <>
          <InlineCode>windowSizeClass(width)</InlineCode> is the pure function behind the hook, for container widths, server code or tests.
        </>
      ),
      component: Classify,
      source: classifySrc,
    },
  ],
  api: [
    {
      name: "useWindowSizeClass(fallback?)",
      description: <>Subscribes with {c("useSyncExternalStore")} to four {c("matchMedia")} breakpoints.</>,
      props: [
        { name: "fallback", type: "WindowSizeClass", default: '"compact"', description: "Value during server rendering (mobile first)." },
        { name: "returns", type: "WindowSizeClass", default: "—", description: '"compact" | "medium" | "expanded" | "large" | "extra-large"' },
      ],
    },
    {
      name: "useWindowSizeAtLeast(size)",
      props: [
        { name: "size", type: "WindowSizeClass", default: "—", description: "The smallest class that counts." },
        { name: "returns", type: "boolean", default: "—", description: "True when the window is that class or wider." },
      ],
    },
    {
      name: "windowSizeClass(width) · WINDOW_SIZE_CLASSES",
      props: [
        { name: "windowSizeClass", type: "(width: number) => WindowSizeClass", default: "—", description: "Class for a width in px." },
        { name: "WINDOW_SIZE_CLASSES", type: "{ name, min }[]", default: "—", description: "The breakpoint table, smallest first." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Breakpoints are in CSS pixels, so browser zoom moves people into smaller classes, exactly as CSS media queries do. Swap layouts, not content: keep the
        same destinations and actions in every class.
      </>
    ),
  },
  spec: {
    tables: [
      {
        columns: ["Class", "Width", "Tailwind prefix", "Typical navigation"],
        rows: [
          ["Compact", "< 600dp", "(none)", "Navigation bar"],
          ["Medium", "600–839dp", c("md:"), "Navigation rail"],
          ["Expanded", "840–1199dp", c("lg:"), "Rail or drawer, two panes"],
          ["Large", "1200–1599dp", c("xl:"), "Expanded rail / drawer"],
          ["Extra-large", "≥ 1600dp", c("2xl:"), "Expanded rail / drawer, three panes"],
        ],
      },
    ],
    source: (
      <>
        M3 window size classes. The theme also defines {c("sm:")} at 480px for small layout tweaks; it isn't a size class.
      </>
    ),
  },
} satisfies ComponentDoc
