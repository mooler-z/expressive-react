import { useState } from "react"

import { Icon } from "@/components/ui/icon"
import { ToggleIconButton } from "@/components/ui/icon-button"
import { SheetContent, SheetHeader, SheetTitle, StandardSideSheet } from "@/components/ui/sheet"

export default function StandardSideSheetExample() {
  const [open, setOpen] = useState(true)

  return (
    <div className="flex h-72 w-full max-w-2xl overflow-hidden rounded-lg border border-outline-variant">
      <main className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <span className="text-title-md">Incident #482</span>
          <ToggleIconButton aria-label="Details panel" isSelected={open} onChange={setOpen}>
            <Icon name="dock_to_left" />
          </ToggleIconButton>
        </div>
        <p className="text-body-md text-on-surface-variant">The standard sheet is part of the layout: it pushes this pane instead of covering it.</p>
      </main>
      <StandardSideSheet isOpen={open} width={260}>
        <SheetHeader closeButton onClose={() => setOpen(false)} className="pl-4">
          <SheetTitle>Details</SheetTitle>
        </SheetHeader>
        <SheetContent className="space-y-2 px-4 text-body-md text-on-surface-variant">
          <p>Severity: SEV-2</p>
          <p>Owner: Platform</p>
          <p>Opened: 09:41</p>
        </SheetContent>
      </StandardSideSheet>
    </div>
  )
}
