"use client"

import * as React from "react"
import {
  Button as AriaButton,
  Separator as AriaSeparator,
  ToggleButtonGroup as AriaToggleButtonGroup,
  Toolbar as AriaToolbar,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
  type ToggleButtonGroupProps as AriaToggleButtonGroupProps,
  type ToolbarProps as AriaToolbarProps,
} from "react-aria-components"
import type { VariantProps } from "tailwind-variants"

import { Fab, type FabProps } from "@/components/ui/fab"
import { Icon } from "@/components/ui/icon"
import { IconButton, ToggleIconButton, type IconButtonProps, type ToggleIconButtonProps } from "@/components/ui/icon-button"
import { Ripple } from "@/components/ui/ripple"
import { cn, tv } from "@/lib/utils"

/*
 * Toolbars · M3 Expressive
 * Floating (androidx FloatingToolbarTokens): 64dp, full corners, 8dp side padding, 4dp between items,
 *   16dp from the screen edge. Standard = surface-container; vibrant = primary-container with
 *   on-primary-container icons and a surface-container / on-surface selected item.
 *   Paired FAB sits 8dp away (ToolbarToFabGap): primary-container (standard) or tertiary-container
 *   (vibrant), elevation level 2 → 3 on hover; the toolbar itself drops to level 1 next to a FAB.
 * Docked (DockedToolbarTokens): 64dp, no corners, surface-container, 16dp side padding,
 *   4–32dp between items. Replaces the bottom app bar for contextual actions.
 * Keyboard: arrow keys move between items (React Aria Toolbar).
 */

type ToolbarColor = "standard" | "vibrant"
type ToolbarContextValue = { color: ToolbarColor; orientation: "horizontal" | "vertical" }
const ToolbarContext = React.createContext<ToolbarContextValue>({ color: "standard", orientation: "horizontal" })

const floatingToolbarVariants = tv({
  slots: {
    wrapper: "inline-flex items-center gap-2",
    toolbar: "inline-flex items-center gap-1 rounded-full",
  },
  variants: {
    color: {
      standard: { toolbar: "bg-surface-container text-on-surface-variant" },
      vibrant: { toolbar: "bg-primary-container text-on-primary-container" },
    },
    orientation: {
      horizontal: { toolbar: "h-16 px-2", wrapper: "flex-row" },
      vertical: { toolbar: "w-16 flex-col py-2", wrapper: "flex-col" },
    },
    withFab: {
      true: { toolbar: "shadow-1" },
      false: { toolbar: "shadow-3" },
    },
  },
  defaultVariants: { color: "standard", orientation: "horizontal", withFab: false },
})

export interface FloatingToolbarProps extends Omit<AriaToolbarProps, "className">, Omit<VariantProps<typeof floatingToolbarVariants>, "withFab"> {
  className?: string
  /** A paired FAB, typically `<ToolbarFab>`; placed 8dp after the toolbar. */
  fab?: React.ReactNode
}

function FloatingToolbar({ className, color = "standard", orientation = "horizontal", fab, children, ...props }: FloatingToolbarProps) {
  const { wrapper, toolbar } = floatingToolbarVariants({ color, orientation, withFab: fab != null })
  const bar = (
    <AriaToolbar
      data-slot="floating-toolbar"
      orientation={orientation}
      {...props}
      className={toolbar({ className: fab == null ? className : undefined })}
    >
      {children}
    </AriaToolbar>
  )
  return (
    <ToolbarContext.Provider value={{ color, orientation }}>
      {fab == null ? (
        bar
      ) : (
        <div data-slot="floating-toolbar-group" className={wrapper({ className })}>
          {bar}
          {fab}
        </div>
      )}
    </ToolbarContext.Provider>
  )
}

const toolbarItemColors: Record<ToolbarColor, string> = {
  standard: "text-on-surface-variant",
  vibrant: "text-on-primary-container",
}
const toolbarSelectedColors: Record<ToolbarColor, string> = {
  standard: "data-selected:bg-secondary-container data-selected:text-on-secondary-container",
  vibrant: "data-selected:bg-surface-container data-selected:text-on-surface",
}

