import Demo from "@/docs/docs-site/examples/button/demo"
import demoSrc from "@/docs/docs-site/examples/button/demo?raw"
import Disabled from "@/docs/docs-site/examples/button/disabled"
import disabledSrc from "@/docs/docs-site/examples/button/disabled?raw"
import Group from "@/docs/docs-site/examples/button/group"
import groupSrc from "@/docs/docs-site/examples/button/group?raw"
import Icons from "@/docs/docs-site/examples/button/icons"
import iconsSrc from "@/docs/docs-site/examples/button/icons?raw"
import Pending from "@/docs/docs-site/examples/button/pending"
import pendingSrc from "@/docs/docs-site/examples/button/pending?raw"
import Sizes from "@/docs/docs-site/examples/button/sizes"
import sizesSrc from "@/docs/docs-site/examples/button/sizes?raw"
import Square from "@/docs/docs-site/examples/button/square"
import squareSrc from "@/docs/docs-site/examples/button/square?raw"
import Toggle from "@/docs/docs-site/examples/button/toggle"
import toggleSrc from "@/docs/docs-site/examples/button/toggle?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description: "Buttons let people take action with a single press. Five color styles, five sizes, round or square, and corners that tighten when pressed.",
  links: {
    m3: "https://m3.material.io/components/buttons/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/Button.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"

<Button variant="filled" size="md" icon={<Icon name="save" />} onPress={() => save()}>
  Save changes
</Button>`,
  examples: [
    {
      id: "sizes",
      title: "Sizes",
      description: "Five sizes, XS to XL. Heights 32, 40, 56, 96 and 136dp; icon and label scale with them.",
      component: Sizes,
      source: sizesSrc,
    },
    {
      id: "square",
      title: "Square shape",
      description: "shape=\"square\" starts with the size's square corners. Pressing tightens them further, just like a round button.",
      component: Square,
      source: squareSrc,
    },
    {
      id: "icons",
      title: "With icons and color",
      description: (
        <>
          <InlineCode>icon</InlineCode> leads, <InlineCode>trailingIcon</InlineCode> trails; both pick up the size's icon size. <InlineCode>color</InlineCode> swaps
          the role pair: filled uses the solid role, tonal its container.
        </>
      ),
      component: Icons,
      source: iconsSrc,
    },
    {
      id: "toggle",
      title: "Toggle button",
      description: "ToggleButton flips round → square when selected and swaps in the M3 selected color pair. Icons fill as it selects.",
      component: Toggle,
      source: toggleSrc,
    },
    {
      id: "pending",
      title: "Pending",
      description: "isPending swaps the leading icon for the morphing loading indicator and ignores presses while keeping focus.",
      component: Pending,
      source: pendingSrc,
    },
    {
      id: "disabled",
      title: "Disabled",
      description: "Containers drop to on-surface at 10%, labels to 38%. No state layer, no ripple, no elevation.",
      component: Disabled,
      source: disabledSrc,
    },
    {
      id: "group",
      title: "Button group & split button",
      description: (
        <>
          Connected groups share 2dp gaps and the selected segment rounds out. Split buttons pair an action with a menu. Both live in{" "}
          <TextLink to="/docs/button-group">Button group</TextLink>.
        </>
      ),
      component: Group,
      source: groupSrc,
    },
  ],
  api: [
    {
      name: "Button",
      description: (
        <>
          Everything React Aria's {c("Button")} accepts, plus the recipe props below. Also exported: {c("buttonVariants")}, the {c("tv()")} recipe, for styling
          links or other elements as buttons.
        </>
      ),
      props: [
        { name: "variant", type: '"filled" | "tonal" | "elevated" | "outlined" | "text"', default: '"filled"', description: "Color style. Maps to the M3 common button types." },
        { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"sm"', description: "Height 32 / 40 / 56 / 96 / 136dp. Sets padding, icon and label size." },
        { name: "shape", type: '"round" | "square"', default: '"round"', description: "Resting shape. Both tighten to the pressed radius on press." },
        {
          name: "color",
          type: '"primary" | "secondary" | "tertiary" | "error"',
          default: "—",
          description: "Accent role. Filled uses the solid role, tonal its container, the rest a role-colored label. Omit for the M3 defaults.",
        },
        { name: "icon", type: "ReactNode", default: "—", description: "Leading slot. Replaced by the loading indicator while pending." },
        { name: "trailingIcon", type: "ReactNode", default: "—", description: "Trailing slot." },
        { name: "isPending", type: "boolean", default: "false", description: "Shows the loading indicator, ignores presses and keeps focus." },
        { name: "isDisabled", type: "boolean", default: "false", description: "Disables the button and removes it from the tab order." },
        { name: "onPress", type: "(e: PressEvent) => void", default: "—", description: "Unified press handler for mouse, touch, pen, keyboard and virtual presses." },
        { name: "ref", type: "Ref<HTMLButtonElement>", default: "—", description: "The underlying <button>." },
      ],
    },
    {
      name: "ToggleButton",
      description: (
        <>
          Same recipe props as {c("Button")} (except {c("isPending")}), on React Aria's {c("ToggleButton")}.
        </>
      ),
      props: [
        { name: "isSelected", type: "boolean", default: "—", description: "Controlled selected state." },
        { name: "defaultSelected", type: "boolean", default: "false", description: "Initial selected state when uncontrolled." },
        { name: "onChange", type: "(isSelected: boolean) => void", default: "—", description: "Called when the selected state changes." },
        { name: "id", type: "Key", default: "—", description: "Identifies the button inside a ToggleButtonGroup." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Rendered as a native {c("<button>")} through React Aria, so press handling works the same for mouse, touch, pen and keyboard, and virtual presses from
        screen readers fire {c("onPress")}. ToggleButton adds {c("aria-pressed")}. Buttons without visible text should be an{" "}
        <TextLink to="/docs/icon-button">Icon button</TextLink>, which requires an {c("aria-label")}.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves focus to the button. The focus ring is a 3dp secondary outline, offset 2dp, shown only for keyboard focus." },
      { keys: ["Space", "Enter"], description: "Activates the button. The press shape morph and 12% state layer play exactly as they do for a pointer." },
      { label: "Pending", description: "Presses are ignored and focus stays on the button; React Aria announces the pending state to screen readers." },
      { label: "Disabled", description: "Removed from the tab order and announced as disabled." },
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Size", "Height", "Padding", "Icon", "Label", "Round · Square", "Pressed", "Selected"],
        rows: [
          ["XS", "32dp", "12dp", "20dp", c("label-large"), "full · 12dp", "8dp", "12dp"],
          ["S", "40dp", "16dp", "20dp", c("label-large"), "full · 12dp", "8dp", "12dp"],
          ["M", "56dp", "24dp", "24dp", c("title-medium"), "full · 16dp", "12dp", "16dp"],
          ["L", "96dp", "48dp", "32dp", c("headline-small"), "full · 28dp", "16dp", "28dp"],
          ["XL", "136dp", "64dp", "40dp", c("headline-large"), "full · 28dp", "16dp", "28dp"],
        ],
      },
    ],
    cards: [
      {
        title: "Motion",
        items: [
          <>Shape, press and release: {c("fast-spatial")} 0.6 / 800 (374ms)</>,
          <>Color: {c("default-effects")} 1.0 / 1600 (223ms)</>,
          <>State layer: {c("fast-effects")} 1.0 / 3800 (154ms)</>,
          <>CSS: the {c("shape-morph")} utility</>,
        ],
      },
      {
        title: "States",
        items: ["Hover state layer 8%", "Focus state layer 10% + 3dp ring", "Pressed state layer 12% + ripple", "Disabled: container on-surface 10%, label 38%"],
      },
      {
        title: "Elevation & color",
        items: [
          "Elevated: level 1, level 2 on hover",
          "Filled, tonal: level 0, level 1 on hover",
          "Outlined: 1dp outline-variant",
          "Containers: primary · secondary-container · surface-container-low",
        ],
      },
    ],
    source: (
      <>
        Sizes, corners and motion from androidx {c("ButtonXSmallTokens")} … {c("ButtonXLargeTokens")}, {c("ToggleButtonDefaults")} and{" "}
        {c("ExpressiveMotionTokens")}. Round corners are exactly half the height so the morph animates from the first frame.
      </>
    ),
  },
} satisfies ComponentDoc
