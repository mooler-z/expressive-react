"use client"

import * as React from "react"
import {
  Breadcrumb as AriaBreadcrumb,
  Breadcrumbs as AriaBreadcrumbs,
  Button as AriaButton,
  Link as AriaLink,
  type BreadcrumbProps as AriaBreadcrumbProps,
  type BreadcrumbsProps as AriaBreadcrumbsProps,
  type Key,
  type LinkProps as AriaLinkProps,
} from "react-aria-components"

import { Icon } from "@/components/ui/icon"
import { Menu, MenuItem, MenuPopover, MenuTrigger } from "@/components/ui/menu"
import { Ripple } from "@/components/ui/ripple"
import { cn, composeTailwindRenderProps, tv } from "@/lib/utils"

/*
 * Breadcrumb · built from M3 parts (no M3 spec component)
 * label-large links on 32dp full-radius state layers, chevron (or slash) separators.
 * The current page is a secondary-container pill (`current="tonal"`) or plain on-surface text.
 * Collapse the middle of a deep path into <BreadcrumbMenu> (icon button + menu).
 */

type Separator = "chevron" | "slash" | React.ReactNode

interface BreadcrumbsContextValue {
  separator: Separator
  current: "tonal" | "plain"
  size: "md" | "sm"
}

const BreadcrumbsContext = React.createContext<BreadcrumbsContextValue>({ separator: "chevron", current: "tonal", size: "md" })

export interface BreadcrumbsProps<T> extends AriaBreadcrumbsProps<T> {
  separator?: Separator
  /** How the current (last) crumb is drawn. */
  current?: "tonal" | "plain"
  /** `sm`: 28dp crumbs with label-medium text. */
  size?: "md" | "sm"
}

function Breadcrumbs<T extends object>({ separator = "chevron", current = "tonal", size = "md", className, ...props }: BreadcrumbsProps<T>) {
  const ctx = React.useMemo(() => ({ separator, current, size }), [separator, current, size])
  return (
    <BreadcrumbsContext.Provider value={ctx}>
      <AriaBreadcrumbs
        data-slot="breadcrumbs"
        {...props}
        className={cn("flex min-w-0 flex-wrap items-center gap-1 text-on-surface-variant", className)}
      />
    </BreadcrumbsContext.Provider>
  )
}

function BreadcrumbSeparator() {
  const { separator, size } = React.useContext(BreadcrumbsContext)
  if (separator === "chevron") return <Icon size={size === "sm" ? 16 : 18} className="shrink-0 rtl:rotate-180">chevron_right</Icon>
  if (separator === "slash") return <span aria-hidden className="px-0.5 text-on-surface-variant/60">/</span>
  return <span aria-hidden>{separator}</span>
}

const crumbVariants = tv({
  base: [
    "state-layer focus-ring relative inline-flex min-w-0 cursor-pointer items-center gap-1 rounded-full outline-none",
    "data-disabled:cursor-default data-current:cursor-default",
  ],
  variants: {
    size: {
      md: "h-8 px-2 text-label-lg [--icon-size:18px]",
      sm: "h-7 px-2 text-label-md [--icon-size:16px]",
    },
    current: {
      tonal: "data-current:bg-secondary-container data-current:px-3 data-current:text-on-secondary-container",
      plain: "data-current:text-on-surface",
    },
  },
})

export interface BreadcrumbProps extends Omit<AriaBreadcrumbProps, "children"> {
  /** Link target. The last crumb is the current page and isn't a link. */
  href?: string
  icon?: string
  children: React.ReactNode
  /** Props for the inner link (e.g. `target`, `routerOptions`). */
  linkProps?: Omit<AriaLinkProps, "href" | "children" | "className">
  className?: string
}

function Breadcrumb({ href, icon, children, linkProps, className, ...props }: BreadcrumbProps) {
  const ctx = React.useContext(BreadcrumbsContext)
  return (
    <AriaBreadcrumb data-slot="breadcrumb" {...props} className={cn("flex min-w-0 items-center gap-1", className)}>
      {({ isCurrent }) => (
        <>
          <AriaLink href={href} {...linkProps} className={crumbVariants({ size: ctx.size, current: ctx.current })}>
            {icon && <Icon>{icon}</Icon>}
            <span className="truncate">{children}</span>
            {!isCurrent && <Ripple />}
          </AriaLink>
          {!isCurrent && <BreadcrumbSeparator />}
        </>
      )}
    </AriaBreadcrumb>
  )
}

export interface BreadcrumbMenuItem {
  id?: Key
  label: string
  href?: string
}

export interface BreadcrumbMenuProps extends Omit<AriaBreadcrumbProps, "children"> {
  /** The collapsed crumbs, in path order. */
  items: BreadcrumbMenuItem[]
  onAction?: (item: BreadcrumbMenuItem) => void
  "aria-label"?: string
}

/** A collapsed run of crumbs behind a ⋯ icon button that opens a menu. */
function BreadcrumbMenu({ items, onAction, "aria-label": ariaLabel = "Show path", className, ...props }: BreadcrumbMenuProps) {
  const { size } = React.useContext(BreadcrumbsContext)
  return (
    <AriaBreadcrumb data-slot="breadcrumb-menu" {...props} className={composeTailwindRenderProps(className, "flex items-center gap-1")}>
      <MenuTrigger>
        <AriaButton
          aria-label={ariaLabel}
          className={cn(
            "state-layer focus-ring relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full",
            size === "sm" ? "size-7" : "size-8",
          )}
        >
          <Icon size={20}>more_horiz</Icon>
          <Ripple />
        </AriaButton>
        <MenuPopover placement="bottom start">
          <Menu
            aria-label={ariaLabel}
            className="min-w-48"
            onAction={(key) => {
              const item = items.find((it, i) => (it.id ?? i) === key)
              if (item) onAction?.(item)
            }}
          >
            {items.map((it, i) => (
              <MenuItem key={String(it.id ?? i)} id={it.id ?? i} href={it.href}>
                {it.label}
              </MenuItem>
            ))}
          </Menu>
        </MenuPopover>
      </MenuTrigger>
      <BreadcrumbSeparator />
    </AriaBreadcrumb>
  )
}

/** Compact "back" crumb for narrow layouts: arrow + parent label. */
function BreadcrumbBack({ href, onPress, children, className }: { href?: string; onPress?: () => void; children: React.ReactNode; className?: string }) {
  const cls = cn(
    "state-layer focus-ring relative inline-flex h-8 min-w-0 cursor-pointer items-center gap-1 rounded-full ps-1 pe-3 text-label-lg text-on-surface-variant",
    className,
  )
  const content = (
    <>
      <Icon size={20} className="rtl:rotate-180">arrow_back</Icon>
      <span className="truncate">{children}</span>
      <Ripple />
    </>
  )
  return href ? (
    <AriaLink href={href} onPress={onPress} className={cls}>
      {content}
    </AriaLink>
  ) : (
    <AriaButton onPress={onPress} className={cls}>
      {content}
    </AriaButton>
  )
}

export { Breadcrumb, BreadcrumbBack, BreadcrumbMenu, Breadcrumbs }
