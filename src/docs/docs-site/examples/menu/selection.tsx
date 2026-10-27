import { useState } from "react"
import type { Selection } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Menu, MenuItem, MenuPopover, MenuSection, MenuTrigger } from "@/components/ui/menu"

export default function MenuSelection() {
  const [sort, setSort] = useState<Selection>(new Set(["updated"]))
  const [columns, setColumns] = useState<Selection>(new Set(["status", "owner"]))
  return (
    <MenuTrigger>
      <Button variant="outlined" icon={<Icon name="tune" />}>View</Button>
      <MenuPopover>
        <Menu aria-label="View options" className="w-60">
          <MenuSection title="Sort by" selectionMode="single" selectedKeys={sort} onSelectionChange={setSort}>
            <MenuItem id="updated">Last updated</MenuItem>
            <MenuItem id="name">Name</MenuItem>
            <MenuItem id="size">Size</MenuItem>
          </MenuSection>
          <MenuSection title="Columns" selectionMode="multiple" selectedKeys={columns} onSelectionChange={setColumns}>
            <MenuItem id="status">Status</MenuItem>
            <MenuItem id="owner">Owner</MenuItem>
            <MenuItem id="region">Region</MenuItem>
          </MenuSection>
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  )
}
