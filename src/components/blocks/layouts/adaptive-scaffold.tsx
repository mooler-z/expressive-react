"use client"

import * as React from "react"

import { Fab } from "@/components/ui/fab"
import { Icon } from "@/components/ui/icon"
import { NavigationBar, NavigationBarItem } from "@/components/ui/navigation-bar"
import {
  NavigationRail,
  NavigationRailFab,
  NavigationRailHeader,
  NavigationRailItem,
  NavigationRailMenuButton,
} from "@/components/ui/navigation-rail"
import type { WindowSizeClass } from "@/hooks/use-window-size-class"
import { cn } from "@/lib/utils"

import { WindowSizeProvider, isWide, useLayoutWindowSize } from "./window-size"

/*
 * Adaptive scaffold · the M3 navigation suite.
 *   compact          navigation bar at the bottom, FAB above it
 *   medium/expanded  collapsed navigation rail (menu opens it as a modal rail), FAB in the rail
 *   large/xl         expanded rail with labels, extended FAB, brand in the header
 * Children get the resolved window size through context (ListDetailLayout, FeedLayout … read it).
 */

export interface ScaffoldDestination {
  value: string
  icon: string
  label: string
  /** Count, short text, or `true` for the dot. */
  badge?: number | string | boolean
}

export interface AdaptiveScaffoldProps {
  destinations: ScaffoldDestination[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Primary action: a FAB in the bar layout, the rail FAB otherwise. */
  action?: { icon: string; label: string; onPress?: () => void }
  /** Hide the bar-layout FAB (e.g. while a detail pane is open). */
  showAction?: boolean
  /** Shown next to the menu button in the expanded rail. */
  brand?: React.ReactNode
  /** Pin a window size class instead of following the browser. */
  windowSize?: WindowSizeClass
  className?: string
  children: React.ReactNode
}

function AdaptiveScaffold({
  destinations,
  value: valueProp,
  defaultValue,
  onValueChange,
  action,
  showAction = true,
  brand,
  windowSize,
  className,
  children,
}: AdaptiveScaffoldProps) {
  const size = useLayoutWindowSize(windowSize)
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? destinations[0]?.value)
  const value = valueProp ?? uncontrolled
  const select = (v: string) => {
    setUncontrolled(v)
    onValueChange?.(v)
  }
  const [railOpen, setRailOpen] = React.useState(false)
  const wide = isWide(size)

  if (size === "compact")
    return (
      <WindowSizeProvider size={size}>
        <div data-slot="adaptive-scaffold" data-size={size} className={cn("flex size-full min-h-0 flex-col bg-surface-container", className)}>
          <div className="relative flex min-h-0 flex-1 flex-col">
            {children}
            {action && showAction && (
              <Fab aria-label={action.label} color="tertiary-container" onPress={action.onPress} className="absolute right-4 bottom-4 z-20">
                <Icon>{action.icon}</Icon>
              </Fab>
            )}
          </div>
          <NavigationBar value={value} onValueChange={select} className="shrink-0">
            {destinations.map((d) => (
              <NavigationBarItem key={d.value} value={d.value} icon={d.icon} label={d.label} badge={d.badge} />
            ))}
          </NavigationBar>
        </div>
      </WindowSizeProvider>
    )

  return (
    <WindowSizeProvider size={size}>
      <div data-slot="adaptive-scaffold" data-size={size} className={cn("relative flex size-full min-h-0 bg-surface-container", className)}>
        <NavigationRail
          value={value}
          onValueChange={select}
          expanded={wide || railOpen}
          onExpandedChange={setRailOpen}
          modal={!wide}
          surface="transparent"
          className="shrink-0"
        >
          <NavigationRailHeader>
            <NavigationRailMenuButton />
            {wide && brand && <span className="truncate text-title-md font-semibold text-on-surface">{brand}</span>}
          </NavigationRailHeader>
          {action && <NavigationRailFab icon={action.icon} label={action.label} tone="tertiary" onPress={action.onPress} />}
          <div className="mt-6 flex flex-col gap-1">
            {destinations.map((d) => (
              <NavigationRailItem key={d.value} value={d.value} icon={d.icon} label={d.label} badge={d.badge} />
            ))}
          </div>
        </NavigationRail>
        <div className="relative flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </WindowSizeProvider>
  )
}

export { AdaptiveScaffold }
