import { useState } from "react"
import type { Selection } from "react-aria-components"

import { ContextMenu, ContextMenuArea, ContextMenuContent } from "@/components/ui/context-menu"
import { Menu, MenuItem, MenuPopover, MenuSection, SubmenuTrigger } from "@/components/ui/menu"
import { snackbar } from "@/components/ui/snackbar"

export default function ContextMenuSubmenuSelection() {
  const [sort, setSort] = useState<Selection>(new Set(["name"]))
  return (
    <ContextMenu>
      <ContextMenuArea className="grid h-40 w-full max-w-md place-items-center rounded-lg bg-surface-container-low text-body-md text-on-surface-variant">
        Folder · sorted by {[...sort][0]}
      </ContextMenuArea>
      <ContextMenuContent aria-label="Folder" className="w-56">
        <MenuSection>
          <MenuItem icon="create_new_folder" onAction={() => snackbar("New folder")}>New folder</MenuItem>
          <SubmenuTrigger>
            <MenuItem icon="sort">Sort by</MenuItem>
            <MenuPopover>
              <Menu aria-label="Sort by" selectionMode="single" selectedKeys={sort} onSelectionChange={setSort}>
                <MenuItem id="name">Name</MenuItem>
                <MenuItem id="date">Date modified</MenuItem>
                <MenuItem id="size">Size</MenuItem>
              </Menu>
            </MenuPopover>
          </SubmenuTrigger>
        </MenuSection>
      </ContextMenuContent>
    </ContextMenu>
  )
}
