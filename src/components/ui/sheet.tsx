"use client"

import * as React from "react"
import {
  Dialog as AriaDialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
  type DialogProps as AriaDialogProps,
  type ModalOverlayProps,
} from "react-aria-components"

import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { cn } from "@/lib/utils"

/*
 * Sheets · M3
 * Bottom sheet (androidx SheetBottomTokens): surface-container-low, 28dp top corners (ExtraLargeTop),
 *   32×4 on-surface-variant drag handle in a 48dp touch target, elevation 1, max width 640, scrim 32%.
 * Side sheet: 256–400dp wide. Standard sits in the layout (surface, divider); modal floats over a
 *   scrim (surface-container-low, 16dp corners on the inner edge, elevation 1).
 * Drag to dismiss / snap uses pointer events; settling rides the DefaultSpatial spring.
 */

const SPRING = "var(--md-spring-default-spatial-duration) var(--md-spring-default-spatial)"

/* ---------- drag ---------- */

interface DragOptions {
  /** Called continuously with the drag offset (px, positive = down). Return the offset to apply. */
  onMove?: (dy: number) => number
  /** Called on release with the final offset and velocity (px/ms). */
  onRelease: (dy: number, velocity: number) => void
}

/** Vertical drag from any `[data-sheet-grab]` element inside `ref`. */
function useSheetDrag(ref: React.RefObject<HTMLElement | null>, { onMove, onRelease }: DragOptions) {
  const handlers = React.useRef({ onMove, onRelease })
  handlers.current = { onMove, onRelease }

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    let id = -1
    let startY = 0
    let moved = false
    let samples: { t: number; y: number }[] = []

    const down = (e: PointerEvent) => {
      if (e.button !== 0 || !(e.target as HTMLElement).closest("[data-sheet-grab]")) return
      if ((e.target as HTMLElement).closest("input, textarea, select, [contenteditable]")) return
      id = e.pointerId
      startY = e.clientY
      moved = false
      samples = [{ t: e.timeStamp, y: e.clientY }]
    }
    const move = (e: PointerEvent) => {
      if (e.pointerId !== id) return
      const dy = e.clientY - startY
      if (!moved) {
        if (Math.abs(dy) < 4) return
        moved = true
        el.setPointerCapture(id)
        el.style.transition = "none"
        el.dataset.dragging = ""
      }
      const applied = handlers.current.onMove ? handlers.current.onMove(dy) : dy
      el.style.transform = `translateY(${applied}px)`
      samples.push({ t: e.timeStamp, y: e.clientY })
      if (samples.length > 6) samples.shift()
    }
    const up = (e: PointerEvent) => {
      if (e.pointerId !== id) return
      id = -1
      if (!moved) return
      delete el.dataset.dragging
      const first = samples[0]
      const last = samples[samples.length - 1]
      const v = last.t > first.t ? (last.y - first.y) / (last.t - first.t) : 0
      el.style.transition = `transform ${SPRING}`
      // swallow the click that ends a drag (e.g. on the handle button)
      const block = (ev: MouseEvent) => {
        ev.stopPropagation()
        ev.preventDefault()
      }
      el.addEventListener("click", block, { capture: true, once: true })
      setTimeout(() => el.removeEventListener("click", block, { capture: true }), 0)
      handlers.current.onRelease(e.clientY - startY, v)
    }
    el.addEventListener("pointerdown", down)
    el.addEventListener("pointermove", move)
    el.addEventListener("pointerup", up)
    el.addEventListener("pointercancel", up)
    return () => {
      el.removeEventListener("pointerdown", down)
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerup", up)
      el.removeEventListener("pointercancel", up)
    }
  }, [ref])
}

/* ---------- parts ---------- */

