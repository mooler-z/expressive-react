"use client"

import * as React from "react"
import { Dialog as AriaDialog, DialogTrigger, Link, Popover as AriaPopover } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Dialog, DialogActions, DialogBody, DialogHeadline, DialogIcon } from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Menu, MenuItem, MenuPopover, MenuSeparator, MenuTrigger } from "@/components/ui/menu"
import { Select, SelectItem } from "@/components/ui/select"
import { snackbar } from "@/components/ui/snackbar"
import { Switch } from "@/components/ui/switch"
import { TextField } from "@/components/ui/text-field"
import { useTheme } from "@/components/ui/theme-provider"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

import { AdminAccount } from "./admin-account"
import { AdminAnalytics } from "./admin-analytics"
import { AdminAudit } from "./admin-audit"
import { AdminCalendar } from "./admin-calendar"
import { AdminProvider, useAdmin } from "./admin-context"
import { AdminCustomer } from "./admin-customer"
import { AdminCustomers } from "./admin-customers"
import { NAV_GROUPS, PRIMARY_NAV, navOwner, type AdminPage, type NavItem } from "./admin-data"
import { AdminDevelopers } from "./admin-developers"
import { AdminInbox } from "./admin-inbox"
import { AdminIntegrations } from "./admin-integrations"
import { AdminInventory } from "./admin-inventory"
import { AdminInvoices } from "./admin-invoices"
import { AdminOrder } from "./admin-order"
import { AdminOrders } from "./admin-orders"
import { AdminOverview } from "./admin-overview"
import { AdminProducts } from "./admin-products"
import { AdminProjects } from "./admin-projects"
import { AdminReports } from "./admin-reports"
import { AdminSettings } from "./admin-settings"
import { AdminSupport } from "./admin-support"
import { AdminTeam } from "./admin-team"
import { AdminUsers } from "./admin-users"

/*
 * Admin portal · Kestrel (port of the kit's Admin Dashboard: 21 pages).
 * Adaptive navigation per M3 window size classes:
 *   compact  <600   navigation bar + "More" sheet, FAB for the page's primary action
 *   medium   600+   collapsed navigation rail (6 destinations)
 *   expanded 1200+  expanded rail with grouped destinations (toggle with the menu button)
 *
 * Routing-agnostic: every destination is an href built from `basePath`. Wrap it in React Aria's
 * <RouterProvider navigate={…}> for client-side navigation, and pass `navigate` for row clicks.
 */

const PAGES: Record<AdminPage, React.ComponentType> = {
  overview: AdminOverview,
  analytics: AdminAnalytics,
  users: AdminUsers,
  orders: AdminOrders,
  products: AdminProducts,
  settings: AdminSettings,
  customers: AdminCustomers,
  customer: AdminCustomer,
  order: AdminOrder,
  invoices: AdminInvoices,
  inventory: AdminInventory,
  reports: AdminReports,
  calendar: AdminCalendar,
  inbox: AdminInbox,
  support: AdminSupport,
  projects: AdminProjects,
  team: AdminTeam,
  integrations: AdminIntegrations,
  developers: AdminDevelopers,
  audit: AdminAudit,
  account: AdminAccount,
}

const SEARCH_PLACEHOLDER: Partial<Record<AdminPage, string>> = {
  users: "Search users",
  orders: "Search orders",
  products: "Search products",
  customers: "Search customers",
}

export interface AdminDashboardProps {
  /** Current page. */
  page?: AdminPage
  /** Detail id for the `customer` and `order` pages. */
  id?: string
  /** Prefix for every page URL (default "/admin"). */
  basePath?: string
  /** Imperative navigation for clickable rows (defaults to a full page load). */
  navigate?: (href: string) => void
  /** Optional "exit" link shown in the top bar, e.g. back to your docs or main app. */
  exitHref?: string
}

