import Badges from "@/docs/docs-site/examples/tabs/badges"
import badgesSrc from "@/docs/docs-site/examples/tabs/badges?raw"
import Demo from "@/docs/docs-site/examples/tabs/demo"
import demoSrc from "@/docs/docs-site/examples/tabs/demo?raw"
import Icons from "@/docs/docs-site/examples/tabs/icons"
import iconsSrc from "@/docs/docs-site/examples/tabs/icons?raw"
import Pill from "@/docs/docs-site/examples/tabs/pill"
import pillSrc from "@/docs/docs-site/examples/tabs/pill?raw"
import Scrollable from "@/docs/docs-site/examples/tabs/scrollable"
import scrollableSrc from "@/docs/docs-site/examples/tabs/scrollable?raw"
import Secondary from "@/docs/docs-site/examples/tabs/secondary"
import secondarySrc from "@/docs/docs-site/examples/tabs/secondary?raw"
import Vertical from "@/docs/docs-site/examples/tabs/vertical"
import verticalSrc from "@/docs/docs-site/examples/tabs/vertical?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Tabs organize related content at the same level of hierarchy. Primary and secondary tabs from M3, plus a segmented pill style. The indicator slides between tabs on the FastSpatial spring.",
  links: {
    m3: "https://m3.material.io/components/tabs/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/Tabs.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs"

<Tabs>
  <TabList aria-label="Travel">
    <Tab id="flights">Flights</Tab>
    <Tab id="trips">Trips</Tab>
  </TabList>
  <TabPanel id="flights">…</TabPanel>
  <TabPanel id="trips">…</TabPanel>
</Tabs>`,
  examples: [
    {
      id: "secondary",
      title: "Secondary tabs",
      description: "For tabs inside a content area. The active label turns on-surface and a 2dp indicator spans the whole tab.",
      component: Secondary,
      source: secondarySrc,
    },
    {
      id: "icons",
      title: "Icon placement",
      description: (
        <>
          Primary tabs stack the icon above the label (64dp). <InlineCode>inlineIcon</InlineCode> puts it beside the label; icon-only tabs need an{" "}
          <InlineCode>aria-label</InlineCode>. Icons fill when selected.
        </>
      ),
      component: Icons,
      source: iconsSrc,
    },
    {
      id: "badges",
      title: "Badges",
      description: (
        <>
          A count or <InlineCode>true</InlineCode> for a dot. With a stacked icon the badge anchors to the icon; otherwise it follows the label.
        </>
      ),
      component: Badges,
      source: badgesSrc,
    },
    {
      id: "scrollable",
      title: "Scrollable",
      description: (
        <>
          <InlineCode>scrollable</InlineCode> keeps tabs at their natural width and scrolls the row horizontally once they overflow.
        </>
      ),
      component: Scrollable,
      source: scrollableSrc,
    },
    {
      id: "pill",
      title: "Pill tabs, controlled",
      description: (
        <>
          <InlineCode>variant="pill"</InlineCode> is a segmented style from the kit, not an M3 spec component. For a toggle that isn't tied to panels,
          use a <TextLink to="/docs/button-group">connected button group</TextLink>.
        </>
      ),
      component: Pill,
      source: pillSrc,
    },
    {
      id: "vertical",
      title: "Vertical",
      description: (
        <>
          <InlineCode>orientation="vertical"</InlineCode> on Tabs stacks the list beside the panel; ↑ and ↓ move between tabs. Disabled tabs are skipped.
        </>
      ),
      component: Vertical,
      source: verticalSrc,
    },
  ],
  api: [
    {
      name: "Tabs",
      description: <>React Aria's {c("Tabs")}, laid out as a column (a row when vertical). Key props:</>,
      props: [
        { name: "selectedKey", type: "Key | null", default: "—", description: "Selected tab (controlled)." },
        { name: "defaultSelectedKey", type: "Key", default: "first tab", description: "Initially selected tab when uncontrolled." },
        { name: "onSelectionChange", type: "(key: Key) => void", default: "—", description: "Called when the selected tab changes." },
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Layout and arrow-key axis." },
        {
          name: "keyboardActivation",
          type: '"automatic" | "manual"',
          default: '"automatic"',
          description: "automatic selects as focus moves; manual waits for Space or Enter.",
        },
        { name: "disabledKeys", type: "Iterable<Key>", default: "—", description: "Tabs that can't be selected." },
      ],
    },
    {
      name: "TabList",
      description: (
        <>
          React Aria's {c("TabList")} plus the props below. Also exported: {c("tabListVariants")} and {c("tabVariants")}.
        </>
      ),
      props: [
        { name: "variant", type: '"primary" | "secondary" | "pill"', default: '"primary"', description: "Tab style for every tab in the list." },
        { name: "scrollable", type: "boolean", default: "false", description: "Natural-width tabs that scroll horizontally when they overflow." },
        { name: "aria-label", type: "string", default: "—", description: "Names the tab list. Required when there's no visible label." },
      ],
    },
    {
      name: "Tab",
      description: <>React Aria's {c("Tab")} plus:</>,
      props: [
        { name: "id", type: "Key", default: "—", description: "Matches the TabPanel with the same id." },
        { name: "icon", type: "string", default: "—", description: "Material Symbols name. Stacked above the label on primary tabs, inline otherwise." },
        { name: "inlineIcon", type: "boolean", default: "false", description: "Put the icon beside the label on primary tabs." },
        { name: "badge", type: "number | string | boolean", default: "—", description: "Count, short text, or true for a dot." },
        { name: "badgeLabel", type: "string", default: "—", description: "Accessible badge description." },
        { name: "isDisabled", type: "boolean", default: "false", description: "Disables the tab." },
        { name: "children", type: "ReactNode", default: "—", description: "Label. Omit for icon-only tabs and set aria-label." },
      ],
    },
    {
      name: "TabPanel",
      description: <>React Aria's {c("TabPanel")}; fills the remaining space and shows a focus ring for keyboard focus.</>,
      props: [
        { name: "id", type: "Key", default: "—", description: "Matches a Tab id." },
        { name: "shouldForceMount", type: "boolean", default: "false", description: "Keep the panel mounted while hidden." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        React Aria implements the ARIA tabs pattern: {c('role="tablist"')}, {c('"tab"')} and {c('"tabpanel"')}, with {c("aria-selected")} on the
        active tab and each panel labelled by its tab. Only the selected tab is in the tab order; arrow keys move between tabs.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves focus to the selected tab, then into the panel." },
      { keys: ["←", "→"], description: "Moves between tabs (↑ / ↓ when vertical). With automatic activation, focus also selects." },
      { keys: ["Home", "End"], description: "Jumps to the first or last tab." },
      { keys: ["Space", "Enter"], description: "Selects the focused tab when keyboardActivation is manual." },
    ],
    notes: ["Disabled tabs are skipped by the arrow keys.", "In right-to-left layouts ← and → swap."],
  },
  spec: {
    tables: [
      {
        columns: ["Variant", "Height", "Label", "Active color", "Indicator"],
        rows: [
          ["Primary", "48dp (64dp with a stacked icon)", c("title-small"), "primary", "3dp, 3dp top corners, content width"],
          ["Secondary", "48dp", c("title-small"), "on-surface", "2dp, full tab width"],
          ["Pill (kit)", "40dp", c("label-large"), "on-secondary-container", "secondary-container pill"],
        ],
      },
    ],
    cards: [
      { title: "Color", items: ["Inactive: on-surface-variant, on-surface when hovered", "Divider: 1dp outline-variant under the row", "Indicator: primary"] },
      {
        title: "Motion",
        items: [<>Indicator slides: {c("fast-spatial")} 0.6 / 800 (374ms)</>, <>Icon fill: {c("default-effects")}</>, "No slide with reduced motion"],
      },
    ],
    source: (
      <>
        androidx {c("PrimaryNavigationTabTokens")} and {c("SecondaryNavigationTabTokens")}. The indicator is React Aria's {c("SelectionIndicator")}.
      </>
    ),
  },
} satisfies ComponentDoc
