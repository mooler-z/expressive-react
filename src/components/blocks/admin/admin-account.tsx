"use client"

import * as React from "react"
import { FileTrigger, Form } from "react-aria-components"

import { StatusBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Select, SelectItem } from "@/components/ui/select"
import { Shape } from "@/components/ui/shape"
import { snackbar } from "@/components/ui/snackbar"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs"
import { TextField } from "@/components/ui/text-field"

import { Card, CardHead, PageHeader } from "./admin-ui"

export function AdminAccount() {
  return (
    <div>
      <PageHeader title="My account" description="maya@kestrel.io · Owner" />
      <Tabs>
        <TabList aria-label="Account" scrollable>
          <Tab id="profile">Profile</Tab>
          <Tab id="security">Security</Tab>
          <Tab id="sessions">Sessions</Tab>
          <Tab id="notifications">Notifications</Tab>
        </TabList>
        <TabPanel id="profile" className="mt-4">
          <ProfileTab />
        </TabPanel>
        <TabPanel id="security" className="mt-4">
          <SecurityTab />
        </TabPanel>
        <TabPanel id="sessions" className="mt-4">
          <SessionsTab />
        </TabPanel>
        <TabPanel id="notifications" className="mt-4">
          <NotificationsTab />
        </TabPanel>
      </Tabs>
    </div>
  )
}

/** Submit button that shows pending → done for a moment (the kit's data-async). */
function useSaveState() {
  const [state, setState] = React.useState<"idle" | "pending" | "done">("idle")
  React.useEffect(() => {
    if (state === "idle") return
    const t = setTimeout(() => setState(state === "pending" ? "done" : "idle"), state === "pending" ? 900 : 1800)
    return () => clearTimeout(t)
  }, [state])
  return [state, () => setState("pending")] as const
}

const TIME_ZONES = ["Europe/Stockholm (UTC+1)", "Europe/Berlin (UTC+1)", "America/New_York (UTC−5)", "Asia/Tokyo (UTC+9)"]
const LANGUAGES = ["English", "Svenska", "Deutsch", "日本語"]