export function AdminDashboard({ page = "overview", id, basePath = "/admin", navigate, exitHref }: AdminDashboardProps) {
  return (
    <AdminProvider page={page} id={id} basePath={basePath} navigate={navigate}>
      <AdminShell exitHref={exitHref} />
    </AdminProvider>
  )
}

function AdminShell({ exitHref }: { exitHref?: string }) {
  const { page } = useAdmin()
  const medium = useMediaQuery("(min-width: 600px)", true)
  const large = useMediaQuery("(min-width: 1200px)", true)
  const [railPref, setRailPref] = React.useState<boolean | null>(null)
  const railExpanded = medium && (railPref ?? large)
  const [scrolled, setScrolled] = React.useState(false)
  const paneRef = React.useRef<HTMLDivElement>(null)
  const Page = PAGES[page] ?? AdminOverview

  // Reset scroll on page change; track scroll for the top bar (pane on medium+, window on compact).
  React.useEffect(() => {
    paneRef.current?.scrollTo({ top: 0 })
    window.scrollTo({ top: 0 })
    setScrolled(false)
  }, [page])
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="flex min-h-screen bg-surface font-sans text-on-surface md:h-screen md:overflow-hidden md:bg-surface-container">
      <Rail expanded={railExpanded} onToggle={() => setRailPref(!railExpanded)} />
      <div className="flex min-w-0 flex-1 flex-col md:py-3 md:pr-3">
        <div
          ref={paneRef}
          onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 8)}
          className="relative min-h-0 flex-1 bg-surface pb-24 md:overflow-y-auto md:rounded-xl md:pb-0"
        >
          <TopBar scrolled={scrolled} exitHref={exitHref} />
          <main key={page} className="animate-[m3-fade-up_.45s_cubic-bezier(.05,.7,.1,1)_backwards] px-4 pt-2 pb-10 md:px-6 lg:px-8">
            <Page />
          </main>
        </div>
      </div>
      <CompactNav />
      <AdminDialogs />
    </div>
  )
}

/* ---------- Rail ---------- */

function CreateMenu({ compact }: { compact?: boolean }) {
  const { openDialog } = useAdmin()
  return (
    <MenuTrigger>
      <Button
        variant="tonal"
        size="md"
        shape="square"
        aria-label="Create"
        className={cn("bg-primary-container text-on-primary-container shadow-1 data-hovered:shadow-2", compact ? "w-14 px-0" : "pr-5 pl-4")}
      >
        <Icon>add</Icon>
        {!compact && "Create"}
      </Button>
      <MenuPopover placement="bottom start">
        <Menu
          onAction={(k) => {
            if (k === "invite") openDialog("invite")
            else if (k === "product") openDialog("product")
            else snackbar("Draft order KS-10483 created", { action: { label: "Open", onAction: () => {} } })
          }}
        >
          <MenuItem id="invite" icon="person_add">
            Invite user
          </MenuItem>
          <MenuItem id="product" icon="add_box">
            New product
          </MenuItem>
          <MenuItem id="order" icon="receipt_long">
            New order
          </MenuItem>
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  )
}

function Brand({ short }: { short?: boolean }) {
  const { href } = useAdmin()
  return (
    <Link href={href("overview")} className="flex items-center gap-2 pl-1 outline-none data-focus-visible:underline">
      <span className="grid size-9 place-items-center rounded-md bg-primary text-on-primary">
        <Icon size={20} filled>
          flight_takeoff
        </Icon>
      </span>
      <span className="text-title-md font-semibold tracking-tight">
        Kestrel {!short && <span className="font-normal text-on-surface-variant">Admin</span>}
      </span>
    </Link>
  )
}

