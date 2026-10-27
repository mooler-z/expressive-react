import AccentDense from "@/docs/docs-site/examples/radio/accent-dense"
import accentDenseSrc from "@/docs/docs-site/examples/radio/accent-dense?raw"
import Demo from "@/docs/docs-site/examples/radio/demo"
import demoSrc from "@/docs/docs-site/examples/radio/demo?raw"
import Descriptions from "@/docs/docs-site/examples/radio/descriptions"
import descriptionsSrc from "@/docs/docs-site/examples/radio/descriptions?raw"
import Horizontal from "@/docs/docs-site/examples/radio/horizontal"
import horizontalSrc from "@/docs/docs-site/examples/radio/horizontal?raw"
import Trailing from "@/docs/docs-site/examples/radio/trailing"
import trailingSrc from "@/docs/docs-site/examples/radio/trailing?raw"
import Validation from "@/docs/docs-site/examples/radio/validation"
import validationSrc from "@/docs/docs-site/examples/radio/validation?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Radio buttons let people pick exactly one option from a set. The selected dot springs in; the group handles labels, descriptions and validation.",
  links: {
    m3: "https://m3.material.io/components/radio-button/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/RadioGroup.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Radio, RadioGroup } from "@/components/ui/radio"

<RadioGroup label="Plan" defaultValue="pro" onChange={setPlan}>
  <Radio value="free">Free</Radio>
  <Radio value="pro">Pro</Radio>
</RadioGroup>`,
  examples: [
    {
      id: "horizontal",
      title: "Horizontal",
      description: <>orientation="horizontal" lays the options out in a wrapping row. Arrow keys follow the layout.</>,
      component: Horizontal,
      source: horizontalSrc,
    },
    {
      id: "descriptions",
      title: "With descriptions",
      description: (
        <>
          Each <InlineCode>Radio</InlineCode> takes any children; the group's <InlineCode>description</InlineCode> sits under the options.
        </>
      ),
      component: Descriptions,
      source: descriptionsSrc,
    },
    {
      id: "trailing",
      title: "Trailing in a list",
      description: <>placement="end" puts the indicator after the label, the usual layout for list rows and settings.</>,
      component: Trailing,
      source: trailingSrc,
    },
    {
      id: "validation",
      title: "Validation",
      description: (
        <>
          When <InlineCode>isInvalid</InlineCode>, the label, rings and dot turn error and <InlineCode>errorMessage</InlineCode> shows with an error
          icon.
        </>
      ),
      component: Validation,
      source: validationSrc,
    },
    {
      id: "accent-dense",
      title: "Accent color and density",
      description: (
        <>
          Recolor with <InlineCode>[--radio-accent:var(--md-tertiary)]</InlineCode>. <InlineCode>dense</InlineCode> shrinks the touch target to 40dp
          for tight layouts.
        </>
      ),
      component: AccentDense,
      source: accentDenseSrc,
    },
  ],
  api: [
    {
      name: "RadioGroup",
      description: <>Everything React Aria's {c("RadioGroup")} accepts, plus:</>,
      props: [
        { name: "label", type: "ReactNode", default: "—", description: "Visible group label. Without it, pass aria-label." },
        { name: "description", type: "ReactNode", default: "—", description: "Supporting text under the options." },
        { name: "errorMessage", type: "ReactNode", default: "—", description: "Shown with an error icon when the group is invalid." },
        { name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Layout and arrow-key direction." },
        { name: "value · defaultValue", type: "string | null", default: "—", description: "Selected option, controlled or initial." },
        { name: "onChange", type: "(value: string) => void", default: "—", description: "Called when the selection changes." },
        { name: "isInvalid · isRequired · isDisabled", type: "boolean", default: "false", description: "Validation and disabled state for the whole group." },
      ],
    },
    {
      name: "Radio",
      description: <>Everything React Aria's {c("Radio")} accepts, plus:</>,
      props: [
        { name: "value", type: "string", default: "—", description: "Required. The value the group reports when this option is selected." },
        { name: "placement", type: '"start" | "end"', default: '"start"', description: "Indicator before or after the label." },
        { name: "dense", type: "boolean", default: "false", description: "40dp target instead of 48dp." },
        { name: "isDisabled", type: "boolean", default: "false", description: "Disables just this option." },
      ],
    },
    {
      name: "RadioIndicator",
      description: "The ring and dot on their own, for custom layouts such as radio cards. Must render inside a Radio.",
      props: [
        { name: "dense", type: "boolean", default: "false", description: "40dp target." },
        { name: "className", type: "string", default: "—", description: "Classes for the 48dp target." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Native {c('<input type="radio">')} elements in a {c('role="radiogroup"')} labelled by the group label. For cards or chips that pick one option,
        see <TextLink to="/docs/chip">choice chips</TextLink>.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves focus into the group, onto the selected option (or the first one)." },
      { keys: ["↑", "↓"], description: "Selects the previous or next option in a vertical group." },
      { keys: ["←", "→"], description: "Selects the previous or next option; mirrored in right-to-left layouts." },
      { keys: ["Space"], description: "Selects the focused option if it isn't already." },
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Ring", "20dp, 2dp stroke · on-surface-variant (on-surface on hover and press)"],
          ["Selected", "primary ring + 10dp primary dot"],
          ["State layer", "40dp in a 48dp target (40dp target when dense)"],
          ["Error", "error ring and dot"],
          ["Disabled", "on-surface 38%"],
        ],
      },
    ],
    cards: [
      { title: "Motion", items: [<>Dot scale: {c("fast-spatial")} 0.6 / 800 (374ms)</>, <>Ring color: {c("default-effects")} (223ms)</>] },
      { title: "States", items: ["Hover 8%", "Focus 10% + 3dp ring", "Pressed 12%", "State layer: on-surface, or the accent once selected"] },
    ],
    source: <>androidx {c("RadioButtonTokens")}: icon 20dp, state layer 40dp.</>,
  },
} satisfies ComponentDoc