export interface SheetDragHandleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/** 32×4 handle in a 48dp target. A button: press toggles/dismisses; it also starts drags. */
function SheetDragHandle({ className, "aria-label": ariaLabel = "Drag handle", ...props }: SheetDragHandleProps) {
  return (
    <button
      type="button"
      data-sheet-grab
      data-slot="sheet-drag-handle"
      aria-label={ariaLabel}
      className={cn(
        "group/handle mx-auto flex h-12 w-16 cursor-grab touch-none items-center justify-center rounded-full outline-none",
        "focus-visible:outline-3 focus-visible:-outline-offset-4 focus-visible:outline-secondary",
        className,
      )}
      {...props}
    >
      <span className="h-1 w-8 rounded-full bg-on-surface-variant/40 transition-[width,background-color] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial group-hover/handle:bg-on-surface-variant/60 group-active/handle:w-10" />
    </button>
  )
}

export interface SheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show a close icon button. Inside a modal sheet it closes the sheet; otherwise pass `onClose`. */
  closeButton?: boolean
  onClose?: () => void
  /** Leading slot, e.g. a back button. */
  leading?: React.ReactNode
}

function SheetHeader({ className, closeButton, onClose, leading, children, ...props }: SheetHeaderProps) {
  return (
    <div
      data-sheet-grab
      data-slot="sheet-header"
      className={cn("flex min-h-16 items-center gap-2 pr-2 pl-6", leading && "pl-1", className)}
      {...props}
    >
      {leading}
      <div className="min-w-0 flex-1">{children}</div>
      {closeButton &&
        (onClose ? (
          <IconButton aria-label="Close" onPress={onClose}>
            <Icon>close</Icon>
          </IconButton>
        ) : (
          <IconButton aria-label="Close" slot="close">
            <Icon>close</Icon>
          </IconButton>
        ))}
    </div>
  )
}

/** Sheet title. Inside a modal sheet it labels the dialog. */
function SheetTitle({ className, ...props }: React.ComponentProps<typeof Heading>) {
  return <Heading slot="title" data-slot="sheet-title" className={cn("truncate text-title-lg text-on-surface", className)} {...props} />
}

function SheetDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p data-slot="sheet-description" className={cn("text-body-md text-on-surface-variant", className)} {...props} />
}

/** Scrollable body. */
function SheetContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="sheet-content" className={cn("relative min-h-0 flex-1 overflow-y-auto px-6", className)} {...props} />
}

function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("flex shrink-0 items-center gap-2 border-t border-outline-variant px-6 py-4", className)}
      {...props}
    />
  )
}

/* ---------- modal bottom sheet ---------- */

export interface BottomSheetProps extends Omit<ModalOverlayProps, "children" | "className" | "style"> {
  children?: AriaDialogProps["children"]
  className?: string
  /** Classes for the scrim layer. */
  overlayClassName?: string
  "aria-label"?: string
  /** Render the 32×4 drag handle (drag down to dismiss). */
  dragHandle?: boolean
}

/**
 * Modal bottom sheet. Use inside `<BottomSheetTrigger>` (or control with `isOpen`/`onOpenChange`).
 * Drag the handle or header down to dismiss; the scrim and Escape dismiss too.
 */
function BottomSheet({
  className,
  overlayClassName,
  children,
  dragHandle = true,
  isDismissable = true,
  "aria-label": ariaLabel,
  ...props
}: BottomSheetProps) {
  return (
    <ModalOverlay
      isDismissable={isDismissable}
      {...props}
      className={cn(
        "fixed inset-0 z-50 flex items-end justify-center bg-scrim/32",
        "data-entering:animate-[m3-fade-in_250ms_var(--md-easing-standard)] data-exiting:animate-[m3-fade-out_200ms_var(--md-easing-standard)]",
        overlayClassName,
      )}
    >
      {({ state }) => (
        <DraggableModal className={className} dragHandle={dragHandle} onDismiss={() => state.close()} ariaLabel={ariaLabel}>
          {children}
        </DraggableModal>
      )}
    </ModalOverlay>
  )
}

