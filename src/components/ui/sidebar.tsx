"use client"

import * as React from "react"
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  Disclosure,
  DisclosurePanel,
  Heading,
  Link as AriaLink,
  Modal,
  ModalOverlay,
  type PressEvent,
} from "react-aria-components"

import { Badge, BadgeAnchor } from "@/components/ui/badge"
import { Icon } from "@/components/ui/icon"
import { Menu, MenuItem, MenuPopover, MenuTrigger } from "@/components/ui/menu"
import { Ripple } from "@/components/ui/ripple"
import { useWindowSizeClass } from "@/hooks/use-window-size-class"
import { cn, tv } from "@/lib/utils"

/*
 * Sidebar · a product sidebar composed from the M3 navigation drawer and rail
 *   full   300dp drawer-style column: 48dp full-radius items, title-small group labels, collapsible sections
 *   rail   96dp navigation rail: 32×56 indicator, label-medium label below; sections open as menus
 *   modal  the full sidebar as a modal drawer behind <SidebarTrigger> (scrim, Esc, closes on selection)
 * mode="auto" follows the M3 window size classes:  compact → modal · medium/expanded → rail · large+ → full.
 * <SidebarTrigger> toggles full ⇄ rail on larger windows and opens the drawer on compact ones.
 */

export type SidebarMode = "full" | "rail" | "modal"

interface SidebarState {
  mode: SidebarMode
  /** User collapsed the full sidebar to a rail (ignored in modal mode). */
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  toggle: () => void
}

const SidebarStateContext = React.createContext<SidebarState | null>(null)

/** Sidebar state: resolved `mode`, `collapsed`, `openMobile`, `toggle()`. */
function useSidebar() {
  const ctx = React.useContext(SidebarStateContext)
  if (!ctx) throw new Error("useSidebar must be used inside <SidebarProvider>")
  return ctx
}

export interface SidebarProviderProps {
  children: React.ReactNode
  /** `auto` adapts to the window size class. */
  mode?: "auto" | SidebarMode
  defaultCollapsed?: boolean
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

function SidebarProvider({ children, mode: modeProp = "auto", defaultCollapsed = false, collapsed: collapsedProp, onCollapsedChange }: SidebarProviderProps) {
  const size = useWindowSizeClass("large")
  const [innerCollapsed, setInnerCollapsed] = React.useState(defaultCollapsed)
  const [openMobile, setOpenMobile] = React.useState(false)
  const collapsed = collapsedProp ?? innerCollapsed
  const setCollapsed = React.useCallback(
    (c: boolean) => {
      setInnerCollapsed(c)
      onCollapsedChange?.(c)
    },
    [onCollapsedChange],
  )
  const auto: SidebarMode = size === "compact" ? "modal" : size === "medium" || size === "expanded" ? "rail" : "full"
  const base = modeProp === "auto" ? auto : modeProp
  const mode: SidebarMode = base === "full" && collapsed ? "rail" : base
  const value = React.useMemo<SidebarState>(
    () => ({
      mode,
      collapsed,
      setCollapsed,
      openMobile,
      setOpenMobile,
      toggle: () => (base === "modal" ? setOpenMobile((o) => !o) : setCollapsed(!collapsed)),
    }),
    [mode, base, collapsed, setCollapsed, openMobile],
  )
  return <SidebarStateContext.Provider value={value}>{children}</SidebarStateContext.Provider>
}

interface SidebarNavContextValue {
  value?: string
  onValueChange?: (value: string) => void
  /** Layout the items render in (modal copies render "full"). */
  layout: "full" | "rail"
  level: number
  onSelected?: () => void
}

const SidebarNavContext = React.createContext<SidebarNavContextValue>({ layout: "full", level: 0 })

const sidebarVariants = tv({
  base: [
    "group/sidebar flex h-full shrink-0 flex-col overflow-hidden text-on-surface-variant",
    "transition-[width] duration-(--md-spring-default-spatial-duration) ease-default-spatial motion-reduce:transition-none",
    "[--nav-indicator:var(--md-secondary-container)] [--nav-on-indicator:var(--md-on-secondary-container)] [--nav-active-label:var(--md-secondary)]",
  ],
  variants: {
    layout: {
      full: "w-(--sidebar-width,300px)",
      rail: "w-24 items-stretch",
    },
    surface: {
      low: "bg-surface-container-low",
      surface: "bg-surface",
      transparent: "",
    },
  },
  defaultVariants: { layout: "full", surface: "low" },
})

export interface SidebarProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  surface?: "low" | "surface" | "transparent"
}

