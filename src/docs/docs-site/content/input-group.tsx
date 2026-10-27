import Actions from "@/docs/docs-site/examples/input-group/actions"
import actionsSrc from "@/docs/docs-site/examples/input-group/actions?raw"
import Demo from "@/docs/docs-site/examples/input-group/demo"
import demoSrc from "@/docs/docs-site/examples/input-group/demo?raw"
import Invalid from "@/docs/docs-site/examples/input-group/invalid"
import invalidSrc from "@/docs/docs-site/examples/input-group/invalid?raw"
import Textarea from "@/docs/docs-site/examples/input-group/textarea"
import textareaSrc from "@/docs/docs-site/examples/input-group/textarea?raw"
import Toggle from "@/docs/docs-site/examples/input-group/toggle"
import toggleSrc from "@/docs/docs-site/examples/input-group/toggle?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Addons attached to a field: static prefixes and suffixes on surface-container, inline icon buttons, a joined action, and a growing textarea with a toolbar. Outlined, or a pill on surface-container-high.",
  links: { aria: "https://react-spectrum.adobe.com/react-aria/Group.html" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Field, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

<Field>
  <FieldLabel>Custom domain</FieldLabel>
  <InputGroup>
    <InputGroupAddon>https://</InputGroupAddon>
    <InputGroupInput />
    <InputGroupAddon align="end">.kestrel.io</InputGroupAddon>
  </InputGroup>
</Field>`,
  examples: [
    {
      id: "actions",
      title: "Inline actions",
      description: "Icon buttons sit inside the group for copy, regenerate or clear. The input takes the remaining width and each button is its own tab stop.",
      component: Actions,
      source: actionsSrc,
    },
    {
      id: "toggle",
      title: "Joined button",
      description: (
        <>
          <InlineCode>InputGroupButton</InlineCode> is a flat action that fills the group's height, for show/hide, scope pickers or units. Add a border to
          separate it.
        </>
      ),
      component: Toggle,
      source: toggleSrc,
    },
    {
      id: "textarea",
      title: "Textarea with a toolbar",
      description: (
        <>
          <InlineCode>size="auto"</InlineCode> stacks the group vertically: a textarea on top, a row of actions below. The focus ring wraps both.
        </>
      ),
      component: Textarea,
      source: textareaSrc,
    },
    {
      id: "invalid",
      title: "Invalid",
      description: (
        <>
          Set <InlineCode>isInvalid</InlineCode> on the group as well as the field: the outline goes 2dp error and addons tint error. Type a valid port to clear
          it.
        </>
      ),
      component: Invalid,
      source: invalidSrc,
    },
  ],
  api: [
    {
      name: "InputGroup",
      description: <>A React Aria {c("Group")} (focus-within and hover states, isInvalid, isDisabled). Put it inside a {c("Field")} or React Aria {c("TextField")} so the input is labelled.</>,
      props: [
        { name: "variant", type: '"outlined" | "pill"', default: '"outlined"', description: "outlined: 4dp corners and a 1dp outline. pill: surface-container-high with full corners." },
        { name: "size", type: '"md" | "sm" | "auto"', default: '"md"', description: "56dp, 48dp, or auto height (vertical stack for textareas)." },
        { name: "isInvalid", type: "boolean", default: "false", description: "2dp error outline (or ring on pill) and error-tinted addons." },
        { name: "isDisabled", type: "boolean", default: "false", description: "Fades the whole group to 38%." },
      ],
    },
    {
      name: "InputGroupAddon",
      description: <>A {c("<span>")} for static text or icons.</>,
      props: [
        { name: "variant", type: '"container" | "plain"', default: '"container"', description: "container: surface-container block with a divider. plain: bare icon or text inside the field." },
        { name: "align", type: '"start" | "end"', default: '"start"', description: "Which side the divider goes on (container variant)." },
      ],
    },
    {
      name: "InputGroupInput · InputGroupTextArea · InputGroupButton",
      props: [
        { name: "InputGroupInput", type: "InputProps", default: "—", description: "React Aria Input that fills the remaining width. No horizontal padding in pills." },
        { name: "InputGroupTextArea", type: "TextAreaProps", default: "rows 3", description: "Borderless textarea for size=\"auto\" groups." },
        { name: "InputGroupButton", type: "ButtonProps", default: "—", description: "React Aria Button with a state layer and ripple, full group height." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        The group is presentational; the label comes from the enclosing field, which labels the input. Addon text is visible but not part of the
        accessible name, so mention units in the label or description when they matter (“Budget (USD)”). Icon buttons need their own {c("aria-label")}.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves through the input, then each button in the group, in DOM order." },
      { keys: ["Space", "Enter"], description: "Activates a focused InputGroupButton or IconButton." },
    ],
    notes: [
      <>
        For a choice joined to an input (currency, period), use a <TextLink to="/docs/select">Select</TextLink> inside the group, so it keeps listbox
        semantics.
      </>,
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Outlined", "Pill"],
        rows: [
          ["Container", "transparent, 1dp outline, 4dp corners", "surface-container-high, full corners"],
          ["Height", "56dp · 48dp · auto", "56dp · 48dp"],
          ["Focused", "2dp primary (1dp border + inset ring)", "2dp primary ring"],
          ["Invalid", "2dp error outline", "2dp error ring"],
          ["Addon", "surface-container, 1dp divider, body-large", "plain icon or text"],
          ["Disabled", "group at 38%", "group at 38%"],
        ],
      },
    ],
    cards: [{ title: "Motion", items: [<>Outline and ring: {c("fast-effects")} 1.0 / 3800 (154ms)</>] }],
    source: <>Outline values follow androidx {c("OutlinedTextFieldTokens")}; addon and pill styles from the kit.</>,
  },
} satisfies ComponentDoc
