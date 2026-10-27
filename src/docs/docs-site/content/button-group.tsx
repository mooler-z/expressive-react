import Connected from "@/docs/docs-site/examples/button-group/connected"
import connectedSrc from "@/docs/docs-site/examples/button-group/connected?raw"
import Demo from "@/docs/docs-site/examples/button-group/demo"
import demoSrc from "@/docs/docs-site/examples/button-group/demo?raw"
import Multiple from "@/docs/docs-site/examples/button-group/multiple"
import multipleSrc from "@/docs/docs-site/examples/button-group/multiple?raw"
import Segmented from "@/docs/docs-site/examples/button-group/segmented"
import segmentedSrc from "@/docs/docs-site/examples/button-group/segmented?raw"
import Sizes from "@/docs/docs-site/examples/button-group/sizes"
import sizesSrc from "@/docs/docs-site/examples/button-group/sizes?raw"
import Split from "@/docs/docs-site/examples/button-group/split"
import splitSrc from "@/docs/docs-site/examples/button-group/split?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>
const sizes = '"xs" | "sm" | "md" | "lg" | "xl"'

export default {
  title: "Button group · Split",
  description:
    "Groups of related buttons. Standard groups react together: the pressed button widens and its neighbours give way. Connected groups are segmented single or multi-select toggles. Split buttons pair an action with a menu.",
  links: {
    m3: "https://m3.material.io/components/button-groups/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/ToggleButtonGroup.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"

<ConnectedButtonGroup aria-label="Range" defaultSelectedKeys={["day"]}>
  <ConnectedButton id="day">Day</ConnectedButton>
  <ConnectedButton id="week">Week</ConnectedButton>
</ConnectedButtonGroup>`,
  examples: [
    {
      id: "connected",
      title: "Connected button group",
      description: "Segments sit 2dp apart with tight inner corners. The selected segment rounds out fully. Single selection by default, and one is always selected.",
      component: Connected,
      source: connectedSrc,
    },
    {
      id: "multiple",
      title: "Multi-select, icon only",
      description: (
        <>
          <InlineCode>selectionMode="multiple"</InlineCode> lets any combination be selected, and none. <InlineCode>iconOnly</InlineCode> tightens the padding; give
          each segment an <InlineCode>aria-label</InlineCode>.
        </>
      ),
      component: Multiple,
      source: multipleSrc,
    },
    { id: "sizes", title: "Sizes", description: "The same five sizes as buttons. Press one to watch it widen while its neighbours compress.", component: Sizes, source: sizesSrc },
    {
      id: "split",
      title: "Split button",
      description: "A leading action and a trailing menu button. While the menu is open the trailing button becomes a circle and its chevron turns 180°.",
      component: Split,
      source: splitSrc,
    },
    {
      id: "segmented",
      title: "Segmented buttons",
      description: (
        <>
          The pre-Expressive outlined segments, where a check replaces the icon when selected. Kept for parity; prefer a connected group in new designs.
        </>
      ),
      component: Segmented,
      source: segmentedSrc,
    },
  ],
  api: [
    {
      name: "ButtonGroup",
      description: <>A {c("div")} of spaced buttons that react to each other's presses. Children are {c("<Button>")}s.</>,
      props: [
        { name: "size", type: sizes, default: '"sm"', description: "Sets the gap: 18dp at XS, 12dp at S, 8dp at M and up." },
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Vertical groups stack and stretch; press expansion is off." },
        { name: "expandedRatio", type: "number", default: "0.15", description: "Share of its width the pressed button grows by. 0 disables the effect." },
      ],
    },
    {
      name: "ConnectedButtonGroup",
      description: <>React Aria's {c("ToggleButtonGroup")}, plus:</>,
      props: [
        { name: "variant", type: '"filled" | "tonal" | "elevated" | "outlined"', default: '"filled"', description: "Unselected → selected color pair, as on ToggleButton." },
        { name: "size", type: sizes, default: '"sm"', description: "Segment height 32 / 40 / 56 / 96 / 136dp." },
        { name: "selectionMode", type: '"single" | "multiple"', default: '"single"', description: "Single or multiple selection." },
        { name: "disallowEmptySelection", type: "boolean", default: "true when single", description: "Keep at least one segment selected." },
        { name: "selectedKeys / defaultSelectedKeys", type: "Iterable<Key>", default: "—", description: "Controlled or initial selection." },
        { name: "onSelectionChange", type: "(keys: Set<Key>) => void", default: "—", description: "Called when the selection changes." },
        { name: "expandedRatio", type: "number", default: "0.15", description: "Press expansion, as on ButtonGroup." },
        { name: "aria-label", type: "string", default: "—", description: "Names the group." },
      ],
    },
    {
      name: "ConnectedButton",
      description: <>React Aria's {c("ToggleButton")}. Its position (first, middle, last) is set by the group.</>,
      props: [
        { name: "id", type: "Key", default: "—", description: "Identifies the segment in the selection." },
        { name: "iconOnly", type: "boolean", default: "false", description: "Tighter padding for a glyph-only segment. Add an aria-label." },
      ],
    },
    {
      name: "SplitButton",
      description: <>Wraps one {c("SplitButtonAction")} and one {c("SplitButtonMenu")}.</>,
      props: [
        { name: "variant", type: '"filled" | "tonal" | "elevated" | "outlined"', default: '"filled"', description: "Color style for both halves." },
        { name: "size", type: sizes, default: '"sm"', description: "Height 32 / 40 / 56 / 96 / 136dp." },
      ],
    },
    {
      name: "SplitButtonAction",
      description: <>The leading half: everything React Aria's {c("Button")} accepts.</>,
      props: [{ name: "onPress", type: "(e: PressEvent) => void", default: "—", description: "The primary action." }],
    },
    {
      name: "SplitButtonMenu",
      description: <>The trailing half. Accepts React Aria {c("Menu")} props; children are {c("<MenuItem>")}s from Menu.</>,
      props: [
        { name: "aria-label", type: "string", default: "—", description: "Required. Names the menu button, e.g. “More save options”." },
        { name: "icon", type: "string", default: '"keyboard_arrow_down"', description: "Trailing glyph. Turns 180° while open." },
        { name: "placement", type: "Placement", default: '"bottom end"', description: "Menu placement." },
        { name: "isDisabled", type: "boolean", default: "false", description: "Disables the menu button only." },
        { name: "onAction", type: "(key: Key) => void", default: "—", description: "Called with the chosen item's id." },
      ],
    },
    {
      name: "SegmentedButtonGroup · SegmentedButton",
      description: <>React Aria {c("ToggleButtonGroup")} and {c("ToggleButton")}. The group defaults to single selection.</>,
      props: [{ name: "icon", type: "string", default: "—", description: "SegmentedButton only. Leading icon, replaced by a check when selected." }],
    },
    {
      name: "usePressExpansion(ref, expandedRatio?)",
      description: "The press-to-widen behaviour on its own, for any flex row of buttons.",
      props: [
        { name: "ref", type: "RefObject<HTMLElement | null>", default: "—", description: "The flex container whose direct children are buttons." },
        { name: "expandedRatio", type: "number", default: "0.15", description: "Growth of the pressed child; neighbours never shrink past their own padding." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Connected and segmented groups are React Aria {c("ToggleButtonGroup")}s: a {c("radiogroup")} of radios in single mode, a {c("toolbar")} of pressed toggles
        in multiple mode. A standard ButtonGroup is a plain container: label the buttons themselves. The split button's trailing half opens a{" "}
        <TextLink to="/docs/menu">Menu</TextLink>.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves focus into the group, to the selected segment (or the first one)." },
      { keys: ["←", "→"], description: "Moves between segments of a connected or segmented group." },
      { keys: ["Space", "Enter"], description: "Selects the focused segment, or presses a button." },
      { keys: ["↓"], description: "On a split button's menu half, opens the menu." },
    ],
    notes: ["Press expansion responds to pointer presses only and is skipped under reduced motion."],
  },
  spec: {
    tables: [
      {
        title: "Connected group",
        columns: ["Size", "Height", "Gap", "Outer corner", "Inner corner", "Pressed inner", "Selected"],
        rows: [
          ["XS", "32dp", "2dp", "full", "8dp", "4dp", "full"],
          ["S", "40dp", "2dp", "full", "8dp", "4dp", "full"],
          ["M", "56dp", "2dp", "full", "8dp", "4dp", "full"],
          ["L", "96dp", "2dp", "full", "16dp", "12dp", "full"],
          ["XL", "136dp", "2dp", "full", "16dp", "12dp", "full"],
        ],
      },
      {
        title: "Split button",
        columns: ["Size", "Height", "Inner corner", "Hover / pressed inner", "Trailing padding", "Trailing icon"],
        rows: [
          ["XS", "32dp", "4dp", "8dp", "13dp", "22dp"],
          ["S", "40dp", "4dp", "12dp", "13dp", "22dp"],
          ["M", "56dp", "4dp", "12dp", "15dp", "26dp"],
          ["L", "96dp", "8dp", "20dp", "29dp", "38dp"],
          ["XL", "136dp", "12dp", "20dp", "43dp", "50dp"],
        ],
      },
    ],
    cards: [
      { title: "Standard group", items: ["Gap: XS 18dp · S 12dp · M–XL 8dp", "Pressed button grows 15% of its width", "Neighbours never compress past their padding"] },
      { title: "Motion", items: [<>Widening, corners and chevron: {c("fast-spatial")}</>, <>Color: {c("default-effects")}</>] },
    ],
    source: (
      <>
        androidx {c("ButtonGroupSmallTokens")}, {c("ButtonGroupDefaults")}, {c("ConnectedButtonGroupSmallTokens")} and {c("SplitButton*Tokens")}. Only the Small
        connected group has tokens; L and XL scale its inner corners.
      </>
    ),
  },
} satisfies ComponentDoc