function Sidebar({ value: valueProp, defaultValue, onValueChange, surface, className, children, "aria-label": ariaLabel = "Main", ...props }: SidebarProps) {
  const state = useSidebar()
  const [inner, setInner] = React.useState(defaultValue)
  const value = valueProp ?? inner
  const select = React.useCallback(
    (v: string) => {
      setInner(v)
      onValueChange?.(v)
    },
    [onValueChange],
  )
  const inline = React.useMemo<SidebarNavContextValue>(
    () => ({ value, onValueChange: select, layout: state.mode === "rail" ? "rail" : "full", level: 0 }),
    [value, select, state.mode],
  )
  const floating = React.useMemo<SidebarNavContextValue>(
    () => ({ value, onValueChange: select, layout: "full", level: 0, onSelected: () => state.setOpenMobile(false) }),
    [value, select, state],
  )

  if (state.mode === "modal") {
    return (
      <ModalOverlay
        isDismissable
        isOpen={state.openMobile}
        onOpenChange={state.setOpenMobile}
        className={cn(
          "fixed inset-0 z-50 bg-scrim/32",
          "data-entering:animate-[m3-fade-in_200ms_var(--md-easing-standard)] data-exiting:animate-[m3-fade-out_200ms_var(--md-easing-standard)]",
        )}
      >
        <Modal
          className={cn(
            "fixed inset-y-0 start-0 h-full max-w-[calc(100vw-56px)] outline-none",
            "data-entering:animate-[m3-rail-in_var(--md-spring-default-spatial-duration)_var(--md-spring-default-spatial)] data-exiting:animate-[m3-rail-out_200ms_var(--md-easing-emphasized-accelerate)]",
          )}
        >
          <AriaDialog aria-label={ariaLabel} className="h-full outline-none">
            <SidebarNavContext.Provider value={floating}>
              <nav
                data-slot="sidebar"
                data-mode="full"
                aria-label={ariaLabel}
                className={sidebarVariants({ layout: "full", surface: "low", className: cn("rounded-e-lg shadow-1", className) })}
                {...props}
              >
                {children}
              </nav>
            </SidebarNavContext.Provider>
          </AriaDialog>
        </Modal>
      </ModalOverlay>
    )
  }

  return (
    <SidebarNavContext.Provider value={inline}>
      <nav
        data-slot="sidebar"
        data-mode={inline.layout}
        aria-label={ariaLabel}
        className={sidebarVariants({ layout: inline.layout, surface, className })}
        {...props}
      >
        {children}
      </nav>
    </SidebarNavContext.Provider>
  )
}

/** Top area (workspace switcher, search). */
function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex shrink-0 flex-col gap-2 p-3 group-data-[mode=rail]/sidebar:items-center group-data-[mode=rail]/sidebar:px-0", className)}
      {...props}
    />
  )
}

/** Scrolling list of groups and items. */
function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn(
        "relative flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-3 pb-3",
        "group-data-[mode=rail]/sidebar:gap-1 group-data-[mode=rail]/sidebar:px-0 group-data-[mode=rail]/sidebar:no-scrollbar",
        className,
      )}
      {...props}
    />
  )
}

/** Bottom area (user menu). Gets a divider above it. */
function SidebarFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("flex shrink-0 flex-col gap-1 border-t border-outline-variant p-3 group-data-[mode=rail]/sidebar:items-center group-data-[mode=rail]/sidebar:px-0", className)}
      {...props}
    />
  )
}