function DraggableModal({
  className,
  dragHandle,
  onDismiss,
  ariaLabel,
  children,
}: {
  className?: string
  dragHandle: boolean
  onDismiss: () => void
  ariaLabel?: string
  children: AriaDialogProps["children"]
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  useSheetDrag(ref, {
    onMove: (dy) => (dy < 0 ? dy * 0.15 : dy), // rubber-band upwards
    onRelease: (dy, v) => {
      const el = ref.current
      if (!el) return
      if (dy > el.offsetHeight * 0.3 || v > 0.5) {
        // slide out from where the finger left it, then close without the CSS exit animation
        el.style.animation = "none"
        el.style.transition = "transform 200ms var(--md-easing-emphasized-accelerate)"
        el.style.transform = "translateY(100%)"
        setTimeout(onDismiss, 200)
      } else {
        el.style.transform = ""
      }
    },
  })

  return (
    <Modal
      ref={ref}
      data-slot="bottom-sheet"
      className={cn(
        "relative flex max-h-[calc(100dvh-72px)] w-full max-w-[640px] flex-col overflow-hidden rounded-t-xl bg-surface-container-low pb-[env(safe-area-inset-bottom)] text-on-surface shadow-1 outline-none",
        "data-entering:animate-[m3-sheet-in-bottom_450ms_var(--md-easing-emphasized-decelerate)]",
        "data-exiting:animate-[m3-sheet-out-bottom_200ms_var(--md-easing-emphasized-accelerate)]",
        className,
      )}
    >
      <AriaDialog aria-label={ariaLabel} className="flex min-h-0 flex-1 flex-col outline-none">
        {(renderProps) => (
          <>
            {dragHandle && <SheetDragHandle aria-label="Close sheet" onClick={() => renderProps.close()} />}
            {typeof children === "function" ? children(renderProps) : children}
          </>
        )}
      </AriaDialog>
    </Modal>
  )
}

/* ---------- standard bottom sheet ---------- */

export interface StandardBottomSheetProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** Visible height while collapsed (px). 0 hides it entirely. */
  peekHeight?: number
  isExpanded?: boolean
  defaultExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  /** Accessible name for the region and handle. */
  "aria-label"?: string
}

/**
 * Standard (non-modal) bottom sheet that coexists with the page: peeks at `peekHeight` and
 * expands to its content. Drag the handle/header or press the handle to switch.
 * Positioned `fixed` to the viewport bottom by default; pass `className="absolute"` to dock it in a container.
 */
function StandardBottomSheet({
  className,
  style,
  peekHeight = 96,
  isExpanded,
  defaultExpanded = false,
  onExpandedChange,
  children,
  "aria-label": ariaLabel = "Bottom sheet",
  ...props
}: StandardBottomSheetProps) {
  const [inner, setInner] = React.useState(defaultExpanded)
  const expanded = isExpanded ?? inner
  const setExpanded = React.useCallback(
    (next: boolean) => {
      setInner(next)
      onExpandedChange?.(next)
    },
    [onExpandedChange],
  )
  const ref = React.useRef<HTMLElement>(null)
  const [height, setHeight] = React.useState(0)

  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight))
    ro.observe(el)
    setHeight(el.offsetHeight)
    return () => ro.disconnect()
  }, [])

  const collapsedOffset = Math.max(0, height - peekHeight)
  const offset = expanded ? 0 : collapsedOffset

  // Drag sets an absolute translateY (rubber-banded past the ends); release settles on peek or expanded.
  useSheetDrag(ref, {
    onMove: (dy) => {
      const y = offset + dy
      if (y < 0) return y * 0.15
      if (y > collapsedOffset) return collapsedOffset + (y - collapsedOffset) * 0.15
      return y
    },
    onRelease: (dy, v) => {
      const el = ref.current
      if (!el) return
      const projected = offset + dy + v * 200
      const next = projected < collapsedOffset / 2
      el.style.transform = `translateY(${next ? 0 : collapsedOffset}px)`
      if (next !== expanded) setExpanded(next)
    },
  })

  return (
    <section
      ref={ref}
      aria-label={ariaLabel}
      data-slot="standard-bottom-sheet"
      data-expanded={expanded || undefined}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 mx-auto flex max-h-[calc(100%-72px)] w-full max-w-[640px] flex-col rounded-t-xl bg-surface-container-low text-on-surface shadow-1",
        className,
      )}
      style={{ transform: `translateY(${offset}px)`, transition: height ? `transform ${SPRING}` : "none", ...style }}
      {...props}
    >
      <SheetDragHandle
        aria-label={ariaLabel}
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
      />
      {children}
    </section>
  )
}

