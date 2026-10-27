import Demo from "@/docs/docs-site/examples/icon-button/demo"
import demoSrc from "@/docs/docs-site/examples/icon-button/demo?raw"
import Disabled from "@/docs/docs-site/examples/icon-button/disabled"
import disabledSrc from "@/docs/docs-site/examples/icon-button/disabled?raw"
import Shapes from "@/docs/docs-site/examples/icon-button/shapes"
import shapesSrc from "@/docs/docs-site/examples/icon-button/shapes?raw"
import Sizes from "@/docs/docs-site/examples/icon-button/sizes"
import sizesSrc from "@/docs/docs-site/examples/icon-button/sizes?raw"
import Toggle from "@/docs/docs-site/examples/icon-button/toggle"
import toggleSrc from "@/docs/docs-site/examples/icon-button/toggle?raw"
import Widths from "@/docs/docs-site/examples/icon-button/widths"
import widthsSrc from "@/docs/docs-site/examples/icon-button/widths?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

const style = { name: "variant", type: '"standard" | "filled" | "tonal" | "outlined"', default: '"standard"', description: "Color style. Standard has no container." }
const size = { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"sm"', description: "Height 32 / 40 / 56 / 96 / 136dp. Sets the icon size." }
const width = { name: "width", type: '"narrow" | "default" | "wide"', default: '"default"', description: "Container width at the chosen size. Default is square." }
const shape = { name: "shape", type: '"round" | "square"', default: '"round"', description: "Resting shape. Pressing tightens both; selecting flips the family." }
const label = {
  name: "aria-label",
  type: "string",
  default: "—",
  description: <>Required (or {c("aria-labelledby")}): an icon button has no visible text, so the type won't compile without a name.</>,
}

export default {
  description: "Icon buttons take compact actions with a single glyph. Four color styles, five sizes, three widths, round or square, with an optional selected state.",
  links: {
    m3: "https://m3.material.io/components/icon-buttons/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/Button.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"

<IconButton variant="tonal" aria-label="Edit" onPress={() => edit()}>
  <Icon name="edit" />
</IconButton>`,
  examples: [
    { id: "sizes", title: "Sizes", description: "XS to XL: 32, 40, 56, 96 and 136dp tall. The glyph grows from 20 to 40dp.", component: Sizes, source: sizesSrc },
    {
      id: "widths",
      title: "Widths",
      description: (
        <>
          <InlineCode>width</InlineCode> trades horizontal room for emphasis without changing the height. At M: 48, 56 and 72dp.
        </>
      ),
      component: Widths,
      source: widthsSrc,
    },
    {
      id: "shapes",
      title: "Round and square",
      description: "Round corners are half the height; square uses the size's corner token. Both tighten to the pressed radius while held.",
      component: Shapes,
      source: shapesSrc,
    },
    {
      id: "toggle",
      title: "Toggle icon button",
      description: (
        <>
          <InlineCode>ToggleIconButton</InlineCode> adds a selected state: the M3 selected color pair, a filled glyph, and the shape flips family. Round turns square,
          square turns round.
        </>
      ),
      component: Toggle,
      source: toggleSrc,
    },
    { id: "disabled", title: "Disabled", description: "Containers drop to on-surface at 10%, glyphs to 38%. No state layer and no ripple.", component: Disabled, source: disabledSrc },
  ],
  api: [
    {
      name: "IconButton",
      description: (
        <>
          Everything React Aria's {c("Button")} accepts, plus the recipe props below. Also exported: {c("iconButtonVariants")}.
        </>
      ),
      props: [
        style,
        size,
        width,
        shape,
        label,
        { name: "isDisabled", type: "boolean", default: "false", description: "Disables the button and removes it from the tab order." },
        { name: "onPress", type: "(e: PressEvent) => void", default: "—", description: "Unified press handler for mouse, touch, pen, keyboard and virtual presses." },
        { name: "ref", type: "Ref<HTMLButtonElement>", default: "—", description: "The underlying <button>." },
        { name: "...ButtonProps", type: "AriaButtonProps", default: "—", description: "Any other React Aria Button prop (type, form, onHoverStart…)." },
      ],
    },
    {
      name: "ToggleIconButton",
      description: <>Same recipe props as {c("IconButton")}, on React Aria's {c("ToggleButton")}.</>,
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
        A native {c("<button>")} through React Aria. The accessible name comes from {c("aria-label")}, which the props type requires; the glyph itself is{" "}
        {c("aria-hidden")}. ToggleIconButton adds {c("aria-pressed")}. Pair it with a <TextLink to="/docs/tooltip">Tooltip</TextLink> so pointer users see the
        label too.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves focus to the button. A 3dp secondary focus ring shows for keyboard focus only." },
      { keys: ["Space", "Enter"], description: "Activates the button, or toggles a ToggleIconButton. The press morph plays as it does for a pointer." },
      { label: "Disabled", description: "Removed from the tab order and announced as disabled." },
    ],
    notes: ["Label the action, not the glyph: “Remove from favorites”, not “Heart”.", "For a selected toggle keep the same label; aria-pressed carries the state."],
  },
  spec: {
    tables: [
      {
        columns: ["Size", "Height", "Narrow · Default · Wide", "Icon", "Round · Square", "Pressed", "Selected", "Outline"],
        rows: [
          ["XS", "32dp", "28 · 32 · 40dp", "20dp", "full · 12dp", "8dp", "12dp · full", "1dp"],
          ["S", "40dp", "32 · 40 · 52dp", "24dp", "full · 12dp", "8dp", "12dp · full", "1dp"],
          ["M", "56dp", "48 · 56 · 72dp", "24dp", "full · 16dp", "12dp", "16dp · full", "1dp"],
          ["L", "96dp", "64 · 96 · 128dp", "32dp", "full · 28dp", "16dp", "28dp · full", "2dp"],
          ["XL", "136dp", "104 · 136 · 184dp", "40dp", "full · 28dp", "16dp", "28dp · full", "3dp"],
        ],
      },
    ],
    cards: [
      {
        title: "Motion",
        items: [
          <>Shape, press and select: {c("fast-spatial")} 0.6 / 800 (374ms)</>,
          <>Color and glyph fill: {c("default-effects")} 1.0 / 1600 (223ms)</>,
          <>CSS: the {c("shape-morph")} utility</>,
        ],
      },
      {
        title: "Color",
        items: [
          "Standard: on-surface-variant → primary when selected",
          "Filled: primary · surface-container → primary as a toggle",
          "Tonal: secondary-container → secondary",
          "Outlined: outline-variant border → inverse-surface",
        ],
      },
      { title: "States", items: ["Hover 8%, focus 10%, pressed 12% state layer", "Disabled: container on-surface 10%, glyph 38%"] },
    ],
    source: (
      <>
        Sizes, widths (icon + 2 × leading space), corners and outlines from androidx {c("XSmallIconButtonTokens")} … {c("XLargeIconButtonTokens")}.
      </>
    ),
  },
} satisfies ComponentDoc