function SidebarSeparator({ className }: { className?: string }) {
  return <hr className={cn("mx-4 my-2 shrink-0 border-0 border-t border-outline-variant group-data-[mode=rail]/sidebar:mx-auto group-data-[mode=rail]/sidebar:w-8", className)} />
}

/** Labelled group. In rail mode the label collapses to a short divider. */
function SidebarGroup({ label, className, children }: { label?: React.ReactNode; className?: string; children: React.ReactNode }) {
  const { layout } = React.useContext(SidebarNavContext)
  return (
    <div role="group" aria-label={typeof label === "string" ? label : undefined} data-slot="sidebar-group" className={cn("flex shrink-0 flex-col gap-0.5", layout === "rail" && "gap-1", className)}>
      {label &&
        (layout === "full" ? (
          <div className="flex h-10 shrink-0 items-end px-4 pb-1 text-title-sm text-on-surface-variant">{label}</div>
        ) : (
          <div aria-hidden className="mx-auto my-1 h-px w-8 bg-outline-variant" />
        ))}
      {children}
    </div>
  )
}

const itemVariants = tv({
  slots: {
    root: "group relative flex shrink-0 cursor-pointer outline-none select-none data-disabled:cursor-default data-disabled:opacity-38",
    railIndicator: "relative isolate grid h-8 w-14 shrink-0 place-items-center",
    pill: [
      "absolute inset-0 -z-10 scale-x-[.32] rounded-full bg-(--nav-indicator) opacity-0",
      "transition-[scale,opacity] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
      "group-data-active:scale-x-100 group-data-active:opacity-100",
    ],
    layer: [
      "pointer-events-none absolute inset-0 rounded-full bg-current opacity-0 transition-opacity duration-150",
      "group-data-hovered:opacity-8 group-data-focus-visible:opacity-10 group-data-pressed:opacity-12",
      "group-data-focus-visible:outline-3 group-data-focus-visible:outline-offset-2 group-data-focus-visible:outline-secondary",
    ],
  },
  variants: {
    layout: {
      full: {
        root: [
          "state-layer focus-ring h-12 w-full items-center gap-3 rounded-full pe-4 text-start text-label-lg",
          "data-hovered:text-on-surface data-active:bg-(--nav-indicator) data-active:font-semibold data-active:text-(--nav-on-indicator)",
        ],
      },
      rail: { root: "w-full flex-col items-center gap-1 py-1 text-label-md" },
    },
    level: { 0: { root: "" }, 1: { root: "" } },
  },
  compoundVariants: [
    { layout: "full", level: 0, class: { root: "ps-4" } },
    { layout: "full", level: 1, class: { root: "h-11 ps-12" } },
  ],
  defaultVariants: { layout: "full", level: 0 },
})

const badgeTones = {
  primary: "bg-primary text-on-primary",
  error: "bg-error text-on-error",
  plain: "bg-transparent text-current px-0",
} as const

export interface SidebarItemProps {
  value?: string
  icon?: string
  /** Leading content instead of an icon (a color dot, avatar). */
  leading?: React.ReactNode
  label: React.ReactNode
  /** Count / short text, or `true` for a dot. */
  badge?: number | string | boolean
  badgeTone?: keyof typeof badgeTones
  badgeLabel?: string
  href?: string
  isActive?: boolean
  isDisabled?: boolean
  onPress?: (e: PressEvent) => void
  className?: string
}

