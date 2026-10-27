"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Button as AriaButton, Link as AriaLink, composeRenderProps, type LinkProps as AriaLinkProps } from "react-aria-components"

import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

/*
 * Navigation menu · marketing-site header with flyout panels.
 * One panel open at a time; Escape, an outside press or following a link closes it.
 * Panels render into <NavigationMenuViewport> (a full-width mega-menu row) when present,
 * otherwise as a dropdown card under their trigger.
 *
 * <NavigationMenu>
 *   <NavigationMenuList>
 *     <NavigationMenuItem value="products">
 *       <NavigationMenuTrigger>Products</NavigationMenuTrigger>
 *       <NavigationMenuContent>
 *         <NavigationMenuPanelLink href="/grid" icon="grid_view" title="Kestrel Grid">One control plane</NavigationMenuPanelLink>
 *       </NavigationMenuContent>
 *     </NavigationMenuItem>
 *     <NavigationMenuItem><NavigationMenuLink href="/pricing">Pricing</NavigationMenuLink></NavigationMenuItem>
 *   </NavigationMenuList>
 *   <NavigationMenuViewport />
 * </NavigationMenu>
 */

interface NavigationMenuContextValue {
  value: string | null
  setValue: (value: string | null) => void
  viewport: HTMLElement | null
  setViewport: (el: HTMLElement | null) => void
  openOnHover: boolean
  baseId: string
}

const NavigationMenuContext = React.createContext<NavigationMenuContextValue | null>(null)
const ItemContext = React.createContext<string>("")

function useNavigationMenu() {
  const ctx = React.useContext(NavigationMenuContext)
  if (!ctx) throw new Error("NavigationMenu parts must be inside <NavigationMenu>")
  return ctx
}

export interface NavigationMenuProps extends React.HTMLAttributes<HTMLElement> {
  /** Open panels on hover as well as press. */
  openOnHover?: boolean
  value?: string | null
  onValueChange?: (value: string | null) => void
}

function NavigationMenu({ className, children, openOnHover = false, value: valueProp, onValueChange, ...props }: NavigationMenuProps) {
  const [inner, setInner] = React.useState<string | null>(null)
  const value = valueProp !== undefined ? valueProp : inner
  const setValue = React.useCallback(
    (v: string | null) => {
      setInner(v)
      onValueChange?.(v)
    },
    [onValueChange],
  )
  const [viewport, setViewport] = React.useState<HTMLElement | null>(null)
  const ref = React.useRef<HTMLElement>(null)
  const baseId = React.useId()

  React.useEffect(() => {
    if (!value) return
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setValue(null)
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      const trigger = ref.current?.querySelector<HTMLElement>(`[aria-expanded="true"]`)
      setValue(null)
      trigger?.focus()
    }
    document.addEventListener("pointerdown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [value, setValue])

  return (
    <NavigationMenuContext.Provider value={{ value, setValue, viewport, setViewport, openOnHover, baseId }}>
      <nav
        ref={ref}
        data-slot="navigation-menu"
        className={cn("relative", className)}
        onPointerLeave={() => openOnHover && setValue(null)}
        {...props}
      >
        {children}
      </nav>
    </NavigationMenuContext.Provider>
  )
}

function NavigationMenuList({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul data-slot="navigation-menu-list" className={cn("flex flex-wrap items-center gap-1", className)} {...props} />
}

function NavigationMenuItem({ value, className, ...props }: React.LiHTMLAttributes<HTMLLIElement> & { value?: string }) {
  const auto = React.useId()
  return (
    <ItemContext.Provider value={value ?? auto}>
      <li data-slot="navigation-menu-item" className={cn("relative", className)} {...props} />
    </ItemContext.Provider>
  )
}

function NavigationMenuTrigger({ className, children }: { className?: string; children: React.ReactNode }) {
  const { value, setValue, openOnHover, baseId } = useNavigationMenu()
  const item = React.useContext(ItemContext)
  const isOpen = value === item
  return (
    <AriaButton
      data-slot="navigation-menu-trigger"
      aria-expanded={isOpen}
      aria-controls={isOpen ? `${baseId}-${item}` : undefined}
      onPress={() => setValue(isOpen ? null : item)}
      onHoverStart={() => openOnHover && setValue(item)}
      className={cn(
        "group/trigger state-layer focus-ring inline-flex h-10 cursor-pointer items-center gap-1 rounded-full pr-3 pl-4 text-label-lg text-on-surface-variant",
        "aria-expanded:bg-secondary-container aria-expanded:text-on-secondary-container",
        className,
      )}
    >
      {children}
      <Icon
        size={20}
        className="transition-transform duration-(--md-spring-fast-spatial-duration) ease-fast-spatial group-aria-expanded/trigger:rotate-180"
      >
        expand_more
      </Icon>
    </AriaButton>
  )
}

function NavigationMenuContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const { value, setValue, viewport, baseId } = useNavigationMenu()
  const item = React.useContext(ItemContext)
  if (value !== item) return null

  const panel = (
    <div
      id={`${baseId}-${item}`}
      data-slot="navigation-menu-content"
      // Following any link inside closes the menu.
      onClick={(e) => (e.target as Element).closest("a") && setValue(null)}
      className={cn(
        viewport
          ? "m3-panel-enter"
          : "m3-menu-enter absolute top-full left-0 z-30 mt-2 min-w-72 origin-top-left rounded-lg bg-surface-container p-2 shadow-2",
        className,
      )}
    >
      {children}
    </div>
  )
  return viewport ? createPortal(panel, viewport) : panel
}

/** Full-width row the panels render into. Hidden while nothing is open. */
function NavigationMenuViewport({ className }: { className?: string }) {
  const { setViewport } = useNavigationMenu()
  return (
    <div
      ref={setViewport}
      data-slot="navigation-menu-viewport"
      className={cn("border-t border-outline-variant bg-surface-container empty:hidden", className)}
    />
  )
}

/** Top-level link in the row. */
function NavigationMenuLink({ className, ...props }: AriaLinkProps) {
  return (
    <AriaLink
      data-slot="navigation-menu-link"
      {...props}
      className={composeRenderProps(className, (className) =>
        cn(
          "state-layer focus-ring inline-flex h-10 cursor-pointer items-center rounded-full px-4 text-label-lg text-on-surface-variant",
          "data-current:text-primary",
          className,
        ),
      )}
    />
  )
}

export interface NavigationMenuPanelLinkProps extends Omit<AriaLinkProps, "children"> {
  icon?: string
  title: React.ReactNode
  children?: React.ReactNode
}

/** Icon + title + one line of description, for use inside a panel. */
function NavigationMenuPanelLink({ className, icon, title, children, ...props }: NavigationMenuPanelLinkProps) {
  return (
    <AriaLink
      data-slot="navigation-menu-panel-link"
      {...props}
      className={composeRenderProps(className, (className) =>
        cn("state-layer focus-ring flex cursor-pointer items-start gap-3 rounded-md p-3 text-on-surface", className),
      )}
    >
      {icon && <Icon className="text-primary">{icon}</Icon>}
      <span className="min-w-0">
        <span className="block text-title-sm">{title}</span>
        {children && <span className="block text-body-sm text-on-surface-variant">{children}</span>}
      </span>
    </AriaLink>
  )
}

/** Small uppercase heading above a group of panel links. */
function NavigationMenuGroupLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="navigation-menu-group-label"
      className={cn("px-3 pb-2 text-label-md tracking-wider text-on-surface-variant uppercase", className)}
      {...props}
    />
  )
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuGroupLabel,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPanelLink,
  NavigationMenuTrigger,
  NavigationMenuViewport,
}