function ProfileTab() {
  const [photo, setPhoto] = React.useState<string | null>(null)
  const [save, startSave] = useSaveState()
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => () => void (photo && URL.revokeObjectURL(photo)), [photo])

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Card className="min-w-0">
        <CardHead title="Photo" />
        <div className="mt-4 flex flex-col items-center gap-3 py-2">
          <span className="relative grid size-28 place-items-center">
            <Shape
              shape="cookie9"
              cycle={photo ? undefined : ["cookie9", "clover4", "sunny"]}
              interval={3200}
              className="absolute inset-0 size-28 text-tertiary-container"
            >
              {photo && <img src={photo} alt="Profile photo" className="size-full object-cover" />}
            </Shape>
            {!photo && <span className="relative text-headline-md text-on-tertiary-container">ML</span>}
          </span>
          <div className="flex gap-2">
            <FileTrigger
              acceptedFileTypes={["image/*"]}
              onSelect={(files) => {
                const file = files?.[0]
                if (file) {
                  setPhoto(URL.createObjectURL(file))
                  snackbar("Photo updated")
                }
              }}
            >
              <Button variant="tonal" className="pr-5">
                <Icon>upload</Icon>
                Upload
              </Button>
            </FileTrigger>
            <Button
              variant="text"
              className="h-9"
              isDisabled={!photo}
              onPress={() => {
                const prev = photo
                setPhoto(null)
                snackbar("Photo removed", { action: { label: "Undo", onAction: () => setPhoto(prev) } })
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      </Card>

      <Card className="min-w-0 xl:col-span-2">
        <CardHead title="Profile" />
        <Form
          ref={formRef}
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault()
            startSave()
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <TextField name="name" label="Full name" defaultValue="Maya Lindqvist" isRequired autoComplete="name" />
            <TextField name="display" label="Display name" defaultValue="maya" isRequired autoComplete="nickname" />
            <TextField name="email" type="email" label="Email" defaultValue="maya@kestrel.io" isRequired autoComplete="email" className="md:col-span-2" />
            <Select name="tz" label="Time zone" defaultSelectedKey={TIME_ZONES[0]}>
              {TIME_ZONES.map((z) => (
                <SelectItem key={z} id={z}>
                  {z}
                </SelectItem>
              ))}
            </Select>
            <Select name="lang" label="Language" defaultSelectedKey="English">
              {LANGUAGES.map((l) => (
                <SelectItem key={l} id={l}>
                  {l}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="text" className="h-9" onPress={() => formRef.current?.reset()}>
              Cancel
            </Button>
            <Button type="submit" className="px-6" isPending={save === "pending"}>
              {save === "pending" ? "Saving…" : save === "done" ? "Saved" : "Save profile"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}

type Factor = { id: string; icon: string; name: string; added: string }

const FACTORS: Factor[] = [
  { id: "passkey", icon: "key", name: "Passkey · MacBook Touch ID", added: "Added Sep 2026" },
  { id: "yubikey", icon: "security_key", name: "YubiKey 5C", added: "Added Mar 2025" },
]

function SecurityTab() {
  const [totp, setTotp] = React.useState(true)
  const [factors, setFactors] = React.useState(FACTORS)
  const [save, startSave] = useSaveState()
  const [newPassword, setNewPassword] = React.useState("")

  const remove = (f: Factor) => {
    const index = factors.indexOf(f)
    setFactors((fs) => fs.filter((x) => x.id !== f.id))
    snackbar(`${f.name} removed`, {
      action: { label: "Undo", onAction: () => setFactors((fs) => (fs.some((x) => x.id === f.id) ? fs : [...fs.slice(0, index), f, ...fs.slice(index)])) },
    })
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="min-w-0">
        <CardHead title="Two-factor authentication" description="Required for Owners" />
        <div className="mt-4">
          <Switch
            isSelected={totp}
            onChange={setTotp}
            className="w-full flex-row-reverse justify-between rounded-lg bg-surface p-4"
          >
            <span>
              <span className="block text-title-sm">Authenticator app</span>
              <span className="block text-body-sm text-on-surface-variant">{totp ? "Enabled Mar 2025" : "Off"}</span>
            </span>
          </Switch>
          <ul className="mt-3 space-y-2">
            {factors.map((f) => (
              <li key={f.id} className="flex items-center gap-3 rounded-lg bg-surface p-3">
                <Icon className="text-primary">{f.icon}</Icon>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-body-md">{f.name}</div>
                  <div className="text-body-sm text-on-surface-variant">{f.added}</div>
                </div>
                <Button variant="text" className="h-9 text-error" onPress={() => remove(f)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
          <Button variant="outlined" className="mt-3 pr-5" onPress={() => snackbar("Follow your browser prompt")}>
            <Icon>add</Icon>
            Add passkey
          </Button>
        </div>
      </Card>

      <Card className="min-w-0">
        <CardHead title="Password" description="Last changed 4 months ago" />
        <Form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault()
            startSave()
            e.currentTarget.reset()
            setNewPassword("")
          }}
        >
          <div className="grid gap-4">
            <TextField name="current" type="password" label="Current password" isRequired autoComplete="current-password" />
            <TextField
              name="new"
              type="password"
              label="New password"
              isRequired
              minLength={12}
              autoComplete="new-password"
              description="At least 12 characters"
              value={newPassword}
              onChange={setNewPassword}
            />
            <TextField
              name="confirm"
              type="password"
              label="Confirm new password"
              isRequired
              autoComplete="new-password"
              validate={(v) => (v && v !== newPassword ? "Passwords don’t match" : null)}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit" className="px-6" isPending={save === "pending"}>
              {save === "pending" ? "Updating…" : save === "done" ? "Updated" : "Update password"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}

type Session = { id: string; icon: string; device: string; meta: string; current?: boolean }

const SESSIONS: Session[] = [
  { id: "mac", icon: "laptop_mac", device: "MacBook Pro · Chrome", meta: "Stockholm · this device", current: true },
  { id: "iphone", icon: "phone_iphone", device: "iPhone 16 · Kestrel app", meta: "Stockholm · 2 h ago" },
  { id: "win", icon: "desktop_windows", device: "Windows · Edge", meta: "Berlin · 3 days ago" },
]

function SessionsTab() {
  const [sessions, setSessions] = React.useState(SESSIONS)
  const others = sessions.filter((s) => !s.current)
  return (
    <Card className="min-w-0">
      <CardHead title="Active sessions" description="Sign out anywhere you don’t recognize" />
      <ul className="mt-4 divide-y divide-outline-variant">
        {sessions.map((s) => (
          <li key={s.id} className="flex flex-wrap items-center gap-3 py-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary-container text-on-secondary-container">
              <Icon>{s.icon}</Icon>
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-body-md">{s.device}</div>
              <div className="text-body-sm text-on-surface-variant">{s.meta}</div>
            </div>
            {s.current ? (
              <StatusBadge variant="tertiary" className="h-6">
                This device
              </StatusBadge>
            ) : (
              <Button
                variant="outlined"
                className="h-9"
                onPress={() => {
                  setSessions((ss) => ss.filter((x) => x.id !== s.id))
                  snackbar(`Signed out of ${s.device}`)
                }}
              >
                Sign out
              </Button>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-end">
        <Button
          className="bg-error px-5 text-on-error"
          isDisabled={others.length === 0}
          onPress={() => {
            setSessions((ss) => ss.filter((x) => x.current))
            snackbar("Signed out of all other sessions")
          }}
        >
          Sign out everywhere else
        </Button>
      </div>
    </Card>
  )
}

const CHANNELS = ["Email", "Push", "Slack"] as const
type Channel = (typeof CHANNELS)[number]

const EVENTS: { event: string; on: Channel[] }[] = [
  { event: "Deploy finished", on: ["Email", "Slack"] },
  { event: "Incident opened", on: ["Email", "Push", "Slack"] },
  { event: "Invoice overdue", on: ["Email"] },
  { event: "Weekly digest", on: ["Email"] },
  { event: "Mentions", on: ["Email", "Push", "Slack"] },
]

function NotificationsTab() {
  const [prefs, setPrefs] = React.useState(() => new Set(EVENTS.flatMap((e) => e.on.map((c) => `${e.event}:${c}`))))
  const toggle = (key: string, on: boolean) =>
    setPrefs((p) => {
      const next = new Set(p)
      if (on) next.add(key)
      else next.delete(key)
      return next
    })
  return (
    <Card className="min-w-0">
      <CardHead title="Notification preferences" description="Choose where each event reaches you" />
      <Table className="mt-4 min-w-[520px]" aria-label="Notification preferences">
        <TableHeader className="text-label-md">
          <TableRow>
            <TableHead className="px-4 py-2">Event</TableHead>
            {CHANNELS.map((c) => (
              <TableHead key={c} className="px-4 py-2 text-center">
                {c}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {EVENTS.map((e) => (
            <TableRow key={e.event}>
              <TableCell className="px-4 py-2 whitespace-nowrap">{e.event}</TableCell>
              {CHANNELS.map((c) => {
                const key = `${e.event}:${c}`
                return (
                  <TableCell key={c} className="px-4 py-2 text-center">
                    <Switch aria-label={`${e.event} by ${c}`} isSelected={prefs.has(key)} onChange={(on) => toggle(key, on)} />
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-end">
        <Button className="px-5" onPress={() => snackbar("Notification preferences saved")}>
          Save preferences
        </Button>
      </div>
    </Card>
  )
}