function SidebarItem({
  value,
  icon,
  leading,
  label,
  badge,
  badgeTone = "primary",
  badgeLabel,
  href,
  isActive: isActiveProp,
  isDisabled,
  onPress,
  className,
}: SidebarItemProps) {
  const ctx = React.useContext(SidebarNavContext)
  const isActive = isActiveProp ?? (value !== undefined && ctx.value === value)
  const level = (ctx.level > 0 ? 1 : 0) as 0 | 1
  const s = itemVariants({ layout: ctx.layout, level })
  const count = typeof badge === "boolean" ? undefined : badge
  const glyph = icon ? (
    <Icon filled={isActive} className="transition-[--icon-fill] duration-(--md-spring-default-effects-duration)">
      {icon}
    </Icon>
  ) : (
    leading ?? <Icon>circle</Icon>
  )

  const content =
    ctx.layout === "rail" ? (
      <>
        <span className={s.railIndicator()}>
          <span aria-hidden className={s.pill()} />
          <BadgeAnchor count={count} dot={badge === true} badgeLabel={badgeLabel} className="group-data-active:text-(--nav-on-indicator)">
            {glyph}
          </BadgeAnchor>
          <span aria-hidden className={s.layer()} />
          <Ripple />
        </span>
        <span className="max-w-full truncate px-1 group-data-active:font-semibold group-data-active:text-(--nav-active-label)">{label}</span>
      </>
    ) : (
      <>
        {icon || leading ? glyph : null}
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {badge === true ? (
          <Badge aria-label={badgeLabel} className={badgeTone === "primary" ? "bg-primary" : undefined} />
        ) : count !== undefined && badge !== false ? (
          <span
            aria-label={badgeLabel}
            className={cn("inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-label-sm tabular-nums", badgeTones[badgeTone])}
          >
            {count}
          </span>
        ) : null}
        <Ripple />
      </>
    )

  const shared = {
    "data-slot": "sidebar-item",
    "data-active": isActive || undefined,
    "aria-current": isActive ? ("page" as const) : undefined,
    isDisabled,
    className: s.root({ className }),
    onPress: (e: PressEvent) => {
      if (value !== undefined) ctx.onValueChange?.(value)
      ctx.onSelected?.()
      onPress?.(e)
    },
  }
  return href ? (
    <AriaLink href={href} {...shared}>
      {content}
    </AriaLink>
  ) : (
    <AriaButton {...shared}>{content}</AriaButton>
  )
}

export interface SidebarSubmenuProps {
  title: string
  /** Shown in rail mode (and beside the title when given). */
  icon?: string
  defaultExpanded?: boolean
  /** `SidebarItem`s. */
  children: React.ReactNode
  className?: string
}

