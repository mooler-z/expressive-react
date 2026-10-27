import Basic from "@/docs/docs-site/examples/menu/basic"
import basicSrc from "@/docs/docs-site/examples/menu/basic?raw"
import Demo from "@/docs/docs-site/examples/menu/demo"
import demoSrc from "@/docs/docs-site/examples/menu/demo?raw"
import RichItems from "@/docs/docs-site/examples/menu/rich-items"
import richItemsSrc from "@/docs/docs-site/examples/menu/rich-items?raw"
import Sections from "@/docs/docs-site/examples/menu/sections"
import sectionsSrc from "@/docs/docs-site/examples/menu/sections?raw"
import Selection from "@/docs/docs-site/examples/menu/selection"
import selectionSrc from "@/docs/docs-site/examples/menu/selection?raw"
import Submenu from "@/docs/docs-site/examples/menu/submenu"
import submenuSrc from "@/docs/docs-site/examples/menu/submenu?raw"
import Vibrant from "@/docs/docs-site/examples/menu/vibrant"
import vibrantSrc from "@/docs/docs-site/examples/menu/vibrant?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Menus show a list of choices on a temporary surface. M3 Expressive menus: 16dp corners, 44dp items, sections as separate segments, submenus, selection, and a vibrant color scheme.",
  links: {
    m3: "https://m3.material.io/components/menus/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/Menu.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Button } from "@/components/ui/button"
import { Menu, MenuItem, MenuPopover, MenuTrigger } from "@/components/ui/menu"

<MenuTrigger>
  <Button variant="tonal">Edit</Button>
  <MenuPopover>
    <Menu aria-label="Edit" onAction={(key) => run(key)}>
      <MenuItem id="cut" icon="content_cut" shortcut="⌘X">Cut</MenuItem>
      <MenuItem id="copy" icon="content_copy" shortcut="⌘C">Copy</MenuItem>
    </Menu>
  </MenuPopover>
</MenuTrigger>`,
  examples: [
    {
      id: "basic",
      title: "Overflow menu",
      description: "Any pressable element can open a menu. placement positions the popover; it flips when there isn't room.",
      component: Basic,
      source: basicSrc,
    },
    {
      id: "sections",
      title: "Sections",
      description: (
        <>
          Each <InlineCode>MenuSection</InlineCode> becomes its own segment: 16dp outer corners, 8dp inner, a 2dp gap between. Items take a second
          line with <InlineCode>description</InlineCode>.
        </>
      ),
      component: Sections,
      source: sectionsSrc,
    },
    {
      id: "submenu",
      title: "Submenu",
      description: (
        <>
          Wrap an item and a nested <InlineCode>MenuPopover</InlineCode> in <InlineCode>SubmenuTrigger</InlineCode>. The item gets a trailing arrow and opens
          on hover, → or Enter.
        </>
      ),
      component: Submenu,
      source: submenuSrc,
    },
    {
      id: "selection",
      title: "Selection",
      description: (
        <>
          <InlineCode>selectionMode</InlineCode> on a Menu or on each section. Selected items fill with tertiary-container and show a trailing check.
        </>
      ),
      component: Selection,
      source: selectionSrc,
    },
    {
      id: "rich-items",
      title: "Leading and trailing content",
      description: (
        <>
          <InlineCode>leading</InlineCode> takes any node (an avatar, a swatch) and wins over <InlineCode>icon</InlineCode>;{" "}
          <InlineCode>trailing</InlineCode> holds counts or badges. Set <InlineCode>textValue</InlineCode> when children aren't a plain string.
        </>
      ),
      component: RichItems,
      source: richItemsSrc,
    },
    {
      id: "vibrant",
      title: "Vibrant",
      description: <>variant="vibrant" uses tertiary-container for the container, for menus that open from an emphasized action.</>,
      component: Vibrant,
      source: vibrantSrc,
    },
  ],
  api: [
    {
      name: "MenuTrigger",
      description: <>React Aria's {c("MenuTrigger")}, re-exported. Its first child is the trigger; the second is the MenuPopover.</>,
      props: [
        { name: "isOpen · defaultOpen", type: "boolean", default: "—", description: "Open state, controlled or initial." },
        { name: "onOpenChange", type: "(isOpen: boolean) => void", default: "—", description: "Called when the menu opens or closes." },
        { name: "trigger", type: '"press" | "longPress"', default: '"press"', description: "How the trigger opens the menu." },
      ],
    },
    {
      name: "MenuPopover",
      description: <>React Aria {c("Popover")} props. Transparent itself: the menu, or each of its sections, is the card.</>,
      props: [
        { name: "placement", type: "Placement", default: "—", description: "Preferred side, e.g. \"bottom end\". Flips to stay on screen." },
        { name: "offset", type: "number", default: "4", description: "Gap to the trigger in px." },
        { name: "className", type: "string", default: "—", description: "Classes for the popover." },
      ],
    },
    {
      name: "Menu",
      description: <>Everything React Aria's {c("Menu")} accepts, plus:</>,
      props: [
        { name: "variant", type: '"standard" | "vibrant"', default: '"standard"', description: "surface-container-low or tertiary-container." },
        { name: "onAction", type: "(key: Key) => void", default: "—", description: "Called with the pressed item's id." },
        { name: "selectionMode", type: '"none" | "single" | "multiple"', default: '"none"', description: "Turns items into a selectable list." },
        { name: "selectedKeys · onSelectionChange", type: "Selection", default: "—", description: "Controlled selection." },
        { name: "items", type: "Iterable<T>", default: "—", description: "Dynamic collection; children is then a render function." },
      ],
    },
    {
      name: "MenuItem",
      description: <>Everything React Aria's {c("MenuItem")} accepts, plus:</>,
      props: [
        { name: "icon", type: "string", default: "—", description: "Leading Material Symbol name (20dp)." },
        { name: "leading", type: "ReactNode", default: "—", description: "Leading slot for anything else. Wins over icon." },
        { name: "description", type: "ReactNode", default: "—", description: "Second line of supporting text." },
        { name: "shortcut", type: "string", default: "—", description: 'Keyboard shortcut shown at the end, e.g. "⌘X". Display only.' },
        { name: "trailing", type: "ReactNode", default: "—", description: "Trailing slot (badge, count)." },
        { name: "id", type: "Key", default: "—", description: "Passed to onAction and used for selection." },
        { name: "textValue", type: "string", default: "children", description: "Text for typeahead; needed when children aren't a string." },
        { name: "href", type: "string", default: "—", description: "Makes the item a link." },
        { name: "isDisabled", type: "boolean", default: "false", description: "On-surface 38%, skipped by arrow keys." },
      ],
    },
    {
      name: "MenuSection",
      description: <>Everything React Aria's {c("MenuSection")} accepts (including its own selectionMode), plus:</>,
      props: [{ name: "title", type: "ReactNode", default: "—", description: "Optional group label." }],
    },
    {
      name: "SubmenuTrigger · MenuHeader · MenuSeparator",
      description: "React Aria's SubmenuTrigger (re-exported), a styled Header for custom group labels, and a styled 1dp outline-variant Separator.",
      props: [],
    },
  ],
  accessibility: {
    description: (
      <>
        A {c('role="menu"')} with {c("menuitem")}, {c("menuitemradio")} or {c("menuitemcheckbox")} items, and the trigger wired with{" "}
        {c("aria-haspopup")} and {c("aria-expanded")}. Focus moves into the menu on open and back to the trigger on close. For a menu at the pointer, see{" "}
        <TextLink to="/docs/context-menu">Context menu</TextLink>; for a form field, <TextLink to="/docs/select">Select</TextLink>.
      </>
    ),
    keyboard: [
      { keys: ["Enter", "Space", "↓"], description: "On the trigger: opens the menu and focuses the first item." },
      { keys: ["↑"], description: "On the trigger: opens the menu and focuses the last item." },
      { keys: ["↑", "↓"], description: "Moves between items, skipping disabled ones." },
      { keys: ["Enter", "Space"], description: "Activates or selects the focused item." },
      { keys: ["→", "←"], description: "Opens or closes a submenu (mirrored in right-to-left layouts)." },
      { keys: ["Esc"], description: "Closes the menu and returns focus to the trigger." },
      { label: "Typeahead", description: "Typing jumps to the first item whose text starts with those letters." },
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Container", "surface-container-low (vibrant: tertiary-container) · level 2 · 16dp corners"],
          ["Segments", "one per MenuSection · 16dp outer / 8dp inner corners · 2dp gap · 4dp padding"],
          ["Item", <>44dp · 12dp side padding · 4dp corners (12dp at a segment's ends) · {c("body-large")}</>],
          ["Icons", "20dp leading and trailing"],
          ["Shortcut", c("label-small")],
          ["Selected", "tertiary-container / on-tertiary-container, 12dp corners (vibrant: tertiary / on-tertiary)"],
          ["Disabled", "on-surface 38%"],
        ],
      },
    ],
    cards: [
      { title: "Motion", items: [<>Opens from the anchor on {c("fast-spatial")} (374ms)</>, <>Closes with a fade on {c("fast-effects")} (154ms)</>] },
      { title: "States", items: ["Hover 8%", "Focus 10%", "Pressed 12%"] },
    ],
    source: <>androidx {c("MenuDefaults")}, {c("SegmentedMenuTokens")}, {c("StandardMenuTokens")} and {c("VibrantMenuTokens")}.</>,
  },
} satisfies ComponentDoc
