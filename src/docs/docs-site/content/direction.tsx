import Demo from "@/docs/docs-site/examples/direction/demo"
import demoSrc from "@/docs/docs-site/examples/direction/demo?raw"
import Toggle from "@/docs/docs-site/examples/direction/toggle"
import toggleSrc from "@/docs/docs-site/examples/direction/toggle?raw"
import Icons from "@/docs/docs-site/examples/direction/icons"
import iconsSrc from "@/docs/docs-site/examples/direction/icons?raw"
import Bidi from "@/docs/docs-site/examples/direction/bidi"
import bidiSrc from "@/docs/docs-site/examples/direction/bidi?raw"
import Fills from "@/docs/docs-site/examples/direction/fills"
import fillsSrc from "@/docs/docs-site/examples/direction/fills?raw"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  title: "Direction (RTL)",
  description:
    "DirectionProvider sets the reading direction for a subtree: dir for CSS logical properties and the rtl: variant, and a matching locale so React Aria flips keyboard behavior, dates and numbers.",
  preview: { component: Demo, source: demoSrc },
  usage: `import { DirectionProvider } from "@/components/ui/direction"

<DirectionProvider dir="rtl">
  <App />
</DirectionProvider>`,
  examples: [
    {
      id: "toggle",
      title: "Switching direction",
      description: <>{c("useDirection()")} reads the nearest direction, so components can adapt without props.</>,
      component: Toggle,
      source: toggleSrc,
    },
    {
      id: "icons",
      title: "Mirrored icons",
      description: <>Mirror icons that imply direction with {c("rtl:-scale-x-100")}. Leave symbols, checks and media controls alone.</>,
      component: Icons,
      source: iconsSrc,
    },
    {
      id: "bidi",
      title: "Mixed-direction text",
      description: <>Wrap Latin names, versions and code in {c("<bdi>")} so they keep their own direction inside RTL text.</>,
      component: Bidi,
      source: bidiSrc,
    },
    { id: "fills", title: "Progress & slider", description: "Fills, handles and the arrow keys follow the reading direction.", component: Fills, source: fillsSrc },
  ],
  api: [
    {
      name: "DirectionProvider",
      description: <>Renders a {c("<div dir lang>")} inside a React Aria {c("I18nProvider")}. Other HTML attributes pass through.</>,
      props: [
        { name: "dir", type: '"ltr" | "rtl"', default: "—", description: "Reading direction for the subtree." },
        {
          name: "locale",
          type: "string",
          default: "auto",
          description: (
            <>
              Locale for React Aria. Defaults to the current locale when it matches {c("dir")}, otherwise {c('"ar-u-nu-latn"')} (Arabic with Latin digits) for
              RTL and {c('"en-US"')} for LTR.
            </>
          ),
        },
      ],
    },
    {
      name: "useDirection()",
      description: <>Returns {c('"ltr" | "rtl"')} from the nearest locale.</>,
      props: [],
    },
  ],
  accessibility: {
    description: (
      <>
        Setting {c("lang")} with {c("dir")} lets screen readers pick the right voice and pronunciation. React Aria uses the locale's direction for arrow-key
        navigation, so → moves to the next item in LTR and the previous one in RTL.
      </>
    ),
    notes: [
      <>Use logical utilities ({c("ps-*")}, {c("pe-*")}, {c("ms-*")}, {c("start-*")}, {c("text-start")}, {c("rounded-s-*")}) so layouts mirror without extra code.</>,
      "Keep numbers, code, phone numbers and media timelines left-to-right.",
    ],
  },
  spec: {
    cards: [
      { title: "Mirror", items: ["Layout, padding and alignment", "Back / forward arrows and chevrons", "Progress and slider fill", "Navigation and list order"] },
      { title: "Don't mirror", items: ["Media playback controls", "Checkmarks and most symbols", "Clocks and time-based charts", "Code and numbers"] },
    ],
    source: (
      <>
        Follows the M3 bidirectionality guidance. The default RTL locale is {c("ar-u-nu-latn")}, Arabic with Latin digits, so numbers stay readable in mixed
        interfaces.
      </>
    ),
  },
} satisfies ComponentDoc