/** Collapsible section of nested items. In rail mode it becomes an item that opens a menu. */
function SidebarSubmenu({ title, icon = "folder", defaultExpanded, children, className }: SidebarSubmenuProps) {
  const ctx = React.useContext(SidebarNavContext)
  const nested = React.useMemo(() => ({ ...ctx, level: ctx.level + 1 }), [ctx])
  const items = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement<SidebarItemProps>[]
  const anyActive = items.some((el) => el.props.isActive ?? (el.props.value !== undefined && el.props.value === ctx.value))

  if (ctx.layout === "rail") {
    const s = itemVariants({ layout: "rail" })
    return (
      <MenuTrigger>
        <AriaButton data-active={anyActive || undefined} className={s.root({ className })} aria-label={title}>
          <span className={s.railIndicator()}>
            <span aria-hidden className={s.pill()} />
            <Icon className="group-data-active:text-(--nav-on-indicator)">{icon}</Icon>
            <span aria-hidden className={s.layer()} />
            <Ripple />
          </span>
          <span className="max-w-full truncate px-1 group-data-active:font-semibold group-data-active:text-(--nav-active-label)">{title}</span>
        </AriaButton>
        <MenuPopover placement="end top">
          <Menu
            aria-label={title}
            className="min-w-48"
            onAction={(key) => {
              const el = items.find((it, i) => (it.props.value ?? String(i)) === key)
              if (el?.props.value !== undefined) ctx.onValueChange?.(el.props.value)
              el?.props.onPress?.({} as PressEvent)
            }}
          >
            {items.map((el, i) => (
              <MenuItem key={el.props.value ?? i} id={el.props.value ?? String(i)} href={el.props.href} icon={el.props.icon} leading={el.props.leading}>
                {el.props.label}
              </MenuItem>
            ))}
          </Menu>
        </MenuPopover>
      </MenuTrigger>
    )
  }

  return (
    <Disclosure defaultExpanded={defaultExpanded ?? anyActive} className={cn("group/submenu flex shrink-0 flex-col gap-0.5", className)}>
      <Heading className="contents">
        <AriaButton
          slot="trigger"
          className="state-layer focus-ring relative flex h-12 w-full shrink-0 cursor-pointer items-center gap-3 rounded-full ps-4 pe-4 text-start text-title-sm outline-none"
        >
          <span className="min-w-0 flex-1 truncate">{title}</span>
          <Icon size={20} className="transition-transform duration-(--md-spring-fast-spatial-duration) ease-fast-spatial group-data-expanded/submenu:rotate-180">
            expand_more
          </Icon>
          <Ripple />
        </AriaButton>
      </Heading>
      <DisclosurePanel className="h-(--disclosure-panel-height) overflow-clip transition-[height] duration-(--md-spring-default-spatial-duration) ease-default-spatial motion-reduce:transition-none">
        <div className="flex flex-col gap-0.5">
          <SidebarNavContext.Provider value={nested}>{children}</SidebarNavContext.Provider>
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}

export interface SidebarMenuButtonProps extends Omit<React.ComponentProps<typeof AriaButton>, "children" | "className"> {
  /** Avatar / logo. The only part shown in rail mode. */
  leading: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  /** Defaults to an unfold icon. Pass `null` for none. */
  trailing?: React.ReactNode
  className?: string
}

/** Header/footer row (workspace switcher, account) that usually opens a menu. Wrap it in a MenuTrigger. */
function SidebarMenuButton({ leading, title, subtitle, trailing, className, ...props }: SidebarMenuButtonProps) {
  const { layout } = React.useContext(SidebarNavContext)
  return (
    <AriaButton
      {...props}
      aria-label={layout === "rail" && typeof title === "string" ? title : props["aria-label"]}
      className={cn(
        "state-layer focus-ring relative flex shrink-0 cursor-pointer items-center gap-3 text-start text-on-surface outline-none",
        layout === "rail" ? "size-14 justify-center rounded-lg" : "h-14 w-full rounded-lg px-3",
        className,
      )}
    >
      {leading}
      {layout === "full" && (
        <>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-title-sm">{title}</span>
            {subtitle && <span className="block truncate text-body-sm text-on-surface-variant">{subtitle}</span>}
          </span>
          {trailing === undefined ? <Icon className="text-on-surface-variant">unfold_more</Icon> : trailing}
        </>
      )}
      <Ripple />
    </AriaButton>
  )
}

/** Menu icon button: full ⇄ rail on larger windows, opens the drawer on compact ones. */
function SidebarTrigger({ className, "aria-label": ariaLabel }: { className?: string; "aria-label"?: string }) {
  const state = useSidebar()
  const label = ariaLabel ?? (state.mode === "modal" ? "Open navigation" : state.collapsed ? "Expand sidebar" : "Collapse sidebar")
  return (
    <AriaButton
      aria-label={label}
      aria-expanded={state.mode === "modal" ? state.openMobile : !state.collapsed}
      onPress={state.toggle}
      className={cn("state-layer focus-ring relative inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-on-surface-variant", className)}
    >
      <Icon>{state.mode === "full" ? "menu_open" : "menu"}</Icon>
      <Ripple />
    </AriaButton>
  )
}

/** Main content area next to the sidebar. */
function SidebarInset({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="sidebar-inset" className={cn("flex min-w-0 flex-1 flex-col", className)} {...props} />
}

/** Show children only in the full (not rail) layout — e.g. a search field or a promo card. */
function SidebarFullOnly({ children }: { children: React.ReactNode }) {
  const { layout } = React.useContext(SidebarNavContext)
  return layout === "full" ? <>{children}</> : null
}

/** Show children only in the rail layout — e.g. a search icon button in place of the search field. */
function SidebarRailOnly({ children }: { children: React.ReactNode }) {
  const { layout } = React.useContext(SidebarNavContext)
  return layout === "rail" ? <>{children}</> : null
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarFullOnly,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRailOnly,
  SidebarSeparator,
  SidebarSubmenu,
  SidebarTrigger,
  sidebarVariants,
  useSidebar,
}
