import * as React from "react"
import type { PanelImperativeHandle } from "react-resizable-panels"

import { Button } from "@/components/ui/button"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export default function ResizableCollapsible() {
  const sidebar = React.useRef<PanelImperativeHandle | null>(null)
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <div className="h-64 overflow-hidden rounded-lg border border-outline-variant">
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel
            panelRef={sidebar}
            defaultSize="30%"
            minSize="20%"
            collapsible
            collapsedSize="56px"
            onResize={() => setCollapsed(sidebar.current?.isCollapsed() ?? false)}
          >
            <div className="h-full bg-surface-container-low p-3 text-label-lg">{collapsed ? "☰" : "Projects"}</div>
          </ResizablePanel>
          <ResizableHandle variant="line" />
          <ResizablePanel>
            <div className="grid h-full place-items-center text-body-md text-on-surface-variant">Drag the edge past 20% to collapse.</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <Button variant="tonal" className="self-start" onPress={() => (collapsed ? sidebar.current?.expand() : sidebar.current?.collapse())}>
        {collapsed ? "Expand sidebar" : "Collapse sidebar"}
      </Button>
    </div>
  )
}
