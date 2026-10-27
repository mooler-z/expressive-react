import Demo from "@/docs/docs-site/examples/menubar/demo"
import demoSrc from "@/docs/docs-site/examples/menubar/demo?raw"
import Selection from "@/docs/docs-site/examples/menubar/selection"
import selectionSrc from "@/docs/docs-site/examples/menubar/selection?raw"
import Submenus from "@/docs/docs-site/examples/menubar/submenus"
import submenusSrc from "@/docs/docs-site/examples/menubar/submenus?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "A desktop-style row of text menus (File, Edit, View) with one menu open at a time. Items, sections, shortcuts and submenus come from Menu, so everything there works here.",
  links: { aria: "https://react-spectrum.adobe.com/react-aria/Menu.html" },
  preview: { component: Demo, source: demoSrc, className: "items-start" },
  usage: `import { MenuItem } from "@/components/ui/menu"
import { Menubar, MenubarMenu } from "@/components/ui/menubar"

<Menubar aria-label="Editor">
  <MenubarMenu label="File" onAction={run}>
    <MenuItem id="new" shortcut="⌘N">New</MenuItem>
  </MenubarMenu>
</Menubar>`,
  examples: [
    {
      id: "submenus",
      title: "Submenus",
      description: (
        <>
          Nest a <InlineCode>SubmenuTrigger</InlineCode> as in any <TextLink to="/docs/menu">Menu</TextLink>. → opens the submenu; ← in the submenu
          returns to its parent instead of switching menus.
        </>
      ),
      component: Submenus,
      source: submenusSrc,
      className: "items-start",
    },
    {
      id: "selection",
      title: "Checkable items",
      description: (
        <>
          Menu selection props pass through: <InlineCode>selectionMode="multiple"</InlineCode> for toggles,{" "}
          <InlineCode>"single"</InlineCode> for a radio-style choice. Selected items show a check.
        </>
      ),
      component: Selection,
      source: selectionSrc,
      className: "items-start",
    },
  ],
  api: [
    {
      name: "Menubar",
      description: <>React Aria's {c("Toolbar")}: a row of menu triggers. Takes Toolbar props.</>,
      props: [
        { name: "aria-label", type: "string", default: "—", description: "Name of the menubar." },
        { name: "children", type: "ReactNode", default: "—", description: "MenubarMenus." },
        { name: "className", type: "string", default: "—", description: "Classes for the row." },
      ],
    },
    {
      name: "MenubarMenu",
      description: (
        <>
          A text trigger plus its menu. Every other prop goes to the inner <TextLink to="/docs/menu">Menu</TextLink> ({c("onAction")},{" "}
          {c("selectionMode")}, {c("selectedKeys")}, {c("onSelectionChange")}, {c("className")} for the menu width…).
        </>
      ),
      props: [
        { name: "label", type: "ReactNode", default: "—", description: "Trigger text. Required." },
        { name: "children", type: "ReactNode | (item) => ReactNode", default: "—", description: "MenuItems, MenuSections and SubmenuTriggers. Required." },
        { name: "triggerClassName", type: "string", default: "—", description: "Classes for the trigger button." },
        { name: "aria-label", type: "string", default: "—", description: "Name of the menu. Use the same text as the label." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        The row is a React Aria toolbar of menu buttons ({c("aria-haspopup")}, {c("aria-expanded")}); each menu is a React Aria Menu with{" "}
        {c('role="menu"')} and menu items. Menus are non-modal so hovering another trigger can switch to it; an outside press closes them.
      </>
    ),
    keyboard: [
      { keys: ["←", "→"], description: "On the triggers: move between menus. In an open menu: open the previous or next menu." },
      { keys: ["Space", "Enter", "↓"], description: "Open the focused menu with focus on its first item." },
      { keys: ["↑", "↓"], description: "Move between items in an open menu." },
      { keys: ["Enter"], description: "Run the focused item (or toggle it in a selection menu)." },
      { keys: ["Esc"], description: "Close the menu and return focus to its trigger." },
    ],
    notes: [
      <>
        It's built on {c('role="toolbar"')}, not the ARIA {c("menubar")} role, so assistive tech announces a toolbar of menu buttons.
      </>,
      "Shortcuts shown in items are labels only; bind the keys yourself.",
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Trigger", <>32dp, full radius, 12dp padding, {c("label-large")}</>],
          ["Open trigger", "secondary-container, on-secondary-container"],
          ["Menu", "M3 Expressive menu: 16dp corners, segmented sections, 44dp items"],
        ],
      },
    ],
    cards: [{ title: "States", items: ["Trigger hover 8%, focus 10% + 3dp ring, pressed 12%", "Menus open below-start of their trigger"] }],
    source: (
      <>
        No M3 spec component. Menus follow androidx menu tokens; see <TextLink to="/docs/menu">Menu</TextLink>.
      </>
    ),
  },
} satisfies ComponentDoc
