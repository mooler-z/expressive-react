import * as React from "react"
import type { Selection } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { ContextMenu, ContextMenuArea, ContextMenuContent } from "@/components/ui/context-menu"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Menu, MenuItem, MenuPopover, MenuSection, SubmenuTrigger } from "@/components/ui/menu"
import { Menubar, MenubarMenu } from "@/components/ui/menubar"
import { snackbar } from "@/components/ui/snackbar"
import { Section, Variant, Variants } from "@/docs/section"

export default function ContextMenuSection() {
  const act = (k: React.Key) => snackbar(`${k} · demo action`)
  return (
    <Section
      id="context-menu"
      description="Right-click menus reuse the menu at the pointer (long-press on touch, Shift+F10 from the keyboard). Menubars are desktop-style text triggers with one open menu at a time; ←/→ walk between them."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <ContextMenu>
          <ContextMenuArea className="grid h-72 place-items-center rounded-lg border-2 border-dashed border-outline-variant text-body-md text-on-surface-variant">
            <span className="flex items-center gap-2">
              <Icon>ads_click</Icon>
              Right-click (or long-press) here
            </span>
          </ContextMenuArea>
          <ContextMenuContent aria-label="File actions" onAction={act} className="w-56">
            <MenuSection>
              <MenuItem id="Open" icon="open_in_new">Open</MenuItem>
              <MenuItem id="Rename" icon="drive_file_rename_outline" shortcut="F2">Rename</MenuItem>
              <MenuItem id="Duplicate" icon="content_copy" shortcut="⌘D">Duplicate</MenuItem>
            </MenuSection>
            <MenuSection>
              <MenuItem id="Delete" icon="delete" className="text-error [&_[data-slot=icon]]:text-error">Delete</MenuItem>
            </MenuSection>
          </ContextMenuContent>
        </ContextMenu>

        <div className="h-72 rounded-lg bg-surface">
          <Menubar aria-label="Editor" className="h-12 border-b border-outline-variant px-2">
            <MenubarMenu label="File" aria-label="File" onAction={act}>
              <MenuItem id="New" shortcut="⌘N">New</MenuItem>
              <MenuItem id="Open…" shortcut="⌘O">Open…</MenuItem>
              <MenuItem id="Save" shortcut="⌘S">Save</MenuItem>
            </MenubarMenu>
            <MenubarMenu label="Edit" aria-label="Edit" onAction={act} className="w-60">
              <MenuSection>
                <MenuItem id="Undo" shortcut="⌘Z">Undo</MenuItem>
                <MenuItem id="Redo" shortcut="⇧⌘Z">Redo</MenuItem>
              </MenuSection>
              <MenuSection>
                <MenuItem id="Find" shortcut="⌘F">Find</MenuItem>
                <MenuItem id="Replace" shortcut="⌥⌘F">Replace</MenuItem>
                <SubmenuTrigger>
                  <MenuItem id="prefs">Preferences</MenuItem>
                  <MenuPopover>
                    <Menu aria-label="Preferences" onAction={act}>
                      <MenuItem id="Settings" icon="settings">Settings</MenuItem>
                      <MenuItem id="Keyboard shortcuts" icon="keyboard">Keyboard shortcuts</MenuItem>
                    </Menu>
                  </MenuPopover>
                </SubmenuTrigger>
              </MenuSection>
            </MenubarMenu>
            <MenubarMenu label="View" aria-label="View" selectionMode="multiple" defaultSelectedKeys={["ruler"]}>
              <MenuItem id="ruler">Ruler</MenuItem>
              <MenuItem id="grid">Grid</MenuItem>
              <MenuItem id="minimap">Minimap</MenuItem>
            </MenubarMenu>
            <MenubarMenu label="Help" aria-label="Help" onAction={act}>
              <MenuItem id="Docs" icon="menu_book">Documentation</MenuItem>
              <MenuItem id="About" icon="info">About</MenuItem>
            </MenubarMenu>
          </Menubar>
          <p className="p-4 text-body-md text-on-surface-variant">Open a menu, then use ←/→ to move between them.</p>
        </div>
      </div>

      <Variants cols="md:grid-cols-2">
        <Variant n={1} label="Submenu & check items" className="rounded-lg bg-surface p-4">
          <SortContextMenu />
        </Variant>

        <Variant n={2} label="Disabled & destructive" className="rounded-lg bg-surface p-4">
          <Menu aria-label="Edit (nothing selected)" className="drop-elevation-2 mx-auto w-60">
            <MenuSection title="Nothing selected">
              <MenuItem icon="content_cut" shortcut="⌘X" isDisabled>Cut</MenuItem>
              <MenuItem icon="content_copy" shortcut="⌘C" isDisabled>Copy</MenuItem>
              <MenuItem icon="content_paste" shortcut="⌘V">Paste</MenuItem>
            </MenuSection>
            <MenuSection>
              <MenuItem icon="drive_file_move">Move to…</MenuItem>
              <MenuItem icon="delete" shortcut="⌫" className="text-error [&_[data-slot=icon]]:text-error [&_kbd]:text-error">Delete</MenuItem>
            </MenuSection>
          </Menu>
        </Variant>

        <Variant n={3} label="Selection toolbar" className="rounded-lg bg-surface p-4">
          <div className="space-y-2">
            <div className="drop-elevation-2 inline-flex items-center gap-0.5 rounded-full bg-surface-container-low p-1">
              {(["format_bold", "format_italic", "code", "link"] as const).map((i) => (
                <IconButton key={i} size="sm" aria-label={i.replace("format_", "")}>
                  <Icon>{i}</Icon>
                </IconButton>
              ))}
              <span className="mx-1 h-6 w-px bg-outline-variant" />
              <Button variant="text" size="sm" className="pl-3">
                <Icon>add_comment</Icon>
                Comment
              </Button>
            </div>
            <p className="text-body-md text-on-surface-variant">
              The canary held for 30 minutes and{" "}
              <mark className="rounded-xs bg-primary/20 text-on-surface">p95 stayed under 200 ms across all three regions</mark>, so we promoted
              to 100%.
            </p>
          </div>
        </Variant>

        <Variant n={4} label="Mobile · long-press sheet" className="overflow-hidden rounded-lg bg-surface">
          <div className="w-full">
            <div className="px-4 pt-3 text-title-sm">#platform-oncall</div>
            {[
              ["ML", "Maya", "Canary looks healthy"],
              ["JP", "Jonah", "Promoting to 100%"],
              ["AR", "Ava", "Watching dashboards"],
            ].map(([i, who, msg], n) => (
              <div key={who} className={`flex items-center gap-3 px-4 py-2 ${n === 1 ? "bg-on-surface/8" : ""}`}>
                <span className="grid size-8 place-items-center rounded-full bg-secondary-container text-label-md text-on-secondary-container">{i}</span>
                <span className="text-body-md">
                  <span className="block text-label-lg">{who}</span>
                  {msg}
                </span>
              </div>
            ))}
            <div className="mt-2 rounded-t-xl bg-surface-container-low px-2 pt-2 pb-3">
              <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-on-surface-variant/40" />
              <Menu aria-label="Message actions" className="bg-transparent p-0">
                <MenuItem icon="reply">Reply</MenuItem>
                <MenuItem icon="content_copy">Copy text</MenuItem>
                <MenuItem icon="push_pin">Pin</MenuItem>
                <MenuItem icon="delete" className="text-error [&_[data-slot=icon]]:text-error">Delete</MenuItem>
              </Menu>
            </div>
          </div>
        </Variant>
      </Variants>
    </Section>
  )
}

