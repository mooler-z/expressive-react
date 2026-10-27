import Controlled from "@/docs/docs-site/examples/switch/controlled"
import controlledSrc from "@/docs/docs-site/examples/switch/controlled?raw"
import Demo from "@/docs/docs-site/examples/switch/demo"
import demoSrc from "@/docs/docs-site/examples/switch/demo?raw"
import Disabled from "@/docs/docs-site/examples/switch/disabled"
import disabledSrc from "@/docs/docs-site/examples/switch/disabled?raw"
import Icons from "@/docs/docs-site/examples/switch/icons"
import iconsSrc from "@/docs/docs-site/examples/switch/icons?raw"
import SettingsList from "@/docs/docs-site/examples/switch/settings-list"
import settingsListSrc from "@/docs/docs-site/examples/switch/settings-list?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Switches toggle a single setting on or off, and take effect immediately. A 52×32dp track with a handle that grows and slides on the M3 Expressive spring.",
  links: {
    m3: "https://m3.material.io/components/switch/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/Switch.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Switch } from "@/components/ui/switch"

<Switch defaultSelected onChange={(on) => setWifi(on)}>
  Wi-Fi
</Switch>`,
  examples: [
    {
      id: "icons",
      title: "With icons",
      description: (
        <>
          <InlineCode>icons</InlineCode> draws ✕ in the unselected handle and ✓ in the selected one. The unselected handle grows to 24dp to fit
          the glyph.
        </>
      ),
      component: Icons,
      source: iconsSrc,
    },
    {
      id: "controlled",
      title: "Controlled",
      description: (
        <>
          Pass <InlineCode>isSelected</InlineCode> and <InlineCode>onChange</InlineCode> to drive it from state. Switches act immediately; use a{" "}
          <TextLink to="/docs/checkbox">Checkbox</TextLink> when the choice is only applied on submit.
        </>
      ),
      component: Controlled,
      source: controlledSrc,
    },
    {
      id: "settings-list",
      title: "Settings list",
      description: "The whole row is the label. flex-row-reverse puts the track at the end, the common layout for settings.",
      component: SettingsList,
      source: settingsListSrc,
    },
    {
      id: "disabled",
      title: "Disabled",
      description: "The whole control drops to 38% opacity and ignores presses.",
      component: Disabled,
      source: disabledSrc,
    },
  ],
  api: [
    {
      name: "Switch",
      description: <>Everything React Aria's {c("Switch")} accepts, plus:</>,
      props: [
        { name: "icons", type: "boolean", default: "false", description: "Show ✓ / ✕ glyphs inside the handle." },
        { name: "isSelected", type: "boolean", default: "—", description: "Controlled on state." },
        { name: "defaultSelected", type: "boolean", default: "false", description: "Initial state when uncontrolled." },
        { name: "onChange", type: "(isSelected: boolean) => void", default: "—", description: "Called when the switch is toggled." },
        { name: "isDisabled", type: "boolean", default: "false", description: "Disables the switch." },
        { name: "isReadOnly", type: "boolean", default: "false", description: "Focusable and announced, but can't be toggled." },
        { name: "value · name", type: "string", default: "—", description: "Form value and field name for the hidden native input." },
        { name: "children", type: "ReactNode", default: "—", description: "The label, rendered after the track." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        A visually hidden native {c('<input type="checkbox" role="switch">')} inside a {c("<label>")}: screen readers announce "switch, on/off", and
        the label text toggles it.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves focus to the switch. The 3dp secondary focus ring wraps the track." },
      { keys: ["Space"], description: "Toggles the switch." },
      { label: "Disabled", description: "Skipped by Tab and announced as disabled." },
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Unselected", "Selected"],
        rows: [
          ["Track", "52×32dp · 2dp outline · surface-container-highest", "primary, no outline"],
          ["Handle", "16dp outline (24dp with icons)", "24dp on-primary"],
          ["Handle · pressed", "28dp", "28dp"],
          ["Handle · hover", "on-surface-variant", "primary-container"],
          ["Icon", "16dp, surface-container-highest", "16dp, on-primary-container"],
          ["State layer", "40dp, on-surface", "40dp, primary"],
        ],
      },
    ],
    cards: [
      {
        title: "Motion",
        items: [
          <>Handle slide and size: {c("fast-spatial")} 0.6 / 800 (374ms)</>,
          "Track color: 200ms standard",
          "Icons cross-fade 200ms",
        ],
      },
      { title: "States", items: ["Hover 8%", "Focus 10% + 3dp ring", "Pressed 12%", "Disabled: whole control at 38%"] },
    ],
    source: <>androidx {c("SwitchTokens")}: track 52×32dp, handle 16 / 24 / 28dp, icon 16dp, state layer 40dp.</>,
  },
} satisfies ComponentDoc
