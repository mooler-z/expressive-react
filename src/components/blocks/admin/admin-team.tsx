"use client"

import * as React from "react"

import { Avatar } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Menu, MenuItem, MenuPopover, MenuSection, MenuTrigger, SubmenuTrigger } from "@/components/ui/menu"
import { snackbar } from "@/components/ui/snackbar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { useAdmin } from "./admin-context"
import { Card, CardHead, PageHeader } from "./admin-ui"

type Role = "Owner" | "Admin" | "Security admin" | "Member" | "Billing" | "Viewer"
type Tone = "primary" | "secondary" | "tertiary"
type Member = { id: string; name: string; team: string; role: Role; color: Tone; status: "online" | "away" | "offline" }

const MEMBERS: Member[] = [
  { id: "ml", name: "Maya Lindqvist", team: "Platform", role: "Owner", color: "primary", status: "online" },
  { id: "jp", name: "Jonah Park", team: "Engineering", role: "Admin", color: "tertiary", status: "online" },
  { id: "ar", name: "Ava Reyes", team: "Architecture", role: "Admin", color: "secondary", status: "away" },
  { id: "so", name: "Sam Okafor", team: "Security", role: "Security admin", color: "primary", status: "online" },
  { id: "pn", name: "Priya Nair", team: "Customer platform", role: "Member", color: "primary", status: "offline" },
  { id: "tw", name: "Tomás Weber", team: "Engineering", role: "Member", color: "tertiary", status: "away" },
  { id: "lo", name: "Lena Ortiz", team: "Support", role: "Viewer", color: "secondary", status: "online" },
  { id: "km", name: "Kenji Mori", team: "Finance", role: "Billing", color: "primary", status: "offline" },
]

/** Members not shown on this page (the grid lists the most active). */
const OTHER_MEMBERS = 16

const ROLE_BADGE = { Owner: "primary", Admin: "secondary", "Security admin": "secondary", Member: "neutral", Billing: "neutral", Viewer: "neutral" } as const
const ASSIGNABLE: Role[] = ["Admin", "Security admin", "Member", "Billing", "Viewer"]

const MATRIX_ROLES = ["Owner", "Admin", "Member", "Billing", "Viewer"] as const
type MatrixRole = (typeof MATRIX_ROLES)[number]

const PERMISSIONS: { name: string; roles: MatrixRole[] }[] = [
  { name: "View dashboards", roles: ["Owner", "Admin", "Member", "Billing", "Viewer"] },
  { name: "Deploy to production", roles: ["Owner", "Admin", "Member"] },
  { name: "Manage policies", roles: ["Owner", "Admin"] },
  { name: "Manage billing", roles: ["Owner", "Billing"] },
  { name: "Invite members", roles: ["Owner", "Admin"] },
  { name: "Delete workspace", roles: ["Owner"] },
]

const initialGrants = () => new Set(PERMISSIONS.flatMap((p) => p.roles.map((r) => `${p.name}:${r}`)))