function SortContextMenu() {
  const [sort, setSort] = React.useState<Selection>(new Set(["name"]))
  const [hidden, setHidden] = React.useState<Selection>(new Set())
  return (
    <ContextMenu>
      <ContextMenuArea className="grid h-40 place-items-center rounded-md bg-surface-container text-body-md text-on-surface-variant">
        Right-click for Sort by ▸
      </ContextMenuArea>
      <ContextMenuContent aria-label="Folder" className="w-48">
        <MenuSection>
          <MenuItem icon="open_in_new">Open</MenuItem>
          <MenuItem icon="drive_file_rename_outline">Rename</MenuItem>
          <SubmenuTrigger>
            <MenuItem icon="sort">Sort by</MenuItem>
            <MenuPopover>
              <Menu aria-label="Sort by" selectionMode="single" selectedKeys={sort} onSelectionChange={setSort} disallowEmptySelection>
                <MenuItem id="name">Name</MenuItem>
                <MenuItem id="modified">Modified</MenuItem>
                <MenuItem id="size">Size</MenuItem>
              </Menu>
            </MenuPopover>
          </SubmenuTrigger>
        </MenuSection>
        <MenuSection selectionMode="multiple" selectedKeys={hidden} onSelectionChange={setHidden}>
          <MenuItem id="hidden" icon="visibility">Show hidden</MenuItem>
        </MenuSection>
      </ContextMenuContent>
    </ContextMenu>
  )
}
