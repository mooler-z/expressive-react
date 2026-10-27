"use client"

import * as React from "react"
import { Button as AriaButton, MenuTrigger } from "react-aria-components"

import { Menu, MenuPopover, type MenuProps } from "@/components/ui/menu"
import { cn } from "@/lib/utils"

/*
 * Context menu · the Expressive menu, opened at the pointer.
 * Right-click, long-press (touch/pen, 500ms), Shift+F10 or the ContextMenu key on a focused area.
 * Items, sections and submenus come from menu.tsx.
 *
 * <ContextMenu>
 *   <ContextMenuArea className="h-72">Right-click here</ContextMenuArea>
 *   <ContextMenuContent>
 *     <MenuItem icon="open_in_new">Open</MenuItem>
 *   </ContextMenuContent>
 * </ContextMenu>
 */

interface ContextMenuContextValue {
  isOpen: boolean
  setOpen: (open: boolean) => void
  openAt: (x: number, y: number) => void
}

const ContextMenuContext = React.createContext<ContextMenuContextValue | null>(null)

function useContextMenu() {
  const ctx = React.useContext(ContextMenuContext)
  if (!ctx) throw new Error("ContextMenu parts must be inside <ContextMenu>")
  return ctx
}

export interface ContextMenuProps {
  children: React.ReactNode
  onOpenChange?: (isOpen: boolean) => void
}

function ContextMenu({ children, onOpenChange }: ContextMenuProps) {
  const [isOpen, setOpenState] = React.useState(false)
  const [point, setPoint] = React.useState({ x: 0, y: 0 })

  const setOpen = React.useCallback(
    (open: boolean) => {
      setOpenState(open)
      onOpenChange?.(open)
    },
    [onOpenChange],
  )
  const openAt = React.useCallback(
    (x: number, y: number) => {
      setPoint({ x, y })
      setOpen(true)
    },
    [setOpen],
  )

  return (
    <ContextMenuContext.Provider value={{ isOpen, setOpen, openAt }}>
      <MenuTrigger isOpen={isOpen} onOpenChange={setOpen}>
        {/* Zero-size anchor at the pointer: the menu positions (and flips) against it. */}
        <AriaButton
          aria-label="Context menu"
          excludeFromTabOrder
          className="pointer-events-none fixed size-0 opacity-0"
          style={{ left: point.x, top: point.y }}
        />
        {children}
      </MenuTrigger>
    </ContextMenuContext.Provider>
  )
}

export interface ContextMenuAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Long-press duration for touch and pen, in ms. */
  longPressDelay?: number
}

/** The region that responds to right-click / long-press. Focusable so keyboard users can open it too. */
function ContextMenuArea({ className, longPressDelay = 500, onContextMenu, onPointerDown, onKeyDown, ...props }: ContextMenuAreaProps) {
  const { openAt } = useContextMenu()
  const press = React.useRef<{ timer: ReturnType<typeof setTimeout>; x: number; y: number } | null>(null)

  const cancel = React.useCallback(() => {
    if (press.current) clearTimeout(press.current.timer)
    press.current = null
  }, [])

  React.useEffect(() => {
    const move = (e: PointerEvent) => {
      if (press.current && Math.hypot(e.clientX - press.current.x, e.clientY - press.current.y) > 8) cancel()
    }
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", cancel)
    window.addEventListener("pointercancel", cancel)
    return () => {
      cancel()
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", cancel)
      window.removeEventListener("pointercancel", cancel)
    }
  }, [cancel])

  return (
    <div
      data-slot="context-menu-area"
      tabIndex={0}
      className={cn(
        "outline-none select-none [-webkit-touch-callout:none] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-secondary",
        className,
      )}
      onContextMenu={(e) => {
        onContextMenu?.(e)
        if (e.defaultPrevented) return
        e.preventDefault()
        cancel()
        openAt(e.clientX, e.clientY)
      }}
      onPointerDown={(e) => {
        onPointerDown?.(e)
        if (e.pointerType === "mouse") return
        const { clientX: x, clientY: y } = e
        press.current = { x, y, timer: setTimeout(() => openAt(x, y), longPressDelay) }
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (e.key === "ContextMenu" || (e.shiftKey && e.key === "F10")) {
          e.preventDefault()
          const r = e.currentTarget.getBoundingClientRect()
          openAt(r.left + 16, r.top + 16)
        }
      }}
      {...props}
    />
  )
}

export interface ContextMenuContentProps<T> extends MenuProps<T> {
  popoverClassName?: string
}

function ContextMenuContent<T extends object>({ popoverClassName, autoFocus = "first", ...props }: ContextMenuContentProps<T>) {
  return (
    <MenuPopover placement="bottom start" offset={0} className={popoverClassName}>
      <Menu autoFocus={autoFocus} {...props} />
    </MenuPopover>
  )
}

export { ContextMenu, ContextMenuArea, ContextMenuContent }
