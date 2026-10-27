"use client"

import * as React from "react"

import { StatusBadge } from "@/components/ui/badge"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Menu, MenuItem, MenuPopover, MenuSeparator, MenuTrigger } from "@/components/ui/menu"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * Small building blocks shared by the admin's detail pages (customer, order, invoices, inventory,
 * reports, calendar, inbox). Everything here is plain React state on top of the Expressive components.
 */

/** Snackbar with an optional action. `onAction` defaults to a confirmation snackbar. */
export function notify(message: React.ReactNode, action?: string, onAction?: () => void) {
  snackbar(message, action ? { action: { label: action, onAction: onAction ?? (() => snackbar("Done")) } } : undefined)
}

export type Tone = "primary" | "secondary" | "tertiary" | "error" | "neutral"

const TONE_BADGE = {
  primary: "primary-container",
  secondary: "secondary",
  tertiary: "tertiary",
  error: "error",
  neutral: "neutral",
} as const

/** Status tag: 24dp, small corners, tonal role colors. */
export function TonePill({ tone, children, className }: { tone: Tone; children: React.ReactNode; className?: string }) {
  return (
    <StatusBadge size="md" variant={TONE_BADGE[tone]} className={cn("text-label-sm", className)}>
      {children}
    </StatusBadge>
  )
}

/** Container classes per tone, for icon tiles and calendar events. */
export const TONE_FILL: Record<Tone | "solid", string> = {
  solid: "bg-primary text-on-primary",
  primary: "bg-primary-container text-on-primary-container",
  secondary: "bg-secondary-container text-on-secondary-container",
  tertiary: "bg-tertiary-container text-on-tertiary-container",
  error: "bg-error-container text-on-error-container",
  neutral: "bg-surface-container-highest text-on-surface-variant",
}

export interface AsyncButtonProps extends Omit<ButtonProps, "children" | "isPending" | "onPress"> {
  children: React.ReactNode
  /** Leading icon while idle. */
  icon?: string
  /** Label while running, e.g. "Saving…". */
  busy: string
  /** Label shown briefly once finished, e.g. "Saved". */
  done: string
  /** The work. Defaults to a short simulated delay. */
  action?: () => Promise<unknown>
  onDone?: () => void
}

/** Runs an async action: idle → pending (loading indicator + busy label) → done (check + done label) → idle. */
export function AsyncButton({ children, icon, busy, done, action, onDone, ...props }: AsyncButtonProps) {
  const [state, setState] = React.useState<"idle" | "busy" | "done">("idle")
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  React.useEffect(() => () => clearTimeout(timer.current), [])

  const run = async () => {
    setState("busy")
    await (action ? action() : new Promise((r) => setTimeout(r, 1200)))
    setState("done")
    onDone?.()
    timer.current = setTimeout(() => setState("idle"), 1800)
  }

  return (
    <Button {...props} isPending={state === "busy"} onPress={run}>
      {state === "done" ? <Icon>check</Icon> : state === "idle" && icon ? <Icon>{icon}</Icon> : null}
      <span aria-live="polite">{state === "busy" ? busy : state === "done" ? done : children}</span>
    </Button>
  )
}

export type ActionItem =
  | {
      id: string
      label: string
      icon?: string
      danger?: boolean
      /** Defaults to a snackbar with the label. */
      onAction?: () => void
    }
  | "separator"

/** ⋮ icon button with a menu of actions. */
export function ActionMenu({ label = "More actions", items, className }: { label?: string; items: ActionItem[]; className?: string }) {
  const byId = new Map(items.flatMap((i) => (i === "separator" ? [] : [[i.id, i] as const])))
  return (
    <MenuTrigger>
      <IconButton aria-label={label} className={className}>
        <Icon size={20}>more_vert</Icon>
      </IconButton>
      <MenuPopover placement="bottom end">
        <Menu
          aria-label={label}
          onAction={(key) => {
            const item = byId.get(String(key))
            if (item) (item.onAction ?? (() => notify(item.label)))()
          }}
        >
          {items.map((i, n) =>
            i === "separator" ? (
              <MenuSeparator key={`sep-${n}`} />
            ) : (
              <MenuItem key={i.id} id={i.id} icon={i.icon} className={i.danger ? "text-error [&_[data-slot=icon]]:text-error" : undefined}>
                {i.label}
              </MenuItem>
            ),
          )}
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  )
}

/** KPI tile: label, big value, supporting line, icon chip. */
export function StatTile({
  label,
  value,
  sub,
  icon,
  className,
  subClassName = "text-on-surface-variant",
}: {
  label: React.ReactNode
  value: React.ReactNode
  sub?: React.ReactNode
  icon: string
  className?: string
  subClassName?: string
}) {
  return (
    <div className={cn("flex min-w-0 items-start gap-4 rounded-xl bg-surface-container-low p-5", className)}>
      <div className="min-w-0 flex-1">
        <div className="text-body-md opacity-80">{label}</div>
        <div className="mt-1 text-headline-md font-medium tabular-nums">{value}</div>
        {sub && <div className={cn("text-body-sm", subClassName)}>{sub}</div>}
      </div>
      <span className="grid size-10 shrink-0 place-items-center rounded-md bg-surface-container-highest">
        <Icon size={20}>{icon}</Icon>
      </span>
    </div>
  )
}

/** Titled panel matching the admin's cards. */
export function Panel({
  title,
  description,
  action,
  className,
  bodyClassName = "mt-4",
  children,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  className?: string
  bodyClassName?: string
  children: React.ReactNode
}) {
  return (
    <section className={cn("min-w-0 rounded-xl bg-surface-container-low p-5", className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-title-md">{title}</h3>
          {description && <p className="text-body-sm text-on-surface-variant">{description}</p>}
        </div>
        {action}
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>
  )
}

/** Simple horizontal meter (capacity, stock). */
export function Meter({ value, label, tone = "primary", className }: { value: number; label: string; tone?: "primary" | "secondary" | "error"; className?: string }) {
  const fill = { primary: "bg-primary", secondary: "bg-secondary", error: "bg-error" }[tone]
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-container-highest", className)}
    >
      <div className={cn("h-full rounded-full transition-[width] duration-(--md-spring-default-spatial-duration) ease-default-spatial", fill)} style={{ width: `${value}%` }} />
    </div>
  )
}
