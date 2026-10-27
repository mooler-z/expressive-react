"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Select, SelectItem } from "@/components/ui/select"
import { snackbar } from "@/components/ui/snackbar"
import { Switch } from "@/components/ui/switch"
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs"
import { TextField } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

/*
 * Invite user 02 · Bulk list or link
 * Paste "email, role" lines and see them parsed live, or share a join link with a role,
 * expiry and an off switch.
 */

const ROLES = ["Admin", "Live ops", "Analyst", "Support", "Viewer"]
const isEmail = (v: string) => /^[^@\s,;]+@[^@\s,;]+\.[^@\s,;]{2,}$/.test(v)

const SAMPLE = "bea@cinder.gg, Support\nrafael@cinder.gg, Viewer\nqa-lead@northpoint-qa.com, Viewer\neli@cinder, Viewer"

function parse(text: string) {
  return text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [email = "", role = ""] = line.split(/[,;\t]/).map((x) => x.trim())
      return { email, role: ROLES.includes(role) ? role : "Viewer", ok: isEmail(email) }
    })
}

const token = () => `${Math.random().toString(36).slice(2, 6)}-${Math.random().toString(36).slice(2, 8)}`

export function InviteUser2({ className }: { className?: string }) {
  const [paste, setPaste] = React.useState(SAMPLE)
  const [linkOn, setLinkOn] = React.useState(true)
  const [slug, setSlug] = React.useState("k3x9-frostfire")
  const [joinRole, setJoinRole] = React.useState("Viewer")
  const [expires, setExpires] = React.useState("7 days")
  const parsed = parse(paste)
  const ready = parsed.filter((p) => p.ok).length
  const skip = parsed.length - ready
  const url = `https://lumen.cinder.gg/join/${slug}`

  return (
    <div className={cn("grid min-h-[560px] place-items-center bg-surface-container px-4 py-10", className)}>
      <div className="w-full max-w-2xl rounded-xl bg-surface">
        <div className="px-6 pt-6">
          <h4 className="text-headline-sm font-medium">Invite your team</h4>
          <p className="mt-1 text-body-md text-on-surface-variant">Paste a list or share a link. Everyone joins Cinder Studio.</p>
        </div>
        <Tabs defaultSelectedKey="emails" className="mt-4">
          <TabList aria-label="Invite method" scrollable className="border-b border-outline-variant px-4">
            <Tab id="emails">Email list</Tab>
            <Tab id="link">Invite link</Tab>
          </TabList>

          <TabPanel id="emails" className="grid gap-5 p-6 md:grid-cols-2">
            <TextField
              label="One per line · email, role"
              multiline
              rows={8}
              value={paste}
              onChange={setPaste}
              inputClassName="font-mono text-body-md"
            />
            <div className="min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-title-sm">Preview</span>
                <span className="text-body-sm text-on-surface-variant">
                  {ready} ready{skip ? ` · ${skip} to fix` : ""}
                </span>
              </div>
              <ul className="mt-2 divide-y divide-outline-variant/60 rounded-lg border border-outline-variant">
                {parsed.map((p, i) => (
                  <li key={`${p.email}-${i}`} className="flex items-center gap-3 px-3 py-2.5">
                    <Icon size={20} filled className={p.ok ? "text-primary" : "text-error"}>
                      {p.ok ? "check_circle" : "error"}
                    </Icon>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-body-md">{p.email}</span>
                      <span className={cn("block text-body-sm", p.ok ? "text-on-surface-variant" : "text-error")}>
                        {p.ok ? p.role : "Not a valid email"}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end md:col-span-2">
              <Button
                className="pr-5 pl-3"
                isDisabled={ready === 0}
                onPress={() => {
                  snackbar(`Invited ${ready} ${ready === 1 ? "person" : "people"}${skip ? ` · skipped ${skip}` : ""}`)
                  setPaste(
                    parsed
                      .filter((p) => !p.ok)
                      .map((p) => `${p.email}, ${p.role}`)
                      .join("\n"),
                  )
                }}
              >
                <Icon>send</Icon>
                {ready === 1 ? "Invite 1 person" : `Invite ${ready} people`}
              </Button>
            </div>
          </TabPanel>

          <TabPanel id="link" className="space-y-5 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-xs border border-outline-variant bg-surface-container-low px-3">
                <Icon size={20} className="text-on-surface-variant">
                  link
                </Icon>
                <span className={cn("min-w-0 flex-1 truncate font-mono text-body-md", !linkOn && "line-through opacity-50")}>{url}</span>
              </div>
              <Button
                size="md"
                className="h-12 pr-5 pl-4 text-label-lg"
                isDisabled={!linkOn}
                onPress={async () => {
                  try {
                    await navigator.clipboard.writeText(url)
                  } catch {
                    // clipboard blocked — the snackbar still confirms the link
                  }
                  snackbar("Copied invite link")
                }}
              >
                <Icon size={20}>content_copy</Icon>
                Copy link
              </Button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Select label="Joins as" selectedKey={joinRole} onSelectionChange={(k) => setJoinRole(String(k))}>
                {["Live ops", "Analyst", "Support", "Viewer"].map((r) => (
                  <SelectItem key={r} id={r}>
                    {r}
                  </SelectItem>
                ))}
              </Select>
              <Select label="Link expires" selectedKey={expires} onSelectionChange={(k) => setExpires(String(k))}>
                {["24 hours", "7 days", "30 days", "Never"].map((r) => (
                  <SelectItem key={r} id={r}>
                    {r}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="flex flex-wrap items-center gap-4 rounded-lg bg-surface-container-low p-4">
              <div className="min-w-0 flex-1">
                <div className="text-title-sm">Link active</div>
                <div className="text-body-md text-on-surface-variant">Anyone with a @cinder.gg address can join with it.</div>
              </div>
              <Switch
                aria-label="Link active"
                isSelected={linkOn}
                onChange={(v) => {
                  setLinkOn(v)
                  snackbar(v ? "Invite link turned on" : "Invite link turned off · it no longer works")
                }}
              />
            </div>
            <Button
              variant="text"
              className="-ml-3 px-3 text-error"
              onPress={() => {
                setSlug(token())
                setLinkOn(true)
                snackbar("New link created · the old one stopped working")
              }}
            >
              <Icon>autorenew</Icon>
              Reset link
            </Button>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  )
}
