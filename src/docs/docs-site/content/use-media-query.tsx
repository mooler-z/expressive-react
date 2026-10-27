import Coarse from "@/docs/docs-site/examples/use-media-query/coarse"
import coarseSrc from "@/docs/docs-site/examples/use-media-query/coarse?raw"
import Demo from "@/docs/docs-site/examples/use-media-query/demo"
import demoSrc from "@/docs/docs-site/examples/use-media-query/demo?raw"
import Responsive from "@/docs/docs-site/examples/use-media-query/responsive"
import responsiveSrc from "@/docs/docs-site/examples/use-media-query/responsive?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  title: "useMediaQuery",
  description: (
    <>
      A live {c("matchMedia")} result for any CSS media query: color scheme, reduced motion, pointer type, widths. Use it when JS has to branch, not just
      styles. For layout breakpoints prefer <TextLink to="/docs/use-window-size-class">useWindowSizeClass</TextLink>.
    </>
  ),
  preview: { component: Demo, source: demoSrc },
  usage: `import { useMediaQuery } from "@/hooks/use-media-query"

const prefersDark = useMediaQuery("(prefers-color-scheme: dark)")`,
  examples: [
    {
      id: "responsive",
      title: "Swap a component",
      description: "Below 600px the action collapses to a filled icon button; from 600px it's a labelled button. Resize the window.",
      component: Responsive,
      source: responsiveSrc,
    },
    {
      id: "coarse",
      title: "Pointer type",
      description: (
        <>
          <InlineCode>(pointer: coarse)</InlineCode> is true on touch screens; use it to give sliders and handles a bigger target.
        </>
      ),
      component: Coarse,
      source: coarseSrc,
    },
  ],
  api: [
    {
      name: "useMediaQuery(query, defaultValue?)",
      description: <>Subscribes with {c("useSyncExternalStore")}; re-subscribes when the query changes.</>,
      props: [
        { name: "query", type: "string", default: "—", description: 'A media query, e.g. "(min-width: 600px)".' },
        { name: "defaultValue", type: "boolean", default: "false", description: "Value during server rendering." },
        { name: "returns", type: "boolean", default: "—", description: "Whether the query currently matches." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Honor user preferences with it: {c("(prefers-reduced-motion: reduce)")} (also exposed as {c("useReducedMotion")} in{" "}
        <TextLink to="/docs/use-motion">useMotion</TextLink>), {c("(prefers-contrast: more)")} and {c("(forced-colors: active)")}.
      </>
    ),
    notes: [<>On the server the hook returns {c("defaultValue")}, then updates on hydration. Pick the default that's safest for first paint.</>],
  },
} satisfies ComponentDoc
