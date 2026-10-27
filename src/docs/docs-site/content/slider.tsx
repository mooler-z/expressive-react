import Centered from "@/docs/docs-site/examples/slider/centered"
import centeredSrc from "@/docs/docs-site/examples/slider/centered?raw"
import ColorStates from "@/docs/docs-site/examples/slider/color-states"
import colorStatesSrc from "@/docs/docs-site/examples/slider/color-states?raw"
import Demo from "@/docs/docs-site/examples/slider/demo"
import demoSrc from "@/docs/docs-site/examples/slider/demo?raw"
import Discrete from "@/docs/docs-site/examples/slider/discrete"
import discreteSrc from "@/docs/docs-site/examples/slider/discrete?raw"
import IconExample from "@/docs/docs-site/examples/slider/icon"
import iconSrc from "@/docs/docs-site/examples/slider/icon?raw"
import Range from "@/docs/docs-site/examples/slider/range"
import rangeSrc from "@/docs/docs-site/examples/slider/range?raw"
import Sizes from "@/docs/docs-site/examples/slider/sizes"
import sizesSrc from "@/docs/docs-site/examples/slider/sizes?raw"
import Vertical from "@/docs/docs-site/examples/slider/vertical"
import verticalSrc from "@/docs/docs-site/examples/slider/vertical?raw"
import { InlineCode } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Sliders let people pick a value or a range from a continuous or stepped scale. M3 Expressive sizes from XS to XL, a handle that narrows while dragged, stops, a value indicator and inset icons.",
  links: {
    m3: "https://m3.material.io/components/sliders/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/Slider.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Slider } from "@/components/ui/slider"

<Slider label="Volume" showOutput defaultValue={40} onChange={setVolume} />`,
  examples: [
    {
      id: "sizes",
      title: "Sizes",
      description: "Track heights 16, 24, 40, 56 and 96dp. Larger sizes suit hero controls like volume and brightness.",
      component: Sizes,
      source: sizesSrc,
    },
    {
      id: "discrete",
      title: "Discrete with stops",
      description: (
        <>
          A <InlineCode>step</InlineCode> that gives 30 stops or fewer draws a dot at each one. <InlineCode>valueIndicator="always"</InlineCode> keeps the
          value pill visible; the default shows it only while dragging or keyboard-focused.
        </>
      ),
      component: Discrete,
      source: discreteSrc,
    },
    {
      id: "range",
      title: "Range",
      description: (
        <>
          Pass an array value to get two handles. <InlineCode>formatOptions</InlineCode> formats the output and the value indicator.
        </>
      ),
      component: Range,
      source: rangeSrc,
    },
    {
      id: "centered",
      title: "Centered",
      description: <>centered grows the active track from the middle, for symmetric scales like balance or offset.</>,
      component: Centered,
      source: centeredSrc,
    },
    {
      id: "icon",
      title: "Inset icon",
      description: "From size M up, icon sits inside the active track, or after the handle when the active track is too short to hold it.",
      component: IconExample,
      source: iconSrc,
    },
    {
      id: "color-states",
      title: "Color and disabled",
      description: (
        <>
          <InlineCode>color</InlineCode> picks the primary, tertiary or error role pair. Disabled tracks drop to on-surface at 38% and 12%.
        </>
      ),
      component: ColorStates,
      source: colorStatesSrc,
    },
    {
      id: "vertical",
      title: "Vertical",
      description: <>orientation="vertical" stands the slider up; it is 192dp tall by default, so set the height with className.</>,
      component: Vertical,
      source: verticalSrc,
    },
  ],
  api: [
    {
      name: "Slider",
      description: <>Everything React Aria's {c("Slider")} accepts, plus:</>,
      props: [
        { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"xs"', description: "Track 16 / 24 / 40 / 56 / 96dp; handle and corners scale with it." },
        { name: "color", type: '"primary" | "tertiary" | "error"', default: '"primary"', description: "Active / inactive role pair." },
        { name: "centered", type: "boolean", default: "false", description: "Grow the active track from the middle (single value)." },
        { name: "showStops", type: "boolean", default: "≤ 30 stops", description: "Dots at each step. On by default when step gives 30 stops or fewer." },
        {
          name: "valueIndicator",
          type: '"interaction" | "always" | "never"',
          default: '"interaction"',
          description: "Value pill above the handle: while dragging or keyboard-focused, always, or never.",
        },
        { name: "icon", type: "ReactNode", default: "—", description: "Icon inset in the track. Sizes M, L and XL only." },
        { name: "label", type: "ReactNode", default: "—", description: "Visible label above the track. Without it, pass aria-label." },
        { name: "showOutput", type: "boolean", default: "false", description: "Formatted value next to the label." },
        { name: "trackClassName", type: "string", default: "—", description: "Classes for the track element." },
        { name: "value · defaultValue", type: "number | number[]", default: "—", description: "An array of two values makes a range slider." },
        { name: "onChange · onChangeEnd", type: "(value: number | number[]) => void", default: "—", description: "While dragging, and once on release." },
        { name: "minValue · maxValue · step", type: "number", default: "0 · 100 · 1", description: "Scale and step size." },
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Vertical sliders are 192dp tall by default." },
        { name: "formatOptions", type: "Intl.NumberFormatOptions", default: "—", description: "Formats the output, the value indicator and the announced value." },
        { name: "isDisabled", type: "boolean", default: "false", description: "Disables all handles." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Each handle is a native {c('<input type="range">')} named by the slider's label (or {c("aria-label")}), so it reports its value and range to
        assistive tech. In right-to-left layouts the horizontal track and arrow keys mirror.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves focus to the next handle. The handle narrows to 2dp and the value indicator appears." },
      { keys: ["←", "→", "↑", "↓"], description: "Decreases or increases the value by one step." },
      { keys: ["Page Up", "Page Down"], description: "Changes the value by a larger step." },
      { keys: ["Home", "End"], description: "Jumps to the minimum or maximum." },
    ],
    notes: ["Pressing anywhere on the track moves the nearest handle there and starts a drag."],
  },
  spec: {
    tables: [
      {
        columns: ["Size", "Track", "Handle", "Outer corners", "Icon"],
        rows: [
          ["XS", "16dp", "4 × 44dp", "8dp", "—"],
          ["S", "24dp", "4 × 44dp", "8dp", "—"],
          ["M", "40dp", "4 × 52dp", "12dp", "24dp"],
          ["L", "56dp", "4 × 68dp", "16dp", "24dp"],
          ["XL", "96dp", "4 × 108dp", "28dp", "32dp"],
        ],
      },
    ],
    cards: [
      {
        title: "Anatomy",
        items: [
          "Handle 4dp wide (2dp while pressed or focused), 6dp gap each side",
          "Inner track corners 2dp",
          "Stops: 4dp dots in the opposite segment's color",
          "Value indicator: inverse-surface pill above the handle",
        ],
      },
      { title: "Color", items: ["Active: primary", "Inactive: secondary-container", "Disabled: active and handle on-surface 38%, inactive 12%"] },
    ],
    source: <>androidx {c("SliderTokens")} and Slider.kt for the handle and track geometry; the XS–XL size scale from m3.material.io.</>,
  },
} satisfies ComponentDoc