/* ---------- side sheets ---------- */

const sideSheetSide = {
  right: {
    position: "right-0",
    radius: "rounded-l-lg",
    enter: "data-entering:animate-[m3-sheet-in-right_450ms_var(--md-easing-emphasized-decelerate)]",
    exit: "data-exiting:animate-[m3-sheet-out-right_200ms_var(--md-easing-emphasized-accelerate)]",
    border: "border-l",
  },
  left: {
    position: "left-0",
    radius: "rounded-r-lg",
    enter: "data-entering:animate-[m3-sheet-in-left_450ms_var(--md-easing-emphasized-decelerate)]",
    exit: "data-exiting:animate-[m3-sheet-out-left_200ms_var(--md-easing-emphasized-accelerate)]",
    border: "border-r",
  },
}

export interface SideSheetProps extends Omit<ModalOverlayProps, "children" | "className" | "style"> {
  children?: AriaDialogProps["children"]
  className?: string
  overlayClassName?: string
  side?: "left" | "right"
  "aria-label"?: string
}

/** Modal side sheet over a scrim. Use inside `<SideSheetTrigger>` or control with `isOpen`. */
function SideSheet({
  className,
  overlayClassName,
  side = "right",
  children,
  isDismissable = true,
  "aria-label": ariaLabel,
  ...props
}: SideSheetProps) {
  const s = sideSheetSide[side]
  return (
    <ModalOverlay
      isDismissable={isDismissable}
      {...props}
      className={cn(
        "fixed inset-0 z-50 bg-scrim/32",
        "data-entering:animate-[m3-fade-in_250ms_var(--md-easing-standard)] data-exiting:animate-[m3-fade-out_200ms_var(--md-easing-standard)]",
        overlayClassName,
      )}
    >
      <Modal
        data-slot="side-sheet"
        className={cn(
          "absolute inset-y-0 flex w-[min(400px,85vw)] min-w-[256px] flex-col bg-surface-container-low text-on-surface shadow-1 outline-none",
          s.position,
          s.radius,
          s.enter,
          s.exit,
          className,
        )}
      >
        <AriaDialog aria-label={ariaLabel} className="flex min-h-0 flex-1 flex-col outline-none">
          {children}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  )
}

export interface StandardSideSheetProps extends React.HTMLAttributes<HTMLElement> {
  isOpen?: boolean
  side?: "left" | "right"
  /** Open width in px (256–400 per spec). */
  width?: number
}

/**
 * Standard side sheet: part of the layout, pushes the main pane. Animates its width open/closed
 * on the DefaultSpatial spring and is inert while closed.
 */
function StandardSideSheet({ className, isOpen = true, side = "right", width = 320, children, style, ...props }: StandardSideSheetProps) {
  return (
    <aside
      data-slot="standard-side-sheet"
      data-open={isOpen || undefined}
      inert={!isOpen}
      className={cn("shrink-0 overflow-hidden", className)}
      style={{ width: isOpen ? width : 0, transition: `width ${SPRING}`, ...style }}
      {...props}
    >
      <div
        className={cn(
          "flex h-full flex-col border-outline-variant bg-surface text-on-surface",
          sideSheetSide[side].border,
          side === "right" ? "ml-auto" : "mr-auto",
        )}
        style={{ width }}
      >
        {children}
      </div>
    </aside>
  )
}

/** Opens a modal bottom sheet (alias of React Aria DialogTrigger). */
const BottomSheetTrigger = DialogTrigger
/** Opens a modal side sheet (alias of React Aria DialogTrigger). */
const SideSheetTrigger = DialogTrigger

export {
  BottomSheet,
  BottomSheetTrigger,
  SheetContent,
  SheetDescription,
  SheetDragHandle,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SideSheet,
  SideSheetTrigger,
  StandardBottomSheet,
  StandardSideSheet,
}
