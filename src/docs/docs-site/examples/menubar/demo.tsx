import { MenuItem, MenuSection } from "@/components/ui/menu"
import { Menubar, MenubarMenu } from "@/components/ui/menubar"
import { snackbar } from "@/components/ui/snackbar"

export default function MenubarDemo() {
  const run = (key: string | number) => snackbar(String(key))

  return (
    <div className="h-72 w-full max-w-2xl rounded-xl border border-outline-variant bg-surface">
      <Menubar aria-label="Editor" className="h-12 border-b border-outline-variant px-2">
        <MenubarMenu label="File" aria-label="File" onAction={run}>
          <MenuItem id="New file" shortcut="⌘N">New file</MenuItem>
          <MenuItem id="Open…" shortcut="⌘O">Open…</MenuItem>
          <MenuItem id="Save" shortcut="⌘S">Save</MenuItem>
        </MenubarMenu>
        <MenubarMenu label="Edit" aria-label="Edit" onAction={run} className="w-60">
          <MenuSection>
            <MenuItem id="Undo" shortcut="⌘Z">Undo</MenuItem>
            <MenuItem id="Redo" shortcut="⇧⌘Z">Redo</MenuItem>
          </MenuSection>
          <MenuSection>
            <MenuItem id="Cut" shortcut="⌘X">Cut</MenuItem>
            <MenuItem id="Copy" shortcut="⌘C">Copy</MenuItem>
            <MenuItem id="Paste" shortcut="⌘V">Paste</MenuItem>
          </MenuSection>
        </MenubarMenu>
        <MenubarMenu label="Help" aria-label="Help" onAction={run}>
          <MenuItem id="Documentation" icon="menu_book">Documentation</MenuItem>
          <MenuItem id="About" icon="info">About</MenuItem>
        </MenubarMenu>
      </Menubar>
      <p className="p-4 text-body-md text-on-surface-variant">Open a menu, then use ← and → to move between menus.</p>
    </div>
  )
}
