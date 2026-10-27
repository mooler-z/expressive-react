"use client"

import * as React from "react"
import {
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  composeRenderProps,
  type TooltipProps as AriaTooltipProps,
  type TooltipTriggerComponentProps,
} from "react-aria-components"

import { cn } from "@/lib/utils"

/*
 * Tooltips · M3 (androidx PlainTooltipTokens / RichTooltipTokens)
 *   plain   inverse-surface / inverse-on-surface · 4dp corners · body-small · 24dp min height · 8×4 padding
 *   rich    surface-container · 12dp corners · elevation 2 · subhead title-small · body body-medium
 *           on-surface-variant · up to two primary text-button actions
 *
 * <TooltipTrigger>
 *   <IconButton aria-label="Bookmark"><Icon>bookmark</Icon></IconButton>
 *   <Tooltip>Save to bookmarks</Tooltip>
 * </TooltipTrigger>
 *
 * The trigger must be a React Aria focusable (Button, Link, IconButton…). Wrap anything else,
 * including a disabled control, in <Focusable><span tabIndex={0}>…</span></Focusable>.
 *
 * Rich tooltips with actions are interactive, so they can't live in a tooltip (role="tooltip" content
 * is never focusable). Put the same layout in a <Popover className={richTooltipStyles}> instead.
 */

/** TooltipTrigger with M3 timing: 500ms to show, quick to hide. */
function TooltipTrigger({ delay = 500, closeDelay = 150, ...props }: TooltipTriggerComponentProps) {
  return <AriaTooltipTrigger delay={delay} closeDelay={closeDelay} {...props} />
}

const tooltipMotion = "origin-(--trigger-anchor-point) data-entering:m3-tooltip-enter data-exiting:m3-overlay-exit"

export interface TooltipProps extends Omit<AriaTooltipProps, "children"> {
  children?: React.ReactNode
  /** Keyboard shortcut shown after the label, e.g. "⌘B". */
  shortcut?: string
}

/** Plain tooltip: a short label for an icon or control. */
function Tooltip({ className, children, shortcut, offset = 4, ...props }: TooltipProps) {
  return (
    <AriaTooltip
      data-slot="tooltip"
      offset={offset}
      {...props}
      className={composeRenderProps(className, (className) =>
        cn(
          "flex min-h-6 max-w-[200px] items-center gap-3 rounded-xs bg-inverse-surface px-2 py-1 text-body-sm text-inverse-on-surface",
          tooltipMotion,
          className,
        ),
      )}
    >
      {children}
      {shortcut && <kbd className="font-mono">{shortcut}</kbd>}
    </AriaTooltip>
  )
}

/** Card styling for rich tooltips — use on <RichTooltip> or on an interactive <Popover>. */
const richTooltipStyles = "w-max max-w-[312px] rounded-md bg-surface-container px-4 pt-3 pb-2 text-body-md text-on-surface-variant shadow-2"

export interface RichTooltipProps extends Omit<AriaTooltipProps, "children"> {
  children?: React.ReactNode
  /** Optional subhead. */
  title?: React.ReactNode
}

/** Rich tooltip (non-interactive): subhead + supporting text, shown on hover/focus. */
function RichTooltip({ className, children, title, offset = 4, placement = "bottom", ...props }: RichTooltipProps) {
  return (
    <AriaTooltip
      data-slot="rich-tooltip"
      offset={offset}
      placement={placement}
      {...props}
      className={composeRenderProps(className, (className) => cn(richTooltipStyles, "pb-3", tooltipMotion, className))}
    >
      {title && <RichTooltipSubhead>{title}</RichTooltipSubhead>}
      {children}
    </AriaTooltip>
  )
}

function RichTooltipSubhead({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="rich-tooltip-subhead" className={cn("mb-1 text-title-sm text-on-surface-variant", className)} {...props} />
}

/** Row of up to two text buttons, aligned to the text's left edge. */
function RichTooltipActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="rich-tooltip-actions" className={cn("mt-1 -ml-3 flex", className)} {...props} />
}

export { RichTooltip, RichTooltipActions, RichTooltipSubhead, Tooltip, TooltipTrigger, richTooltipStyles }
