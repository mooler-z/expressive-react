import Demo from "@/docs/docs-site/examples/context-menu/demo"
import demoSrc from "@/docs/docs-site/examples/context-menu/demo?raw"
import DisabledDestructive from "@/docs/docs-site/examples/context-menu/disabled-destructive"
import disabledDestructiveSrc from "@/docs/docs-site/examples/context-menu/disabled-destructive?raw"
import LongPress from "@/docs/docs-site/examples/context-menu/long-press"
import longPressSrc from "@/docs/docs-site/examples/context-menu/long-press?raw"
import SubmenuSelection from "@/docs/docs-site/examples/context-menu/submenu-selection"
import submenuSelectionSrc from "@/docs/docs-site/examples/context-menu/submenu-selection?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description: (
    <>
      A context menu is the Expressive <TextLink to="/docs/menu">Menu</TextLink>, opened at the pointer. Right-click on desktop, long-press on touch, or
      Shift+F10 from the keyboard. Items, sections and submenus work exactly as they do in a menu.
    </>
  ),
  links: {
    m3: "https://m3.material.io/components/menus/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/Menu.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { ContextMenu, ContextMenuArea, ContextMenuContent } from "@/components/ui/context-menu"
import { MenuItem } from "@/components/ui/menu"

<ContextMenu>
  <ContextMenuArea className="h-72">Right-click here</ContextMenuArea>
  <ContextMenuContent aria-label="File actions" onAction={run}>
    <MenuItem id="open" icon="open_in_new">Open</MenuItem>
    <MenuItem id="rename" icon="drive_file_rename_outline" shortcut="F2">Rename</MenuItem>
  </ContextMenuContent>
</ContextMenu>`,
  examples: [
    {
      id: "submenu-selection",
      title: "Submenu and selection",
      description: (
        <>
          Nest a <InlineCode>SubmenuTrigger</InlineCode> as in any menu. A submenu with <InlineCode>selectionMode="single"</InlineCode> works as a "Sort by"
          picker.
        </>
      ),
      component: SubmenuSelection,
      source: submenuSelectionSrc,
    },
    {
      id: "disabled-destructive",
      title: "Disabled and destructive items",
      description: (
        <>
          <InlineCode>disabledKeys</InlineCode> on the content greys out unavailable actions. Color a destructive item with{" "}
          <InlineCode>text-error</InlineCode> and give it its own section.
        </>
      ),
      component: DisabledDestructive,
      source: disabledDestructiveSrc,
    },
    {
      id: "long-press",
      title: "Long-press and open state",
      description: (
        <>
          <InlineCode>longPressDelay</InlineCode> tunes the touch and pen hold (default 500ms); moving more than 8px cancels it.{" "}
          <InlineCode>onOpenChange</InlineCode> reports the open state.
        </>
      ),
      component: LongPress,
      source: longPressSrc,
    },
  ],
  api: [
    {
      name: "ContextMenu",
      description: "Holds the open state and the pointer position. Wraps one area and its content.",
      props: [
        { name: "onOpenChange", type: "(isOpen: boolean) => void", default: "—", description: "Called when the menu opens or closes." },
        { name: "children", type: "ReactNode", default: "—", description: "A ContextMenuArea and a ContextMenuContent." },
      ],
    },
    {
      name: "ContextMenuArea",
      description: <>A focusable {c("<div>")}: HTML attributes, plus:</>,
      props: [
        { name: "longPressDelay", type: "number", default: "500", description: "Touch and pen hold duration in ms." },
        { name: "onContextMenu", type: "(e: MouseEvent) => void", default: "—", description: "Runs first; call e.preventDefault() to keep the native menu." },
      ],
    },
    {
      name: "ContextMenuContent",
      description: (
        <>
          Everything <TextLink to="/docs/menu">Menu</TextLink> accepts (variant, onAction, selectionMode, disabledKeys…), plus:
        </>
      ),
      props: [
        { name: "popoverClassName", type: "string", default: "—", description: "Classes for the popover." },
        { name: "autoFocus", type: '"first" | "last" | boolean', default: '"first"', description: "Item focused when the menu opens." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        The area is focusable ({c("tabIndex=0")}) so keyboard users can reach it. The menu opens at the pointer (or 16px into the area from the keyboard),
        flips to stay on screen, and returns focus to the area when it closes. For a persistent row of menus, see{" "}
        <TextLink to="/docs/menubar">Menubar</TextLink>.
      </>
    ),
    keyboard: [
      { keys: ["Shift", "F10"], description: "Opens the menu for the focused area. The ContextMenu key does the same." },
      { keys: ["↑", "↓"], description: "Moves between items." },
      { keys: ["→", "←"], description: "Opens or closes a submenu." },
      { keys: ["Enter", "Space"], description: "Activates the focused item." },
      { keys: ["Esc"], description: "Closes the menu." },
    ],
    notes: ["Touch and pen: hold for longPressDelay ms without moving more than 8px.", "Mouse: right-click replaces the browser menu."],
  },
  spec: {
    description: <>Context menus share the Menu spec; only the anchor differs.</>,
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Anchor", "a zero-size point at the pointer · placement bottom start · no offset"],
          ["Container", "surface-container-low · level 2 · 16dp corners · sections as segments"],
          ["Item", <>44dp · {c("body-large")} · 20dp icons</>],
        ],
      },
    ],
    source: <>androidx {c("MenuDefaults")} and the Expressive menu tokens; see <TextLink to="/docs/menu">Menu</TextLink>.</>,
  },
} satisfies ComponentDoc
