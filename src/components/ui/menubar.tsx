"use client"

import * as React from "react"
import { Button as AriaButton, MenuTrigger, Toolbar, type ToolbarProps } from "react-aria-components"

import { Menu, MenuPopover, type MenuProps } from "@/components/ui/menu"
import { cn } from "@/lib/utils"

/*
 * Menubar · desktop-style row of text triggers, one menu open at a time.
 * ←/→ move between triggers (and between open menus); hovering another trigger while a menu is open
 * switches to it. Items, sections and submenus come from menu.tsx.
 *
 * <Menubar aria-label="Editor">
 *   <MenubarMenu label="File">
 *     <MenuItem shortcut="⌘N">New</MenuItem>
 *   </MenubarMenu>
 * </Menubar>
 */

interface MenubarContextValue {
  openId: string | null
  setOpenId: (id: string | null) => void
  move: (fromId: string, dir: 1 | -1) => void
}

const MenubarContext = React.createContext<MenubarContextValue | null>(null)

function Menubar({ className, children, ...props }: ToolbarProps) {
  const [openId, setOpenId] = React.useState<string | null>(null)
  const ref = React.useRef<HTMLDivElement>(null)

  const move = React.useCallback((fromId: string, dir: 1 | -1) => {
    const triggers = Array.from(ref.current?.querySelectorAll<HTMLElement>("[data-menubar-trigger]") ?? [])
    const i = triggers.findIndex((t) => t.dataset.menubarTrigger === fromId)
    const next = triggers[(i + dir + triggers.length) % triggers.length]
    if (!next) return
    next.focus()
    setOpenId(next.dataset.menubarTrigger ?? null)
  }, [])

  // Menus are non-modal so hovering a sibling trigger can switch; close on outside press ourselves.
  React.useEffect(() => {
    if (!openId) return
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element
      if (ref.current?.contains(t) || t.closest?.("[data-menubar-popover]")) return
      setOpenId(null)
    }
    document.addEventListener("pointerdown", onDown, true)
    return () => document.removeEventListener("pointerdown", onDown, true)
  }, [openId])

  return (
    <MenubarContext.Provider value={{ openId, setOpenId, move }}>
      <Toolbar
        ref={ref}
        data-slot="menubar"
        {...props}
        className={cn("flex items-center gap-1 text-label-lg text-on-surface", typeof className === "string" && className)}
      >
        {children}
      </Toolbar>
    </MenubarContext.Provider>
  )
}

export interface MenubarMenuProps<T> extends Omit<MenuProps<T>, "children"> {
  label: React.ReactNode
  children: MenuProps<T>["children"]
  triggerClassName?: string
}

function MenubarMenu<T extends object>({ label, children, triggerClassName, ...props }: MenubarMenuProps<T>) {
  const ctx = React.useContext(MenubarContext)
  if (!ctx) throw new Error("MenubarMenu must be inside <Menubar>")
  const id = React.useId()
  const { openId, setOpenId, move } = ctx
  const isOpen = openId === id

  return (
    <MenuTrigger isOpen={isOpen} onOpenChange={(open) => setOpenId(open ? id : openId === id ? null : openId)}>
      <AriaButton
        data-menubar-trigger={id}
        onHoverStart={() => openId && openId !== id && setOpenId(id)}
        className={cn(
          "state-layer focus-ring inline-flex h-8 cursor-default items-center rounded-full px-3 outline-none",
          "aria-expanded:bg-secondary-container aria-expanded:text-on-secondary-container",
          triggerClassName,
        )}
      >
        {label}
      </AriaButton>
      <MenuPopover data-menubar-popover="" isNonModal placement="bottom start">
        <div
          className="flex max-h-[inherit]"
          onKeyDown={(e) => {
            // Only from this menu's own items: submenus (portaled, but bubbling through React) handle ←/→ themselves.
            if (e.defaultPrevented || !e.currentTarget.contains(e.target as Node)) return
            if (e.key === "ArrowRight") move(id, 1)
            else if (e.key === "ArrowLeft") move(id, -1)
          }}
        >
          <Menu autoFocus="first" onClose={() => setOpenId(null)} {...props}>
            {children}
          </Menu>
        </div>
      </MenuPopover>
    </MenuTrigger>
  )
}

export { Menubar, MenubarMenu }