/** Icon action inside a toolbar (standard icon button, recolored for the toolbar). */
function ToolbarButton({ className, ...props }: IconButtonProps) {
  const { color } = React.useContext(ToolbarContext)
  return (
    <IconButton
      {...props}
      className={composeRenderProps(className, (className) => cn(toolbarItemColors[color], className))}
    />
  )
}

/** Selectable icon in a toolbar: round → square, selected container per toolbar color. */
function ToolbarToggleButton({ className, ...props }: ToggleIconButtonProps) {
  const { color } = React.useContext(ToolbarContext)
  return (
    <ToggleIconButton
      {...props}
      className={composeRenderProps(className, (className) =>
        cn(toolbarItemColors[color], toolbarSelectedColors[color], className),
      )}
    />
  )
}

export interface ToolbarToggleGroupProps extends AriaToggleButtonGroupProps {
  ref?: React.Ref<HTMLDivElement>
}

/** Groups ToolbarToggleButtons for single or multiple selection. */
function ToolbarToggleGroup({ className, ...props }: ToolbarToggleGroupProps) {
  const { orientation } = React.useContext(ToolbarContext)
  return (
    <AriaToggleButtonGroup
      data-slot="toolbar-toggle-group"
      orientation={orientation}
      {...props}
      className={composeRenderProps(className, (className) =>
        cn("flex items-center gap-1", orientation === "vertical" && "flex-col", className),
      )}
    />
  )
}

function ToolbarSeparator({ className }: { className?: string }) {
  const { orientation } = React.useContext(ToolbarContext)
  const vertical = orientation === "horizontal"
  return (
    <AriaSeparator
      orientation={vertical ? "vertical" : "horizontal"}
      className={cn("shrink-0 bg-current opacity-20", vertical ? "mx-1 h-6 w-px" : "my-1 h-px w-6", className)}
    />
  )
}

/** FAB paired with a FloatingToolbar; picks the toolbar's FAB color. */
function ToolbarFab({ className, color, ...props }: FabProps) {
  const ctx = React.useContext(ToolbarContext)
  return (
    <Fab
      color={color ?? (ctx.color === "vibrant" ? "tertiary-container" : "primary-container")}
      {...props}
      className={composeRenderProps(className, (className) => cn("shadow-2 data-hovered:shadow-3", className))}
    />
  )
}

/* ---------------------------------------------------------------------------------------------- */

const dockedToolbarVariants = tv({
  base: "flex min-h-16 w-full items-center gap-1 bg-surface-container ps-4 pe-4 text-on-surface-variant",
  variants: {
    justify: {
      between: "justify-between",
      around: "justify-around",
      center: "justify-center gap-8",
      start: "justify-start",
      end: "justify-end",
    },
  },
  defaultVariants: { justify: "between" },
})

export interface DockedToolbarProps extends Omit<AriaToolbarProps, "className">, VariantProps<typeof dockedToolbarVariants> {
  className?: string
}

function DockedToolbar({ className, justify, ...props }: DockedToolbarProps) {
  return (
    <ToolbarContext.Provider value={{ color: "standard", orientation: "horizontal" }}>
      <AriaToolbar data-slot="docked-toolbar" {...props} className={dockedToolbarVariants({ justify, className })} />
    </ToolbarContext.Provider>
  )
}

export interface DockedToolbarActionProps extends AriaButtonProps {
  icon: string
  children: React.ReactNode
  ref?: React.Ref<HTMLButtonElement>
}

/** Icon-over-label action for docked toolbars. */
function DockedToolbarAction({ className, icon, children, ...props }: DockedToolbarActionProps) {
  return (
    <AriaButton
      data-slot="docked-toolbar-action"
      {...props}
      className={composeRenderProps(className, (className) =>
        cn(
          "state-layer focus-ring shape-morph relative flex min-w-16 cursor-pointer flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-label-md text-on-surface-variant select-none",
          "data-pressed:rounded-[8px] data-disabled:cursor-default data-disabled:text-on-surface/38",
          className,
        ),
      )}
    >
      <Icon>{icon}</Icon>
      {children}
      <Ripple />
    </AriaButton>
  )
}

export {
  DockedToolbar,
  DockedToolbarAction,
  FloatingToolbar,
  ToolbarButton,
  ToolbarFab,
  ToolbarSeparator,
  ToolbarToggleButton,
  ToolbarToggleGroup,
  dockedToolbarVariants,
  floatingToolbarVariants,
}
