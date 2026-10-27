import { useState } from "react"

import { MenuItem } from "@/components/ui/menu"
import { Menubar, MenubarMenu } from "@/components/ui/menubar"

export default function MenubarSelection() {
  const [panels, setPanels] = useState<"all" | Set<string | number>>(new Set(["sidebar"]))
  const [zoom, setZoom] = useState<"all" | Set<string | number>>(new Set(["100%"]))
  const shown = panels === "all" ? "all panels" : [...panels].join(", ") || "no panels"
  const level = zoom === "all" ? "" : [...zoom].join("")

  return (
    <div className="h-64 w-full max-w-2xl rounded-xl border border-outline-variant bg-surface">
      <Menubar aria-label="Viewer" className="h-12 border-b border-outline-variant px-2">
        <MenubarMenu label="View" aria-label="Panels" selectionMode="multiple" selectedKeys={panels} onSelectionChange={setPanels}>
          <MenuItem id="sidebar">Sidebar</MenuItem>
          <MenuItem id="minimap">Minimap</MenuItem>
          <MenuItem id="status bar">Status bar</MenuItem>
        </MenubarMenu>
        <MenubarMenu label="Zoom" aria-label="Zoom" selectionMode="single" selectedKeys={zoom} onSelectionChange={setZoom} disallowEmptySelection>
          <MenuItem id="75%">75%</MenuItem>
          <MenuItem id="100%">100%</MenuItem>
          <MenuItem id="150%">150%</MenuItem>
        </MenubarMenu>
      </Menubar>
      <p className="p-4 text-body-md text-on-surface-variant">
        Showing {shown} at {level}.
      </p>
    </div>
  )
}