export function AdminTeam() {
  const { openDialog } = useAdmin()
  const [members, setMembers] = React.useState(MEMBERS)
  const [grants, setGrants] = React.useState(initialGrants)
  const dirty = React.useMemo(() => {
    const init = initialGrants()
    return init.size !== grants.size || [...grants].some((g) => !init.has(g))
  }, [grants])

  const setRole = (m: Member, role: Role) => {
    setMembers((ms) => ms.map((x) => (x.id === m.id ? { ...x, role } : x)))
    snackbar(`${m.name} is now ${role === "Admin" ? "an" : "a"} ${role}`)
  }

  const remove = (m: Member) => {
    const index = members.indexOf(m)
    setMembers((ms) => ms.filter((x) => x.id !== m.id))
    snackbar(`${m.name} removed`, {
      action: { label: "Undo", onAction: () => setMembers((ms) => (ms.some((x) => x.id === m.id) ? ms : [...ms.slice(0, index), m, ...ms.slice(index)])) },
    })
  }

  return (
    <div>
      <PageHeader
        title="Team & roles"
        description={`${OTHER_MEMBERS + members.length} members · 5 roles`}
        actions={
          <>
            <Button variant="outlined" className="pr-5" onPress={() => snackbar("Exporting member list")}>
              <Icon>download</Icon>
              Export
            </Button>
            <Button className="pr-5" onPress={() => openDialog("invite")}>
              <Icon>person_add</Icon>
              Invite
            </Button>
          </>
        }
      />

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {members.map((m) => (
          <li key={m.id} className="flex flex-col rounded-xl bg-surface-container-low p-5">
            <div className="flex items-start justify-between">
              <Avatar
                name={m.name}
                color={m.color}
                status={m.status}
                className="size-12 text-label-md [--avatar-ring:var(--md-surface-container-low)]"
              />
              <MenuTrigger>
                <IconButton aria-label={`Actions for ${m.name}`} className="text-on-surface-variant">
                  <Icon size={20}>more_vert</Icon>
                </IconButton>
                <MenuPopover placement="bottom end">
                  <Menu
                    aria-label={`Actions for ${m.name}`}
                    className="w-56"
                    onAction={(key) => {
                      if (key === "message") snackbar(`Message to ${m.name.split(" ")[0]}`)
                      if (key === "2fa") snackbar(`2FA reset for ${m.name}`)
                      if (key === "remove") remove(m)
                    }}
                  >
                    <MenuSection>
                      {m.role !== "Owner" && (
                        <SubmenuTrigger>
                          <MenuItem id="role" icon="badge">
                            Change role
                          </MenuItem>
                          <MenuPopover>
                            <Menu
                              aria-label="Role"
                              selectionMode="single"
                              selectedKeys={[m.role]}
                              onAction={(role) => setRole(m, role as Role)}
                            >
                              {ASSIGNABLE.map((r) => (
                                <MenuItem key={r} id={r}>
                                  {r}
                                </MenuItem>
                              ))}
                            </Menu>
                          </MenuPopover>
                        </SubmenuTrigger>
                      )}
                      <MenuItem id="message" icon="mail">
                        Send message
                      </MenuItem>
                      <MenuItem id="2fa" icon="key_off">
                        Reset 2FA
                      </MenuItem>
                    </MenuSection>
                    {m.role !== "Owner" ? (
                      <MenuSection>
                        <MenuItem id="remove" icon="delete" className="text-error">
                          Remove from workspace
                        </MenuItem>
                      </MenuSection>
                    ) : null}
                  </Menu>
                </MenuPopover>
              </MenuTrigger>
            </div>
            <div className="mt-3 text-title-md">{m.name}</div>
            <div className="text-body-sm text-on-surface-variant">{m.team}</div>
            <div className="mt-3">
              <StatusBadge variant={ROLE_BADGE[m.role]} className="h-6">
                {m.role}
              </StatusBadge>
            </div>
          </li>
        ))}
      </ul>

      <Card className="mt-4 min-w-0">
        <CardHead title="Role permissions" description="Toggle to change what each role can do" />
        <Table className="mt-4 min-w-[640px]" aria-label="Role permissions">
          <TableHeader className="text-label-md">
            <TableRow>
              <TableHead className="px-4 py-2">Permission</TableHead>
              {MATRIX_ROLES.map((r) => (
                <TableHead key={r} className="px-4 py-2 text-center">
                  {r}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {PERMISSIONS.map((p) => (
              <TableRow key={p.name}>
                <TableCell className="px-4 py-2 whitespace-nowrap">{p.name}</TableCell>
                {MATRIX_ROLES.map((r) => {
                  const key = `${p.name}:${r}`
                  return (
                    <TableCell key={r} className="px-4 py-1 text-center">
                      <Checkbox
                        aria-label={`${r} can ${p.name.toLowerCase()}`}
                        // Owners always keep every permission.
                        isDisabled={r === "Owner"}
                        isSelected={r === "Owner" || grants.has(key)}
                        onChange={(on) =>
                          setGrants((g) => {
                            const next = new Set(g)
                            if (on) next.add(key)
                            else next.delete(key)
                            return next
                          })
                        }
                        className="justify-center"
                      />
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="text" className="h-9" isDisabled={!dirty} onPress={() => setGrants(initialGrants())}>
            Reset
          </Button>
          <Button className="px-5" onPress={() => snackbar("Role permissions saved")}>
            Save roles
          </Button>
        </div>
      </Card>
    </div>
  )
}
