"use client"

import * as React from "react"
import {
  Dialog as AriaDialog,
  DialogTrigger,
  Heading,
  Link as AriaLink,
  Popover as AriaPopover,
  composeRenderProps,
  type LinkProps as AriaLinkProps,
  type PopoverProps as AriaPopoverProps,
} from "react-aria-components"

import { cn } from "@/lib/utils"

/*
 * Popover & hover card
 * Anchored surface-container cards at elevation 2, 12dp corners — no arrows in M3.
 * Popovers open on press and hold controls (focus is contained and restored);
 * hover cards preview an entity on hover or focus, after a delay.
 * Both grow from their anchor on the FastSpatial spring.
 *
 * <PopoverTrigger>
 *   <Button>Filters</Button>
 *   <Popover>
 *     <PopoverTitle>Filter deployments</PopoverTitle>
 *     …
 *   </Popover>
 * </PopoverTrigger>
 */

const popoverStyles = cn(
  "rounded-md bg-surface-container p-4 text-on-surface shadow-2 outline-none",
  "max-w-[calc(100vw-2rem)] origin-(--trigger-anchor-point)",
  "data-entering:m3-popover-enter data-exiting:m3-overlay-exit",
)

export interface PopoverProps extends Omit<AriaPopoverProps, "children"> {
  children?: React.ReactNode
  /** Accessible name when the popover has no PopoverTitle. */
  "aria-label"?: string
}

/** Click-triggered popover. Wraps its content in a dialog for focus management. */
function Popover({ className, children, offset = 8, placement = "bottom start", "aria-label": ariaLabel, ...props }: PopoverProps) {
  return (
    <AriaPopover
      data-slot="popover"
      offset={offset}
      placement={placement}
      {...props}
      className={composeRenderProps(className, (className) => cn(popoverStyles, className))}
    >
      <AriaDialog aria-label={ariaLabel} className="outline-none">
        {children}
      </AriaDialog>
    </AriaPopover>
  )
}

function PopoverTitle({ className, ...props }: React.ComponentProps<typeof Heading>) {
  return <Heading slot="title" data-slot="popover-title" className={cn("text-title-sm text-on-surface", className)} {...props} />
}

function PopoverDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p data-slot="popover-description" className={cn("mt-1 text-body-md text-on-surface-variant", className)} {...props} />
}

/* ---------- Hover card ---------- */

interface HoverCardContextValue {
  isOpen: boolean
  triggerRef: React.RefObject<HTMLAnchorElement | null>
  open: () => void
  close: (immediate?: boolean) => void
}

const HoverCardContext = React.createContext<HoverCardContextValue | null>(null)

function useHoverCard() {
  const ctx = React.useContext(HoverCardContext)
  if (!ctx) throw new Error("HoverCard parts must be inside <HoverCard>")
  return ctx
}

export interface HoverCardProps {
  children: React.ReactNode
  /** ms before opening on hover. */
  openDelay?: number
  /** ms before closing once the pointer leaves trigger and card. */
  closeDelay?: number
}

/**
 * Preview an entity on hover or keyboard focus.
 * <HoverCard><HoverCardTrigger href="/u/maya">@maya</HoverCardTrigger><HoverCardContent>…</HoverCardContent></HoverCard>
 */
function HoverCard({ children, openDelay = 500, closeDelay = 200 }: HoverCardProps) {
  const [isOpen, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLAnchorElement>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  const open = React.useCallback(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(true), openDelay)
  }, [openDelay])
  const close = React.useCallback(
    (immediate?: boolean) => {
      clearTimeout(timer.current)
      if (immediate) setOpen(false)
      else timer.current = setTimeout(() => setOpen(false), closeDelay)
    },
    [closeDelay],
  )
  React.useEffect(() => () => clearTimeout(timer.current), [])

  const value = React.useMemo(() => ({ isOpen, triggerRef, open, close }), [isOpen, open, close])
  return <HoverCardContext.Provider value={value}>{children}</HoverCardContext.Provider>
}

function HoverCardTrigger({ className, ...props }: AriaLinkProps) {
  const { triggerRef, open, close } = useHoverCard()
  return (
    <AriaLink
      ref={triggerRef}
      data-slot="hover-card-trigger"
      onHoverStart={open}
      onHoverEnd={() => close()}
      onFocus={open}
      onBlur={() => close()}
      onKeyDown={(e) => e.key === "Escape" && close(true)}
      {...props}
      className={composeRenderProps(className, (className) =>
        cn(
          "cursor-pointer rounded-xs bg-primary/10 px-1 font-medium text-primary outline-none",
          "data-focus-visible:outline-3 data-focus-visible:outline-offset-2 data-focus-visible:outline-secondary",
          className,
        ),
      )}
    />
  )
}

export interface HoverCardContentProps extends Omit<AriaPopoverProps, "children" | "isOpen" | "triggerRef"> {
  children?: React.ReactNode
}

function HoverCardContent({ className, children, offset = 8, placement = "bottom start", ...props }: HoverCardContentProps) {
  const { isOpen, triggerRef, open, close } = useHoverCard()
  return (
    <AriaPopover
      data-slot="hover-card"
      triggerRef={triggerRef}
      isOpen={isOpen}
      onOpenChange={(o) => !o && close(true)}
      isNonModal
      offset={offset}
      placement={placement}
      onPointerEnter={open}
      onPointerLeave={() => close()}
      {...props}
      className={composeRenderProps(className, (className) => cn(popoverStyles, "w-72", className))}
    >
      {children}
    </AriaPopover>
  )
}

export { DialogTrigger as PopoverTrigger, HoverCard, HoverCardContent, HoverCardTrigger, Popover, PopoverDescription, PopoverTitle, popoverStyles }
