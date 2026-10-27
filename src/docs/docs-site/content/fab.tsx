import Collapse from "@/docs/docs-site/examples/fab/collapse"
import collapseSrc from "@/docs/docs-site/examples/fab/collapse?raw"
import Colors from "@/docs/docs-site/examples/fab/colors"
import colorsSrc from "@/docs/docs-site/examples/fab/colors?raw"
import Demo from "@/docs/docs-site/examples/fab/demo"
import demoSrc from "@/docs/docs-site/examples/fab/demo?raw"
import Extended from "@/docs/docs-site/examples/fab/extended"
import extendedSrc from "@/docs/docs-site/examples/fab/extended?raw"
import Menu from "@/docs/docs-site/examples/fab/menu"
import menuSrc from "@/docs/docs-site/examples/fab/menu?raw"
import Sizes from "@/docs/docs-site/examples/fab/sizes"
import sizesSrc from "@/docs/docs-site/examples/fab/sizes?raw"
import { InlineCode } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>
const colors = '"primary-container" | "secondary-container" | "tertiary-container" | "primary" | "secondary" | "tertiary" | "surface"'

export default {
  title: "FAB · Extended · Menu",
  description:
    "Floating action buttons hold a screen's most important action. Four sizes, container or solid colors, an extended version with a label that collapses, and the Expressive FAB menu.",
  links: {
    m3: "https://m3.material.io/components/floating-action-button/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/Menu.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { ExtendedFab, Fab } from "@/components/ui/fab"
import { Icon } from "@/components/ui/icon"

<Fab aria-label="Compose" onPress={compose}>
  <Icon name="edit" />
</Fab>

<ExtendedFab icon="add" onPress={create}>New project</ExtendedFab>`,
  examples: [
    { id: "sizes", title: "Sizes", description: "Small 40dp, base 56dp, medium 80dp and large 96dp. Corners grow with the size: 12, 16, 20, 28dp.", component: Sizes, source: sizesSrc },
    {
      id: "colors",
      title: "Colors",
      description: "Primary container is the default. The other containers and the solid roles are alternates; surface is the low-emphasis option.",
      component: Colors,
      source: colorsSrc,
    },
    {
      id: "extended",
      title: "Extended FAB",
      description: "A label next to the icon, in three sizes. Leave out the icon for a label-only FAB.",
      component: Extended,
      source: extendedSrc,
    },
    {
      id: "collapse",
      title: "Collapse to icon",
      description: (
        <>
          <InlineCode>expanded={"{false}"}</InlineCode> folds the label away on the fast spatial spring, leaving the icon-only FAB of the same height. The label stays
          in the accessibility tree. Drive it from scroll direction to shrink the FAB while reading.
        </>
      ),
      component: Collapse,
      source: collapseSrc,
    },
    {
      id: "menu",
      title: "FAB menu",
      description:
        "The FAB morphs into a close button and up to six actions reveal bottom-up above it, each growing out from the trailing edge. Arrow keys move through the items; Escape closes.",
      component: Menu,
      source: menuSrc,
      className: "min-h-[360px] items-end p-6",
    },
  ],
  api: [
    {
      name: "Fab",
      description: <>Icon-only FAB on React Aria's {c("Button")}. Pass an {c("<Icon>")} as the child. Also exported: {c("fabVariants")}.</>,
      props: [
        { name: "size", type: '"sm" | "base" | "md" | "lg"', default: '"base"', description: "40 / 56 / 80 / 96dp." },
        { name: "color", type: colors, default: '"primary-container"', description: "Container and icon role pair." },
        { name: "aria-label", type: "string", default: "—", description: <>Required (or {c("aria-labelledby")}).</> },
        { name: "onPress", type: "(e: PressEvent) => void", default: "—", description: "Press handler." },
        { name: "...ButtonProps", type: "AriaButtonProps", default: "—", description: "Any other React Aria Button prop." },
      ],
    },
    {
      name: "ExtendedFab",
      description: <>Icon plus label. Also exported: {c("extendedFabVariants")}.</>,
      props: [
        { name: "children", type: "ReactNode", default: "—", description: "The label. Also its accessible name." },
        { name: "icon", type: "string | ReactNode", default: "—", description: "Leading icon: a Material Symbols name or a node." },
        { name: "size", type: '"sm" | "md" | "lg"', default: '"sm"', description: "56 / 80 / 96dp tall." },
        { name: "color", type: colors, default: '"primary-container"', description: "Container and content role pair." },
        { name: "expanded", type: "boolean", default: "true", description: "Show the label. Animate to false to collapse into an icon-only FAB." },
        { name: "...ButtonProps", type: "AriaButtonProps", default: "—", description: "Any other React Aria Button prop." },
      ],
    },
    {
      name: "FabMenu",
      description: <>A FAB that opens a menu of actions above it. Accepts React Aria {c("Menu")} props ({c("onAction")}, {c("disabledKeys")}…).</>,
      props: [
        { name: "aria-label", type: "string", default: "—", description: "Required. Names the toggle button, e.g. “Create”." },
        { name: "icon", type: "string", default: '"add"', description: "Icon while closed." },
        { name: "closeIcon", type: "string", default: '"close"', description: "Icon while open." },
        { name: "size", type: '"base" | "md" | "lg"', default: '"base"', description: "Toggle size while closed. Open, it is always the 56dp round close button." },
        { name: "color", type: '"primary" | "secondary" | "tertiary"', default: '"primary"', description: "Container role family for the toggle and items." },
        { name: "align", type: '"end" | "start"', default: '"end"', description: "Which edge the items align to." },
        { name: "isOpen", type: "boolean", default: "—", description: "Controlled open state." },
        { name: "defaultOpen", type: "boolean", default: "false", description: "Initial open state when uncontrolled." },
        { name: "onOpenChange", type: "(isOpen: boolean) => void", default: "—", description: "Called when the menu opens or closes." },
        { name: "onAction", type: "(key: Key) => void", default: "—", description: "Called with the chosen item's id." },
      ],
    },
    {
      name: "FabMenuItem",
      description: <>One action. Accepts React Aria {c("MenuItem")} props.</>,
      props: [
        { name: "id", type: "Key", default: "—", description: "Passed to onAction." },
        { name: "icon", type: "string | ReactNode", default: "—", description: "Leading icon." },
        { name: "children", type: "ReactNode", default: "—", description: "The label." },
        { name: "index", type: "number", default: "auto", description: "Position used to stagger the reveal. Set by FabMenu." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Fab and ExtendedFab are native buttons. FabMenu is a React Aria {c("MenuTrigger")}: the toggle gets {c("aria-haspopup")} and {c("aria-expanded")}, the items
        form a {c("menu")}, and focus moves into it on open and back to the FAB on close.
      </>
    ),
    keyboard: [
      { keys: ["Space", "Enter"], description: "Activates a FAB, or opens the FAB menu with focus on its first item." },
      { keys: ["↑", "↓"], description: "Moves between FAB menu items." },
      { keys: ["Enter"], description: "Runs the focused menu item and closes the menu." },
      { keys: ["Esc"], description: "Closes the FAB menu and returns focus to the FAB." },
    ],
    notes: ["A collapsed ExtendedFab keeps its label for screen readers, so it still announces “Navigate”."],
  },
  spec: {
    tables: [
      {
        title: "FAB",
        columns: ["Size", "Container", "Corner", "Icon"],
        rows: [
          ["Small", "40dp", "12dp", "24dp"],
          ["Base", "56dp", "16dp", "24dp"],
          ["Medium", "80dp", "20dp", "28dp"],
          ["Large", "96dp", "28dp", "36dp"],
        ],
      },
      {
        title: "Extended FAB",
        columns: ["Size", "Height", "Corner", "Padding", "Icon gap", "Icon", "Label"],
        rows: [
          ["Small", "56dp", "16dp", "16dp", "8dp", "24dp", c("title-medium")],
          ["Medium", "80dp", "20dp", "26dp", "16dp", "28dp", c("title-large")],
          ["Large", "96dp", "28dp", "28dp", "20dp", "32dp", c("headline-small")],
        ],
      },
    ],
    cards: [
      { title: "Elevation", items: ["Level 3 at rest", "Level 4 on hover", "Disabled: on-surface 10%, no shadow"] },
      {
        title: "FAB menu",
        items: [
          "Open toggle: 56dp circle, solid role, 20dp close icon",
          "Items: 56dp pills, container role, title-medium, 24dp sides",
          "Items 4dp apart, 8dp above the toggle",
        ],
      },
      { title: "Motion", items: [<>Morph and item growth: {c("fast-spatial")}</>, <>Item fade: {c("fast-effects")}, staggered bottom-up</>] },
    ],
    source: (
      <>
        androidx {c("FabSmallTokens")}, {c("FabBaselineTokens")}, {c("FabMediumTokens")}, {c("FabLargeTokens")}, {c("ExtendedFab*Tokens")} and{" "}
        {c("FabMenuBaselineTokens")}. The large FAB icon is 36dp; Compose notes its 32dp token is wrong.
      </>
    ),
  },
} satisfies ComponentDoc
