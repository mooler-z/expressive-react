"use client"

import * as React from "react"

import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import type { WindowSizeClass } from "@/hooks/use-window-size-class"
import { cn } from "@/lib/utils"

import { isSinglePane, useLayoutWindowSize } from "./window-size"

/*
 * List-detail · M3 canonical layout.
 *   compact           one full-bleed pane: the list, or the detail after a pick (back returns)
 *   medium            one pane with 24dp margins
 *   expanded / large  list in a 360dp fixed pane beside a flexible detail pane, 24dp spacer
 *   extra-large       adds a 320dp supporting pane
 * The list stays in place while the detail changes.
 */

type ListDetailContextValue = { singlePane: boolean; showingDetail: boolean; open: () => void; back: () => void }
const ListDetailContext = React.createContext<ListDetailContextValue>({ singlePane: false, showingDetail: true, open: () => {}, back: () => {} })

/** `singlePane`, plus `open()` / `back()` for the single-pane sizes. */
const useListDetail = () => React.useContext(ListDetailContext)

export interface ListDetailLayoutProps {
  list: React.ReactNode
  detail: React.ReactNode
  /** Third pane, shown on extra-large windows only. */
  supporting?: React.ReactNode
  /** Single-pane sizes: show the detail instead of the list (controlled). */
  detailOpen?: boolean
  defaultDetailOpen?: boolean
  onDetailOpenChange?: (open: boolean) => void
  /** List pane width in px when side by side. */
  listWidth?: number
  supportingWidth?: number
  windowSize?: WindowSizeClass
  className?: string
}

function ListDetailLayout({
  list,
  detail,
  supporting,
  detailOpen: detailOpenProp,
  defaultDetailOpen = false,
  onDetailOpenChange,
  listWidth = 360,
  supportingWidth = 320,
  windowSize,
  className,
}: ListDetailLayoutProps) {
  const size = useLayoutWindowSize(windowSize)
  const single = isSinglePane(size)
  const [uncontrolled, setUncontrolled] = React.useState(defaultDetailOpen)
  const detailOpen = detailOpenProp ?? uncontrolled
  const set = React.useCallback(
    (o: boolean) => {
      setUncontrolled(o)
      onDetailOpenChange?.(o)
    },
    [onDetailOpenChange],
  )
  const ctx = React.useMemo(
    () => ({ singlePane: single, showingDetail: !single || detailOpen, open: () => set(true), back: () => set(false) }),
    [single, detailOpen, set],
  )
  const compact = size === "compact"
  const pane = cn("flex min-w-0 flex-col overflow-hidden bg-surface", !compact && "rounded-xl")
  return (
    <ListDetailContext.Provider value={ctx}>
      <div data-slot="list-detail-layout" data-size={size} className={cn("flex min-h-0 flex-1", !compact && "gap-6 p-6", className)}>
        {(!single || !detailOpen) && (
          <section aria-label="List" className={cn(pane, single ? "flex-1" : "shrink-0")} style={single ? undefined : { width: listWidth }}>
            {list}
          </section>
        )}
        {(!single || detailOpen) && (
          <section aria-label="Detail" className={cn(pane, "flex-1")}>
            {detail}
          </section>
        )}
        {size === "extra-large" && supporting && (
          <aside className="relative flex shrink-0 flex-col overflow-y-auto rounded-xl bg-surface" style={{ width: supportingWidth }}>
            {supporting}
          </aside>
        )}
      </div>
    </ListDetailContext.Provider>
  )
}

/** Back arrow that only renders in the single-pane sizes. */
function ListDetailBack({ className, "aria-label": ariaLabel = "Back" }: { className?: string; "aria-label"?: string }) {
  const { singlePane, back } = useListDetail()
  if (!singlePane) return null
  return (
    <IconButton aria-label={ariaLabel} size="md" width="narrow" onPress={back} className={cn("text-on-surface", className)}>
      <Icon>arrow_back</Icon>
    </IconButton>
  )
}

export { ListDetailBack, ListDetailLayout, useListDetail }