function Rail({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  const { page, href } = useAdmin()
  const owner = navOwner(page)
  return (
    <nav
      aria-label="Primary"
      className={cn(
        "no-scrollbar hidden shrink-0 flex-col overflow-y-auto pt-3 pb-6 transition-[width] duration-(--md-spring-default-spatial-duration) ease-default-spatial md:flex",
        expanded ? "w-[272px] px-3" : "w-24 items-center",
      )}
    >
      {expanded ? (
        <>
          <div className="flex h-14 items-center gap-1">
            <IconButton aria-label="Collapse navigation" onPress={onToggle} className="size-12">
              <Icon>menu_open</Icon>
            </IconButton>
            <Brand />
          </div>
          <div className="mt-3 self-start">
            <CreateMenu />
          </div>
          <div className="mt-4 flex flex-col">
            {NAV_GROUPS.map((g) => (
              <div key={g.name}>
                <div className="px-4 pt-4 pb-1 text-title-sm text-on-surface-variant">{g.name}</div>
                <div className="flex flex-col gap-0.5">
                  {g.items.map((it) => {
                    const on = owner === it.id
                    return (
                      <Link
                        key={it.id}
                        href={href(it.id)}
                        aria-current={on ? "page" : undefined}
                        className={cn(
                          "state-layer focus-ring flex h-12 items-center gap-3 rounded-full px-4 text-label-lg transition-colors duration-300",
                          on ? "bg-secondary-container font-semibold text-on-secondary-container" : "text-on-surface-variant",
                        )}
                      >
                        <Icon filled={on}>{it.icon}</Icon>
                        <span className="flex-1">{it.label}</span>
                        {it.badge && <span className="rounded-full bg-error px-1.5 text-label-md text-on-error">{it.badge}</span>}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          <span className="flex-1" />
          <div className="mt-6 rounded-lg bg-surface-container-high p-4">
            <div className="flex items-center gap-2 text-label-lg">
              <Icon size={20} className="text-primary">
                cloud_done
              </Icon>
              12 / 12 regions healthy
            </div>
            <div className="mt-3 flex h-1.5 items-center gap-1">
              <div className="h-full w-[92%] rounded-full bg-primary" />
              <div className="h-full flex-1 rounded-full bg-secondary-container" />
            </div>
            <div className="mt-2 text-body-sm text-on-surface-variant">92% of workload quota used</div>
          </div>
        </>
      ) : (
        <>
          <IconButton aria-label="Expand navigation" onPress={onToggle} className="size-12">
            <Icon>menu</Icon>
          </IconButton>
          <div className="mt-1">
            <CreateMenu compact />
          </div>
          <div className="mt-8 flex flex-col items-center gap-4">
            {PRIMARY_NAV.map((it) => (
              <RailItem key={it.id} item={it} active={owner === it.id} />
            ))}
            <button className="group flex w-20 flex-col items-center gap-1 text-label-md text-on-surface-variant outline-none" onClick={onToggle}>
              <span className="state-layer grid h-8 w-14 place-items-center rounded-full group-focus-visible:outline-3 group-focus-visible:outline-secondary">
                <Icon>more_horiz</Icon>
              </span>
              <span>More</span>
            </button>
          </div>
        </>
      )}
    </nav>
  )
}

/** Collapsed-rail / nav-bar destination: pill indicator that springs open when active. */
function RailItem({ item, active, className }: { item: NavItem; active: boolean; className?: string }) {
  const { href } = useAdmin()
  return (
    <Link
      href={href(item.id)}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex w-20 flex-col items-center gap-1 text-label-md outline-none",
        active ? "text-on-surface" : "text-on-surface-variant",
        className,
      )}
    >
      <span className="state-layer relative grid h-8 w-14 place-items-center rounded-full group-data-focus-visible:outline-3 group-data-focus-visible:outline-secondary">
        <span
          className={cn(
            "absolute inset-0 rounded-full bg-secondary-container transition-all duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
            active ? "scale-x-100 opacity-100" : "scale-x-50 opacity-0",
          )}
        />
        <Icon filled={active} className={cn("relative", active && "text-on-secondary-container")}>
          {item.icon}
        </Icon>
        {item.badge && (
          <span className="absolute -top-1 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-label-sm text-on-error">
            {item.badge}
          </span>
        )}
      </span>
      <span className={cn(active && "font-semibold")}>{item.label}</span>
    </Link>
  )
}

/* ---------- Top bar ---------- */

const NOTIFICATIONS = [
  ["order", "error", "bg-error-container text-on-error-container", "Invoice KS-10471 is overdue", "Cobalt Insurance · 3 days late"],
  ["users", "person_add", "bg-primary-container text-on-primary-container", "Hannah Kim accepted an invite", "Joined Meridian Health as Member"],
  ["analytics", "rocket_launch", "bg-tertiary-container text-on-tertiary-container", "checkout-api v4.2.0 rolled out", "3 regions · 0 errors"],
  ["products", "sell", "bg-secondary-container text-on-secondary-container", "Observe add-on hit 96 customers", "Up 14% this month"],
] as const

function TopBar({ scrolled, exitHref }: { scrolled: boolean; exitHref?: string }) {
  const { page, query, setQuery, href } = useAdmin()
  const { resolvedMode, setMode } = useTheme()
  const [unread, setUnread] = React.useState(4)
  const searchRef = React.useRef<HTMLInputElement>(null)

  // "/" focuses search, like the kit.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(t.tagName) && !t.isContentEditable) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center gap-1 px-2 transition-colors duration-300 ease-emphasized md:gap-2 md:px-4",
        scrolled ? "bg-surface-container" : "bg-surface",
      )}
    >
      <div className="shrink-0 pl-1 md:hidden">
        <Brand short />
      </div>
      <label className="hidden h-12 max-w-xl flex-1 items-center gap-2 rounded-full bg-surface-container-high pr-2 pl-4 text-on-surface-variant focus-within:ring-2 focus-within:ring-primary md:flex">
        <Icon size={20}>search</Icon>
        <input
          ref={searchRef}
          type="search"
          aria-label="Search"
          placeholder={SEARCH_PLACEHOLDER[page] ?? "Search users, orders, products"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-body-md text-on-surface outline-none placeholder:text-on-surface-variant"
        />
        <kbd className="rounded-xs border border-outline-variant px-1.5 font-mono text-label-sm">/</kbd>
      </label>
      <span className="flex-1" />

      <DialogTrigger>
        <span className="relative">
          <IconButton aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}>
            <Icon>notifications</Icon>
          </IconButton>
          {unread > 0 && (
            <span className="pointer-events-none absolute top-1 right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-label-sm text-on-error">
              {unread}
            </span>
          )}
        </span>
        <AriaPopover
          placement="bottom end"
          offset={8}
          className="w-[min(360px,calc(100vw-1rem))] overflow-hidden rounded-lg bg-surface-container text-on-surface shadow-2 outline-none data-entering:animate-[m3-pop_.25s_var(--md-easing-emphasized-decelerate)]"
        >
          <AriaDialog aria-label="Notifications" className="outline-none">
            {({ close }) => (
              <>
                <div className="flex items-center justify-between px-4 pt-3 pb-2">
                  <span className="text-title-md">Notifications</span>
                  <Button variant="text" size="xs" onPress={() => setUnread(0)}>
                    Mark all read
                  </Button>
                </div>
                <ul className="pb-2">
                  {NOTIFICATIONS.map(([to, icon, cls, title, sub]) => (
                    <li key={title}>
                      <Link
                        href={to === "order" ? href("order", "KS-10471") : href(to)}
                        onPress={close}
                        className="state-layer flex items-start gap-3 px-4 py-3 text-on-surface outline-none data-focus-visible:bg-on-surface/10"
                      >
                        <span className={cn("grid size-10 shrink-0 place-items-center rounded-full", cls)}>
                          <Icon size={20}>{icon}</Icon>
                        </span>
                        <span className="min-w-0">
                          <span className="block text-body-md">{title}</span>
                          <span className="block text-body-sm text-on-surface-variant">{sub}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </AriaDialog>
        </AriaPopover>
      </DialogTrigger>

      <IconButton aria-label="Toggle dark mode" onPress={() => setMode(resolvedMode === "dark" ? "light" : "dark")}>
        <Icon>{resolvedMode === "dark" ? "light_mode" : "dark_mode"}</Icon>
      </IconButton>
      <Link href={href("settings")} aria-label="Settings" className="state-layer focus-ring grid size-10 shrink-0 place-items-center rounded-full text-on-surface-variant md:hidden">
        <Icon>settings</Icon>
      </Link>
      {exitHref && (
        <Link href={exitHref} aria-label="Back to docs" className="state-layer focus-ring hidden size-10 shrink-0 place-items-center rounded-full text-on-surface-variant sm:grid">
          <Icon>widgets</Icon>
        </Link>
      )}

      <MenuTrigger>
        <IconButton aria-label="Account">
          <span className="grid size-8 place-items-center rounded-full bg-tertiary-container text-label-lg text-on-tertiary-container">ML</span>
        </IconButton>
        <MenuPopover placement="bottom end" className="w-64">
          <div className="flex items-center gap-3 px-4 py-2">
            <span className="grid size-10 place-items-center rounded-full bg-tertiary-container text-title-sm text-on-tertiary-container">ML</span>
            <div className="min-w-0">
              <div className="truncate text-title-sm">Maya Lindqvist</div>
              <div className="truncate text-body-sm text-on-surface-variant">maya@kestrel.io · Owner</div>
            </div>
          </div>
          <Menu aria-label="Account" onAction={(k) => k !== "settings" && k !== "account" && k !== "exit" && snackbar(String(k))}>
            <MenuItem id="account" icon="person" href={href("account")}>
              My account
            </MenuItem>
            <MenuItem id="settings" icon="settings" href={href("settings")}>
              Settings
            </MenuItem>
            <MenuItem id="Workspace switcher" icon="swap_horiz">
              Switch workspace
            </MenuItem>
            {exitHref && <MenuSeparator />}
            {exitHref && (
              <MenuItem id="exit" icon="widgets" href={exitHref}>
                Back to docs
              </MenuItem>
            )}
            <MenuItem id="Signed out (demo)" icon="logout">
              Sign out
            </MenuItem>
          </Menu>
        </MenuPopover>
      </MenuTrigger>
    </header>
  )
}

/* ---------- Compact: navigation bar, More sheet, FAB ---------- */

const FABS: Partial<Record<AdminPage, { dialog: "invite" | "product"; icon: string; label: string }>> = {
  users: { dialog: "invite", icon: "person_add", label: "Invite user" },
  products: { dialog: "product", icon: "add", label: "New product" },
}

function CompactNav() {
  const { page, href, openDialog } = useAdmin()
  const [more, setMore] = React.useState(false)
  const owner = navOwner(page)
  const fab = FABS[page]
  React.useEffect(() => setMore(false), [page])
  return (
    <>
      {fab && (
        <button
          aria-label={fab.label}
          onClick={() => openDialog(fab.dialog)}
          className="state-layer focus-ring fixed right-4 bottom-24 z-40 grid size-14 place-items-center rounded-lg bg-primary-container text-on-primary-container shadow-3 md:hidden"
        >
          <Icon>{fab.icon}</Icon>
        </button>
      )}
      <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-40 flex h-20 bg-surface-container px-1 pt-3 pb-4 md:hidden">
        {PRIMARY_NAV.slice(0, 4).map((it) => (
          <RailItem key={it.id} item={it} active={owner === it.id} className="w-auto min-w-0 flex-1" />
        ))}
        <button className="group flex min-w-0 flex-1 flex-col items-center gap-1 text-label-md text-on-surface-variant outline-none" onClick={() => setMore(true)}>
          <span className="state-layer grid h-8 w-14 place-items-center rounded-full group-focus-visible:outline-3 group-focus-visible:outline-secondary">
            <Icon>menu</Icon>
          </span>
          <span>More</span>
        </button>
      </nav>
      {more && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 animate-[m3-fade-in_.2s] bg-scrim/40" onClick={() => setMore(false)} />
          <div
            role="dialog"
            aria-label="All destinations"
            className="absolute inset-x-0 bottom-0 max-h-[80vh] animate-[m3-sheet-in-bottom_.4s_cubic-bezier(.05,.7,.1,1)] overflow-y-auto rounded-t-xl bg-surface-container-low pb-6"
          >
            <div className="mx-auto mt-3 h-1 w-8 rounded-full bg-on-surface-variant/40" />
            {NAV_GROUPS.map((g) => (
              <div key={g.name}>
                <div className="px-6 pt-4 pb-1 text-title-sm text-on-surface-variant">{g.name}</div>
                <div className="grid grid-cols-4 gap-1 px-3">
                  {g.items.map((it) => {
                    const on = owner === it.id
                    return (
                      <Link
                        key={it.id}
                        href={href(it.id)}
                        className={cn(
                          "state-layer focus-ring flex min-w-0 flex-col items-center gap-1 rounded-lg px-1 py-3 text-label-md",
                          on ? "font-semibold text-on-surface" : "text-on-surface-variant",
                        )}
                      >
                        <span className={cn("grid h-8 w-14 place-items-center rounded-full", on && "bg-secondary-container text-on-secondary-container")}>
                          <Icon filled={on}>{it.icon}</Icon>
                        </span>
                        <span className="w-full truncate text-center">{it.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

/* ---------- Dialogs ---------- */

function AdminDialogs() {
  const { dialog, openDialog } = useAdmin()
  const close = () => openDialog(null)
  return (
    <>
      <Dialog overlayProps={{ isOpen: dialog === "invite", onOpenChange: (o) => !o && close() }} modalClassName="max-w-md">
        <DialogIcon>person_add</DialogIcon>
        <DialogHeadline>Invite people</DialogHeadline>
        <DialogBody>They'll get an email with a link that expires in 7 days.</DialogBody>
        <div className="mt-5 grid gap-5">
          <TextField label="Email addresses" type="email" autoFocus />
          <Select label="Role" defaultSelectedKey="Member">
            {["Admin", "Member", "Billing", "Viewer"].map((r) => (
              <SelectItem key={r} id={r}>
                {r}
              </SelectItem>
            ))}
          </Select>
          <Select label="Workspace" defaultSelectedKey="Kestrel Ops">
            {["Kestrel Ops", "Kestrel Labs", "Halide Bank", "Meridian Health", "Northwind"].map((w) => (
              <SelectItem key={w} id={w}>
                {w}
              </SelectItem>
            ))}
          </Select>
        </div>
        <DialogActions>
          <Button variant="text" slot="close">
            Cancel
          </Button>
          <Button slot="close" onPress={() => snackbar("Invitation sent", { action: { label: "Undo", onAction: () => snackbar("Invitation withdrawn") } })}>
            Send invite
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog overlayProps={{ isOpen: dialog === "product", onOpenChange: (o) => !o && close() }} modalClassName="max-w-md">
        <DialogIcon>add_box</DialogIcon>
        <DialogHeadline>New product</DialogHeadline>
        <div className="mt-5 grid gap-5">
          <TextField label="Product name" autoFocus />
          <Select label="Category" defaultSelectedKey="Add-ons">
            {["Plans", "Add-ons", "Services"].map((c) => (
              <SelectItem key={c} id={c}>
                {c}
              </SelectItem>
            ))}
          </Select>
          <TextField label="Price" defaultValue="12" prefix="$" suffix="/seat/mo" inputMode="decimal" />
          <Switch defaultSelected className="flex w-full flex-row-reverse justify-between">
            Publish to catalog now
          </Switch>
        </div>
        <DialogActions>
          <Button variant="text" slot="close">
            Cancel
          </Button>
          <Button slot="close" onPress={() => snackbar("Product created as draft")}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
