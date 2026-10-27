"use client"

import type * as React from "react"

import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

import { useAdmin } from "./admin-context"
import { RANGES, ROLE_STYLE, STATUS_STYLE, type RangeKey, type Role, type Status } from "./admin-data"

/** Page title row: headline + supporting text on the left, actions wrap on the right. */
export function PageHeader({ title, description, actions }: { title: React.ReactNode; description?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 pb-6">
      <div className="min-w-[min(100%,280px)] flex-1">
        <h1 className="text-headline-md font-medium md:text-headline-lg">{title}</h1>
        {description && <p className="mt-1 text-body-md text-on-surface-variant">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

/** Surface-container-low panel used for every dashboard card. */
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-xl bg-surface-container-low p-5", className)}>{children}</div>
}

export function CardHead({ title, description, action }: { title: React.ReactNode; description?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="text-title-md">{title}</h3>
        {description && <p className="text-body-sm text-on-surface-variant">{description}</p>}
      </div>
      {action}
    </div>
  )
}

/** 7d · 30d · 90d · 12m — connected button group bound to the shared range. */
export function RangePicker() {
  const { range, setRange } = useAdmin()
  return (
    <ConnectedButtonGroup
      aria-label="Date range"
      variant="filled"
      size="sm"
      selectedKeys={[range]}
      onSelectionChange={(keys) => {
        const k = [...keys][0] as RangeKey | undefined
        if (k) setRange(k)
      }}
    >
      {(Object.keys(RANGES) as RangeKey[]).map((k) => (
        <ConnectedButton key={k} id={k}>
          {k}
        </ConnectedButton>
      ))}
    </ConnectedButtonGroup>
  )
}

export function StatusPill({ status, className }: { status: Status; className?: string }) {
  const [badge, dot] = STATUS_STYLE[status]
  return (
    <span className={cn("inline-flex h-7 items-center gap-1.5 rounded-sm pr-3 pl-2 text-label-md whitespace-nowrap", badge, className)}>
      <span className={cn("size-1.5 rounded-full", dot)} />
      {status}
    </span>
  )
}

export function RolePill({ role }: { role: Role }) {
  return <span className={cn("inline-flex h-7 items-center rounded-sm px-2.5 text-label-md whitespace-nowrap", ROLE_STYLE[role])}>{role}</span>
}

/** Filter chip with an optional count, matching the kit's list filters. */
export function FilterChipButton({
  selected,
  onPress,
  children,
  count,
}: {
  selected: boolean
  onPress: () => void
  children: React.ReactNode
  count?: number
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onPress}
      className={cn(
        "state-layer focus-ring inline-flex h-8 shrink-0 items-center gap-2 rounded-sm px-3 text-label-lg shape-morph",
        selected ? "bg-secondary-container pl-2 text-on-secondary-container" : "border border-outline-variant text-on-surface-variant",
      )}
    >
      {selected && <Icon size={18}>check</Icon>}
      {children}
      {count != null && <span className="text-label-md opacity-70 tabular-nums">{count}</span>}
    </button>
  )
}

/** "1–8 of 24" with previous / next icon buttons. */
export function Pager({ start, end, total, onPrev, onNext }: { start: number; end: number; total: number; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="flex items-center justify-end gap-1 px-4 py-2 text-body-sm text-on-surface-variant">
      <span className="mr-2 tabular-nums">{total ? `${start}–${end} of ${total}` : "0 of 0"}</span>
      <button
        type="button"
        aria-label="Previous page"
        disabled={start <= 1}
        onClick={onPrev}
        className="state-layer focus-ring grid size-10 place-items-center rounded-full disabled:opacity-38"
      >
        <Icon>chevron_left</Icon>
      </button>
      <button
        type="button"
        aria-label="Next page"
        disabled={end >= total}
        onClick={onNext}
        className="state-layer focus-ring grid size-10 place-items-center rounded-full disabled:opacity-38"
      >
        <Icon>chevron_right</Icon>
      </button>
    </div>
  )
}
