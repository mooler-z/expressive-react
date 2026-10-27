import Demo from "@/docs/docs-site/examples/progress/demo"
import demoSrc from "@/docs/docs-site/examples/progress/demo?raw"
import Indeterminate from "@/docs/docs-site/examples/progress/indeterminate"
import indeterminateSrc from "@/docs/docs-site/examples/progress/indeterminate?raw"
import Live from "@/docs/docs-site/examples/progress/live"
import liveSrc from "@/docs/docs-site/examples/progress/live?raw"
import Thickness from "@/docs/docs-site/examples/progress/thickness"
import thicknessSrc from "@/docs/docs-site/examples/progress/thickness?raw"
import Tones from "@/docs/docs-site/examples/progress/tones"
import tonesSrc from "@/docs/docs-site/examples/progress/tones?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

const shared = [
  { name: "value", type: "number", default: "0", description: "Current value between minValue and maxValue." },
  { name: "minValue · maxValue", type: "number", default: "0 · 100", description: "Range." },
  { name: "isIndeterminate", type: "boolean", default: "false", description: "Unknown duration: plays the looping animation." },
  { name: "wavy", type: "boolean", default: "false", description: "Expressive wavy active indicator." },
  { name: "thickness", type: "number", default: "4", description: "Stroke in px. The spec is 4; Expressive allows thicker, e.g. 8." },
  { name: "tone", type: '"primary" | "secondary" | "tertiary" | "error" | "inverse"', default: '"primary"', description: "Active and track roles. Inverse sits on inverse surfaces." },
  { name: "aria-label", type: "string", default: '"Progress"', description: "Accessible name. Falls back to “Progress” when unlabelled." },
  { name: "valueLabel", type: "ReactNode", default: "percentage", description: "Text announced for the value, e.g. “3 of 8 files”." },
  { name: "...ProgressBarProps", type: "AriaProgressBarProps", default: "—", description: "formatOptions, aria-labelledby, id…" },
]

export default {
  title: "Progress",
  description:
    "Linear and circular progress indicators show how long an operation will take. Determinate or indeterminate, flat or with the Expressive wavy active indicator, in any thickness.",
  links: {
    m3: "https://m3.material.io/components/progress-indicators/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/ProgressBar.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { LinearProgress } from "@/components/ui/progress"

<LinearProgress aria-label="Upload" value={64} wavy />`,
  examples: [
    {
      id: "indeterminate",
      title: "Indeterminate",
      description: "For waits of unknown length. The indeterminate circular indicator has no track, per the spec. The wave stops travelling under reduced motion.",
      component: Indeterminate,
      source: indeterminateSrc,
    },
    {
      id: "live",
      title: "Animated value",
      description: (
        <>
          Values glide on a critically damped spring, so setting <InlineCode>value</InlineCode> on every tick looks smooth. CircularProgress centers its children.
        </>
      ),
      component: Live,
      source: liveSrc,
    },
    {
      id: "thickness",
      title: "Thickness",
      description: "4dp by default. Thicker strokes keep the 4dp gap between active indicator and track, and the wave scales with them.",
      component: Thickness,
      source: thicknessSrc,
    },
    { id: "tones", title: "Tones", description: "Primary by default. Use error for quotas and limits, inverse on snackbars.", component: Tones, source: tonesSrc },
  ],
  api: [
    {
      name: "LinearProgress",
      description: <>React Aria's {c("ProgressBar")}, plus:</>,
      props: [...shared, { name: "showStop", type: "boolean", default: "true", description: "4dp stop dot at the end of the track (determinate only)." }],
    },
    {
      name: "CircularProgress",
      description: <>React Aria's {c("ProgressBar")}, plus:</>,
      props: [
        ...shared,
        { name: "size", type: "number", default: "40 (48 when wavy)", description: "Outer size in px." },
        { name: "children", type: "ReactNode", default: "—", description: "Centered content, e.g. a percentage." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Both render {c('role="progressbar"')} with {c("aria-valuenow")}, {c("aria-valuemin")}, {c("aria-valuemax")} and a formatted {c("aria-valuetext")}.
        Indeterminate indicators omit the value. Always give a label that says what is progressing; for short waits without a value, consider the{" "}
        <TextLink to="/docs/loading-indicator">Loading indicator</TextLink>.
      </>
    ),
    notes: ["Progress isn't focusable and has no keyboard interaction.", "Under prefers-reduced-motion the wave holds still; value changes still animate."],
  },
  spec: {
    tables: [
      {
        columns: ["Indicator", "Size", "Stroke", "Gap", "Wave"],
        rows: [
          ["Linear", "full width × 4dp", "4dp", "4dp, plus 4dp stop", "—"],
          ["Linear wavy", "full width × 10dp", "4dp", "4dp", "amplitude 3dp · wavelength 40dp (20dp indeterminate)"],
          ["Circular", "40dp", "4dp", "4dp", "—"],
          ["Circular wavy", "48dp", "4dp", "4dp", "amplitude 1.6dp · wavelength 15dp"],
        ],
      },
    ],
    cards: [
      { title: "Color", items: ["Active: primary", "Track: secondary-container", "Stop indicator: primary"] },
      { title: "Motion", items: ["Value: critically damped spring, stiffness 50", "Indeterminate: looping keyframes", "Reduced motion: wave travel stops"] },
    ],
    source: <>androidx {c("LinearProgressIndicatorTokens")}, {c("CircularProgressIndicatorTokens")} and {c("ProgressIndicatorDefaults")}.</>,
  },
} satisfies ComponentDoc
