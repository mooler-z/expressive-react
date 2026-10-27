"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * Members settings 02 · Roles matrix
 * Permissions grouped by area against every role, with headcounts per role. Owner is fixed;
 * any change raises a save bar.
 */

export interface PermissionGroup {
  group: string
  permissions: { id: string; label: string }[]
}

export interface MembersSettings2Props {
  roles?: { name: string; count: number; locked?: boolean }[]
  groups?: PermissionGroup[]
  /** role → granted permission ids */
  defaultGrants?: Record<string, string[]>
  onSave?: (grants: Record<string, string[]>) => void | Promise<void>
  className?: string
}

const ROLES = [
  { name: "Owner", count: 1, locked: true },
  { name: "Admin", count: 2 },
  { name: "Live ops", count: 2 },
  { name: "Analyst", count: 1 },
  { name: "Support", count: 1 },
  { name: "Viewer", count: 1 },
]

const GROUPS: PermissionGroup[] = [
  { group: "Live ops", permissions: [{ id: "evc", label: "Create and schedule events" }, { id: "evp", label: "Publish to production" }] },
  { group: "Economy", permissions: [{ id: "ecp", label: "Edit store prices" }, { id: "ecg", label: "Grant items and currency" }] },
  { group: "Players", permissions: [{ id: "pii", label: "View personal data" }, { id: "ban", label: "Ban and mute" }, { id: "ref", label: "Refund purchases" }] },
  { group: "Studio", permissions: [{ id: "mem", label: "Manage members" }, { id: "bil", label: "Billing and invoices" }] },
]

const GRANTS: Record<string, string[]> = {
  Owner: ["evc", "evp", "ecp", "ecg", "pii", "ban", "ref", "mem", "bil"],
  Admin: ["evc", "evp", "ecp", "ecg", "pii", "ban", "ref", "mem"],
  "Live ops": ["evc", "evp", "ecp", "ecg", "pii"],
  Analyst: [],
  Support: ["pii", "ban", "ref"],
  Viewer: [],
}

export function MembersSettings2({ roles = ROLES, groups = GROUPS, defaultGrants = GRANTS, onSave, className }: MembersSettings2Props) {
  const [grants, setGrants] = React.useState(defaultGrants)
  const [dirty, setDirty] = React.useState(false)
  const cols = `minmax(220px,1.5fr) repeat(${roles.length},minmax(80px,1fr))`

  const flip = (role: string, perm: string, on: boolean) => {
    setGrants((g) => ({ ...g, [role]: on ? [...(g[role] ?? []), perm] : (g[role] ?? []).filter((x) => x !== perm) }))
    setDirty(true)
  }

  return (
    <div className={cn("bg-surface", className)}>
      <div className="flex flex-wrap items-center gap-3 px-4 py-4 md:px-6">
        <div className="min-w-0 flex-1">
          <h3 className="text-title-lg font-medium">Roles & permissions</h3>
          <p className="text-body-sm text-on-surface-variant">Owner permissions are fixed. Changes apply at next sign-in.</p>
        </div>
        <Button variant="outlined" className="pr-4 pl-3" onPress={() => snackbar("Custom roles open here")}>
          <Icon>add</Icon>
          New role
        </Button>
      </div>
      <div className="relative overflow-x-auto">
        <div role="table" aria-label="Permissions by role" className="min-w-[760px]">
          <div role="row" className="grid items-end gap-2 border-y border-outline-variant bg-surface-container-low px-4 py-3 md:px-6" style={{ gridTemplateColumns: cols }}>
            <span role="columnheader" className="text-label-md text-on-surface-variant">
              Permission
            </span>
            {roles.map((r) => (
              <span role="columnheader" key={r.name} className="text-center">
                <span className="block text-label-lg">{r.name}</span>
                <span className="block text-body-sm text-on-surface-variant">{r.count} people</span>
              </span>
            ))}
          </div>
          {groups.map((g) => (
            <div role="rowgroup" key={g.group}>
              <div role="row" className="px-4 pt-4 pb-1 text-title-sm text-primary md:px-6">
                <span role="rowheader">{g.group}</span>
              </div>
              {g.permissions.map((p) => (
                <div role="row" key={p.id} className="grid items-center gap-2 border-b border-outline-variant/60 px-4 md:px-6" style={{ gridTemplateColumns: cols }}>
                  <span role="rowheader" className="py-2 text-body-md">
                    {p.label}
                  </span>
                  {roles.map((r) => (
                    <span role="cell" key={r.name} className="flex justify-center">
                      <Checkbox
                        aria-label={`${r.name}: ${p.label}`}
                        isSelected={(grants[r.name] ?? []).includes(p.id)}
                        isDisabled={r.locked}
                        onChange={(on) => flip(r.name, p.id, on)}
                        className="[&_.size-12]:size-10"
                      />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {dirty && (
        <div role="region" aria-label="Unsaved changes" className="flex animate-fade-up flex-wrap items-center gap-3 border-t border-outline-variant bg-surface-container px-4 py-3 md:px-6">
          <Icon className="text-on-surface-variant">edit_note</Icon>
          <span className="flex-1 text-body-md">Unsaved permission changes</span>
          <Button
            variant="text"
            onPress={() => {
              setGrants(defaultGrants)
              setDirty(false)
            }}
          >
            Reset
          </Button>
          <Button
            onPress={async () => {
              await onSave?.(grants)
              setDirty(false)
              snackbar("Permissions saved · changes apply on next sign-in")
            }}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  )
}
