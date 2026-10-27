"use client"

import * as React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

import { useAdmin } from "./admin-context"
import { DATA, type Role, type User } from "./admin-data"
import { FilterChipButton, PageHeader, Pager, RolePill, StatusPill } from "./admin-ui"

type Filter = "All" | "Active" | "Invited" | "Suspended" | "Admins"
const FILTERS: Filter[] = ["All", "Active", "Invited", "Suspended", "Admins"]
const PER = 8
const COLS = "grid-cols-[52px_minmax(220px,2fr)_110px_minmax(140px,1fr)_120px_56px_110px_48px]"

const matches = (u: User, f: Filter) =>
  f === "All" || (f === "Admins" ? u.role === "Admin" || u.role === "Owner" : u.status === f)

function undo(text: string) {
  snackbar(text, { action: { label: "Undo", onAction: () => snackbar("Undone") } })
}

export function AdminUsers() {
  const { query, setQuery, openDialog } = useAdmin()
  const [filter, setFilter] = React.useState<Filter>("All")
  const [page, setPage] = React.useState(0)
  const [sel, setSel] = React.useState<Set<number>>(new Set())
  const [detail, setDetail] = React.useState<number | null>(null)
  const [roles, setRoles] = React.useState<Record<number, Role>>({})
  const [suspended, setSuspended] = React.useState<Record<number, boolean>>({})
  const [removed, setRemoved] = React.useState<Record<number, boolean>>({})
  const [mfaReset, setMfaReset] = React.useState<Record<number, boolean>>({})

  const users = DATA.users
    .filter((u) => !removed[u.i])
    .map((u) => ({
      ...u,
      role: roles[u.i] ?? u.role,
      mfa: u.mfa && !mfaReset[u.i],
      status: suspended[u.i] === true ? "Suspended" : suspended[u.i] === false ? "Active" : u.status,
    })) as User[]
  const q = query.trim().toLowerCase()
  const searched = users.filter((u) => !q || (u.name + " " + u.email + " " + u.workspace).toLowerCase().includes(q))
  const filtered = searched.filter((u) => matches(u, filter))
  const pages = Math.max(1, Math.ceil(filtered.length / PER))
  const p = Math.min(page, pages - 1)
  const slice = filtered.slice(p * PER, p * PER + PER)
  const allSelected = slice.length > 0 && slice.every((u) => sel.has(u.i))
  const mfaPct = Math.round((users.filter((u) => u.mfa).length / users.length) * 100)
  const du = users.find((u) => u.i === detail)

  const bulk = (apply: (ids: number[]) => void, msg: string) => {
    const ids = [...sel]
    apply(ids)
    setSel(new Set())
    undo(msg.replace("{n}", String(ids.length)))
  }
  const toggle = (i: number) =>
    setSel((s) => {
      const n = new Set(s)
      if (n.has(i)) n.delete(i)
      else n.add(i)
      return n
    })

  return (
    <div data-page>
      <PageHeader
        title="Users"
        description={`${users.length} people across 5 workspaces · ${mfaPct}% have MFA enabled`}
        actions={
          <>
            <button
              className="state-layer inline-flex h-10 items-center gap-2 rounded-full border border-outline-variant pr-4 pl-3 text-label-lg text-on-surface-variant"
              onClick={() => snackbar("Exporting users.csv")}
            >
              <Icon size={20}>download</Icon>
              Export CSV
            </button>
            <button
              className="state-layer inline-flex h-10 items-center gap-2 rounded-full bg-primary pr-5 pl-4 text-label-lg text-on-primary shape-morph active:rounded-md"
              onClick={() => openDialog("invite")}
            >
              <Icon size={20}>person_add</Icon>
              Invite user
            </button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-3 pb-4">
        <SearchInput placeholder="Search name, email or workspace" value={query} onChange={(v) => (setQuery(v), setPage(0))} />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <FilterChipButton key={f} selected={filter === f} count={searched.filter((u) => matches(u, f)).length} onPress={() => (setFilter(f), setPage(0))}>
              {f}
            </FilterChipButton>
          ))}
        </div>
      </div>

      {sel.size > 0 && (
        <div className="mb-3 flex animate-fade-up flex-wrap items-center gap-2 rounded-lg bg-secondary-container px-3 py-2 text-on-secondary-container">
          <button className="state-layer grid size-10 shrink-0 place-items-center rounded-full" onClick={() => setSel(new Set())} aria-label="Clear selection">
            <Icon>close</Icon>
          </button>
          <span className="flex-1 text-title-sm">{sel.size} selected</span>
          <button
            className="state-layer inline-flex h-9 items-center gap-2 rounded-full px-3 text-label-lg"
            onClick={() => bulk((ids) => setRoles((r) => ({ ...r, ...Object.fromEntries(ids.map((i) => [i, "Member"])) })), "Role changed to Member for {n} users")}
          >
            <Icon size={20}>badge</Icon>
            Change role
          </button>
          <button
            className="state-layer inline-flex h-9 items-center gap-2 rounded-full px-3 text-label-lg"
            onClick={() => bulk((ids) => setSuspended((r) => ({ ...r, ...Object.fromEntries(ids.map((i) => [i, true])) })), "{n} users suspended")}
          >
            <Icon size={20}>block</Icon>
            Suspend
          </button>
          <button
            className="state-layer inline-flex h-9 items-center gap-2 rounded-full bg-error px-4 text-label-lg text-on-error"
            onClick={() => bulk((ids) => setRemoved((r) => ({ ...r, ...Object.fromEntries(ids.map((i) => [i, true])) })), "{n} users removed")}
          >
            <Icon size={20}>delete</Icon>
            Remove
          </button>
        </div>
      )}

      <div className={cn("grid items-start gap-4", du && "xl:grid-cols-[minmax(0,1fr)_360px]")}>
        <div className="min-w-0 overflow-hidden rounded-xl bg-surface-container-low">
          <div className="relative overflow-x-auto">
            <div className="min-w-[900px]">
              <div className={cn("grid items-center gap-3 border-b border-outline-variant px-3 py-1 text-label-md text-on-surface-variant", COLS)}>
                <Checkbox
                  aria-label="Select page"
                  isSelected={allSelected}
                  onChange={() =>
                    setSel((s) => {
                      const n = new Set(s)
                      slice.forEach((u) => (allSelected ? n.delete(u.i) : n.add(u.i)))
                      return n
                    })
                  }
                  className="-m-1"
                />
                <span>User</span>
                <span>Role</span>
                <span>Workspace</span>
                <span>Status</span>
                <span>MFA</span>
                <span>Last active</span>
                <span />
              </div>
              {slice.map((u) => (
                <div
                  key={u.i}
                  role="button"
                  tabIndex={0}
                  onClick={() => setDetail(u.i)}
                  onKeyDown={(e) => e.key === "Enter" && setDetail(u.i)}
                  className={cn(
                    "state-layer focus-ring grid cursor-pointer items-center gap-3 border-b border-outline-variant/60 px-3 py-2 text-body-md transition-colors",
                    COLS,
                    detail === u.i ? "bg-secondary-container/70" : sel.has(u.i) && "bg-primary/5",
                  )}
                >
                  <span onClick={(e) => e.stopPropagation()}>
                    <Checkbox aria-label={`Select ${u.name}`} isSelected={sel.has(u.i)} onChange={() => toggle(u.i)} className="-m-1" />
                  </span>
                  <span className="flex min-w-0 items-center gap-3">
                    <span className={cn("grid size-9 shrink-0 place-items-center rounded-full text-label-lg", u.avatarCls)}>{u.initials}</span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{u.name}</span>
                      <span className="block truncate text-body-sm text-on-surface-variant">{u.email}</span>
                    </span>
                  </span>
                  <span>
                    <RolePill role={u.role} />
                  </span>
                  <span className="truncate text-on-surface-variant">{u.workspace}</span>
                  <span>
                    <StatusPill status={u.status} />
                  </span>
                  <Icon size={20} filled={u.mfa} className={u.mfa ? "text-tertiary" : "text-error"}>
                    {u.mfa ? "verified_user" : "gpp_maybe"}
                  </Icon>
                  <span className="whitespace-nowrap text-on-surface-variant">{u.last}</span>
                  <Icon className="text-on-surface-variant">chevron_right</Icon>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="flex flex-col items-center px-6 py-14 text-center">
                  <Icon size={40} className="text-on-surface-variant">
                    person_search
                  </Icon>
                  <div className="mt-3 text-title-md">No users match</div>
                  <p className="mt-1 text-body-md text-on-surface-variant">Try a different search or filter.</p>
                  <button
                    className="state-layer mt-4 inline-flex h-10 items-center rounded-full border border-outline-variant px-4 text-label-lg text-on-surface-variant"
                    onClick={() => (setQuery(""), setFilter("All"), setPage(0))}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-outline-variant">
            <Pager
              start={p * PER + 1}
              end={Math.min(filtered.length, (p + 1) * PER)}
              total={filtered.length}
              onPrev={() => setPage(Math.max(0, p - 1))}
              onNext={() => setPage(Math.min(pages - 1, p + 1))}
            />
          </div>
        </div>

        {du && (
          <div className="fixed inset-0 z-50 flex justify-end xl:sticky xl:top-20 xl:z-auto xl:block">
            <div className="absolute inset-0 bg-scrim/40 xl:hidden" onClick={() => setDetail(null)} />
            <aside className="relative h-full w-full max-w-sm animate-[m3-sheet-in-right_.4s_cubic-bezier(.05,.7,.1,1)] overflow-y-auto bg-surface-container-low p-5 shadow-3 xl:h-auto xl:max-w-none xl:animate-fade-up xl:rounded-xl xl:shadow-none">
              <div className="flex items-center justify-between">
                <span className="text-title-md">User details</span>
                <button className="state-layer grid size-10 shrink-0 place-items-center rounded-full text-on-surface-variant" onClick={() => setDetail(null)} aria-label="Close details">
                  <Icon>close</Icon>
                </button>
              </div>
              <div className="mt-4 flex flex-col items-center text-center">
                <span className={cn("grid size-20 place-items-center rounded-full text-headline-sm", du.avatarCls)}>{du.initials}</span>
                <div className="mt-3 text-title-lg">{du.name}</div>
                <div className="text-body-md text-on-surface-variant">{du.email}</div>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <RolePill role={du.role} />
                  <StatusPill status={du.status} />
                </div>
              </div>
              <dl className="mt-5 divide-y divide-outline-variant rounded-lg bg-surface text-body-md">
                {[
                  ["Workspace", du.workspace],
                  ["Last active", du.last],
                  ["MFA", du.mfa ? "Enrolled (authenticator app)" : "Not enrolled"],
                  ["Joined", du.joined],
                  ["Deploys (30d)", String(du.deploys)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 px-4 py-3">
                    <dt className="text-on-surface-variant">{k}</dt>
                    <dd className="tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 text-title-sm">Change role</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["Admin", "Member", "Billing", "Viewer"] as Role[]).map((r) => (
                  <FilterChipButton
                    key={r}
                    selected={du.role === r}
                    onPress={() => {
                      if (du.role === "Owner") return snackbar("The workspace owner keeps the Owner role")
                      setRoles((x) => ({ ...x, [du.i]: r }))
                      snackbar(`${du.name} is now ${r}`)
                    }}
                  >
                    {r}
                  </FilterChipButton>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-2">
                <button
                  className="state-layer inline-flex h-10 items-center justify-center gap-2 rounded-full border border-outline-variant text-label-lg text-on-surface-variant"
                  onClick={() => {
                    setMfaReset((x) => ({ ...x, [du.i]: true }))
                    snackbar(`MFA reset — ${du.name.split(" ")[0]} will re-enroll at next sign-in`)
                  }}
                >
                  <Icon size={20}>key_off</Icon>
                  Reset MFA
                </button>
                <button
                  className="state-layer inline-flex h-10 items-center justify-center gap-2 rounded-full bg-error-container text-label-lg text-on-error-container"
                  onClick={() => {
                    const sus = du.status !== "Suspended"
                    setSuspended((x) => ({ ...x, [du.i]: sus }))
                    undo(du.name + (sus ? " suspended" : " reactivated"))
                  }}
                >
                  <Icon size={20}>{du.status === "Suspended" ? "check_circle" : "block"}</Icon>
                  {du.status === "Suspended" ? "Reactivate" : "Suspend"}
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

/** Pill search field used by list pages; bound to the shared admin query. */
export function SearchInput({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex h-12 min-w-[220px] flex-1 items-center gap-2 rounded-full bg-surface-container-high pr-2 pl-4 text-on-surface-variant focus-within:ring-2 focus-within:ring-primary sm:max-w-sm">
      <Icon size={20}>search</Icon>
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-body-md text-on-surface outline-none placeholder:text-on-surface-variant"
      />
    </label>
  )
}
