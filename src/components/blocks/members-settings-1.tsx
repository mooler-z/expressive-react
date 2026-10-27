"use client"

import * as React from "react"
import { Link, SearchField, Input } from "react-aria-components"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Menu, MenuItem, MenuPopover, MenuTrigger } from "@/components/ui/menu"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * Members settings 01 · Members & invites
 * Search, presence dots, a role menu with descriptions on every row, removal with undo, and
 * pending invites to resend or revoke.
 */

export type Role = "Owner" | "Admin" | "Live ops" | "Analyst" | "Support" | "Viewer"

export interface Member {
  name: string
  email: string
  role: Role
  title: string
  seen: string
  color?: "primary" | "secondary" | "tertiary"
}

export interface Invite {
  email: string
  role: Role
  sent: string
}

export interface MembersSettings1Props {
  members?: Member[]
  invites?: Invite[]
  onRoleChange?: (email: string, role: Role) => void
  onRemove?: (email: string) => void
  inviteHref?: string
  className?: string
}

export const ROLE_DESCRIPTIONS: Record<Exclude<Role, "Owner">, string> = {
  Admin: "Everything except billing and ownership",
  "Live ops": "Events, store and player tools",
  Analyst: "Dashboards and exports, read-only",
  Support: "Player lookup, bans, refunds",
  Viewer: "Read-only, no personal data",
}

const MEMBERS: Member[] = [
  { name: "Maya Ortiz", email: "maya@cinder.gg", role: "Owner", title: "Live ops lead", seen: "Online", color: "primary" },
  { name: "Ines Moreau", email: "ines@cinder.gg", role: "Admin", title: "Head of Live Ops", seen: "5 min ago", color: "tertiary" },
  { name: "Kenji Watanabe", email: "kenji@cinder.gg", role: "Admin", title: "Server engineering", seen: "1 h ago", color: "secondary" },
  { name: "Priya Raman", email: "priya@cinder.gg", role: "Analyst", title: "Player insights", seen: "Yesterday", color: "primary" },
  { name: "Tomás Ibarra", email: "tomas@cinder.gg", role: "Live ops", title: "Community", seen: "Online", color: "tertiary" },
  { name: "Ama Owusu", email: "ama@cinder.gg", role: "Support", title: "Support lead", seen: "3 h ago", color: "secondary" },
  { name: "Sofia Marin", email: "sofia@cinder.gg", role: "Live ops", title: "Economy design", seen: "2 d ago", color: "primary" },
  { name: "Lukas Brandt", email: "lukas@cinder.gg", role: "Viewer", title: "Producer", seen: "1 w ago", color: "tertiary" },
]

const INVITES: Invite[] = [
  { email: "noor@cinder.gg", role: "Analyst", sent: "Sent 2 days ago" },
  { email: "qa-lead@northpoint-qa.com", role: "Viewer", sent: "Sent 5 days ago · external" },
]

export function MembersSettings1({ members: initial = MEMBERS, invites: initialInvites = INVITES, onRoleChange, onRemove, inviteHref = "#", className }: MembersSettings1Props) {
  const [members, setMembers] = React.useState(initial)
  const [invites, setInvites] = React.useState(initialInvites)
  const [query, setQuery] = React.useState("")
  const q = query.trim().toLowerCase()
  const shown = members.filter((m) => !q || m.name.toLowerCase().includes(q) || m.email.includes(q))

  const setRole = (m: Member, role: Role) => {
    setMembers((list) => list.map((x) => (x.email === m.email ? { ...x, role } : x)))
    onRoleChange?.(m.email, role)
    snackbar(`${m.name} is now ${role}`)
  }

  const remove = (m: Member) => {
    const index = members.indexOf(m)
    setMembers((list) => list.filter((x) => x.email !== m.email))
    onRemove?.(m.email)
    snackbar(`Removed ${m.name}`, {
      action: { label: "Undo", onAction: () => setMembers((list) => [...list.slice(0, index), m, ...list.slice(index)]) },
    })
  }

  const revoke = (v: Invite) => {
    setInvites((list) => list.filter((x) => x.email !== v.email))
    snackbar("Invite revoked", { action: { label: "Undo", onAction: () => setInvites((list) => [...list, v]) } })
  }

  return (
    <div className={cn("rounded-xl bg-surface", className)}>
      <div className="flex flex-wrap items-center gap-3 px-4 py-4 md:px-6">
        <div className="min-w-0 flex-1">
          <h3 className="text-title-lg font-medium">Members</h3>
          <p className="text-body-sm text-on-surface-variant">{members.length} people in Cinder Studio</p>
        </div>
        <SearchField aria-label="Find a member" value={query} onChange={setQuery} className="group w-full sm:w-64">
          <div className="flex h-10 items-center gap-2 rounded-full bg-surface-container-high pr-1 pl-3 text-on-surface-variant focus-within:outline-2 focus-within:outline-primary">
            <Icon size={20}>search</Icon>
            <Input placeholder="Find a member" className="min-w-0 flex-1 bg-transparent text-body-md text-on-surface outline-none placeholder:text-on-surface-variant [&::-webkit-search-cancel-button]:hidden" />
            {query && (
              <IconButton size="xs" aria-label="Clear search" onPress={() => setQuery("")}>
                <Icon>close</Icon>
              </IconButton>
            )}
          </div>
        </SearchField>
        <Link href={inviteHref} className="state-layer focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-primary pr-4 pl-3 text-label-lg text-on-primary">
          <Icon size={20}>person_add</Icon>
          Invite
        </Link>
      </div>
      <ul className="border-t border-outline-variant">
        {shown.map((m) => (
          <li key={m.email} className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-outline-variant/60 px-4 py-3 md:px-6">
            <Avatar name={m.name} color={m.color} status={m.seen === "Online" ? "online" : "offline"} />
            <div className="min-w-[min(100%,180px)] flex-1">
              <div className="truncate text-title-sm">{m.name}</div>
              <div className="truncate text-body-sm text-on-surface-variant">
                {m.email} · {m.title}
              </div>
            </div>
            <span className="hidden w-24 text-body-sm text-on-surface-variant lg:block">{m.seen}</span>
            {m.role === "Owner" ? (
              <>
                <span className="inline-flex h-10 w-36 items-center gap-2 px-3 text-label-lg text-on-surface-variant">
                  <Icon size={18}>lock</Icon>
                  Owner
                </span>
                <span className="size-10" />
              </>
            ) : (
              <>
                <MenuTrigger>
                  <Button variant="outlined" aria-label={`Role for ${m.name}: ${m.role}`} className="w-36 justify-between rounded-sm pr-2 pl-3 text-on-surface data-pressed:rounded-sm">
                    {m.role}
                    <Icon size={20} className="text-on-surface-variant">
                      arrow_drop_down
                    </Icon>
                  </Button>
                  <MenuPopover placement="bottom end">
                    <Menu
                      aria-label={`Role for ${m.name}`}
                      className="w-72"
                      selectionMode="single"
                      selectedKeys={[m.role]}
                      onAction={(k) => setRole(m, k as Role)}
                    >
                      {(Object.keys(ROLE_DESCRIPTIONS) as Exclude<Role, "Owner">[]).map((r) => (
                        <MenuItem key={r} id={r} description={ROLE_DESCRIPTIONS[r]}>
                          {r}
                        </MenuItem>
                      ))}
                    </Menu>
                  </MenuPopover>
                </MenuTrigger>
                <IconButton aria-label={`Remove ${m.name}`} onPress={() => remove(m)}>
                  <Icon>person_remove</Icon>
                </IconButton>
              </>
            )}
          </li>
        ))}
      </ul>
      {shown.length === 0 && <EmptyState size="sm" variant="plain" shape={false} icon="person_search" title="No members match" description="Search by name or email." className="py-10" />}
      <div className="rounded-b-xl bg-surface-container-low px-4 py-4 md:px-6">
        <div className="text-title-sm">Pending invites</div>
        {invites.length ? (
          <ul className="mt-2 space-y-2">
            {invites.map((v) => (
              <li key={v.email} className="flex flex-wrap items-center gap-3 rounded-lg bg-surface px-4 py-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-dashed border-outline text-on-surface-variant">
                  <Icon size={20}>schedule_send</Icon>
                </span>
                <div className="min-w-[min(100%,200px)] flex-1">
                  <div className="truncate text-body-lg">{v.email}</div>
                  <div className="text-body-sm text-on-surface-variant">
                    {v.role} · {v.sent}
                  </div>
                </div>
                <Button variant="text" size="xs" className="h-9" onPress={() => snackbar(`Invite resent to ${v.email}`)}>
                  Resend
                </Button>
                <Button variant="text" size="xs" className="h-9 text-error" onPress={() => revoke(v)}>
                  Revoke
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-body-md text-on-surface-variant">No pending invites.</p>
        )}
      </div>
    </div>
  )
}
