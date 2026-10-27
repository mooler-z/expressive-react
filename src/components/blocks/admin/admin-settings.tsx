"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Select, SelectItem } from "@/components/ui/select"
import { snackbar } from "@/components/ui/snackbar"
import { Switch } from "@/components/ui/switch"
import { TextField } from "@/components/ui/text-field"
import { useTheme, type SchemeVariant } from "@/components/ui/theme-provider"
import { cn } from "@/lib/utils"

import { FilterChipButton, PageHeader } from "./admin-ui"

type Section = "general" | "notifications" | "security" | "api" | "billing" | "appearance"
const SECTIONS: [Section, string, string, string][] = [
  ["general", "General", "Name, URL, region", "tune"],
  ["notifications", "Notifications", "Email, Slack, digests", "notifications"],
  ["security", "Security", "MFA, SSO, sessions", "shield"],
  ["api", "API keys", "3 active keys", "key"],
  ["billing", "Billing", "Plan and invoices", "credit_card"],
  ["appearance", "Appearance", "Theme and dynamic color", "palette"],
]

export function AdminSettings() {
  const [section, setSection] = React.useState<Section>("general")
  const [open, setOpen] = React.useState(false)
  return (
    <div data-page>
      <PageHeader title="Settings" description="Workspace configuration for Kestrel Ops." />
      <div className="grid items-start gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <nav className={cn("space-y-1 rounded-xl bg-surface-container-low p-2", open && "hidden lg:block")} aria-label="Settings sections">
          {SECTIONS.map(([id, label, sub, icon]) => {
            const on = section === id
            return (
              <button
                key={id}
                aria-current={on ? "page" : undefined}
                onClick={() => (setSection(id), setOpen(true))}
                className={cn(
                  "state-layer focus-ring flex w-full items-center gap-3 rounded-full px-4 py-3 text-left transition-colors duration-300",
                  on ? "lg:bg-secondary-container lg:text-on-secondary-container" : "text-on-surface",
                )}
              >
                <Icon filled={on}>{icon}</Icon>
                <span className="min-w-0 flex-1">
                  <span className="block text-label-lg">{label}</span>
                  <span className="block truncate text-body-sm opacity-80">{sub}</span>
                </span>
                <Icon className="lg:hidden">chevron_right</Icon>
              </button>
            )
          })}
        </nav>
        <div className={cn("min-w-0 rounded-xl bg-surface-container-low p-5 md:p-6", !open && "hidden lg:block")}>
          <button
            className="state-layer mb-3 -ml-2 inline-flex h-10 items-center gap-1 rounded-full pr-4 pl-2 text-label-lg text-primary lg:hidden"
            onClick={() => setOpen(false)}
          >
            <Icon size={20}>arrow_back</Icon>
            All settings
          </button>
          {section === "general" && <General />}
          {section === "notifications" && <Notifications />}
          {section === "security" && <Security />}
          {section === "api" && <ApiKeys />}
          {section === "billing" && <Billing />}
          {section === "appearance" && <Appearance />}
        </div>
      </div>
    </div>
  )
}

function SectionHead({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-title-lg">{title}</h2>
        <p className="text-body-md text-on-surface-variant">{description}</p>
      </div>
      {action}
    </div>
  )
}

function SwitchRow({ title, sub, defaultSelected }: { title: string; sub: string; defaultSelected?: boolean }) {
  return (
    <Switch defaultSelected={defaultSelected} className="flex w-full flex-row-reverse justify-between gap-4 py-3">
      <span className="min-w-0 flex-1">
        <span className="block text-body-lg">{title}</span>
        <span className="block text-body-sm text-on-surface-variant">{sub}</span>
      </span>
    </Switch>
  )
}

function General() {
  const [saving, setSaving] = React.useState(false)
  return (
    <>
      <SectionHead title="General" description="Name, address and defaults for this workspace." />
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <TextField label="Workspace name" defaultValue="Kestrel Ops" />
        <TextField label="Workspace URL" defaultValue="ops" prefix="grid.kestrel.io/" />
        <Select label="Default region" defaultSelectedKey="eu-north">
          <SelectItem id="eu-central">Europe (Frankfurt)</SelectItem>
          <SelectItem id="eu-north">Europe (Stockholm)</SelectItem>
          <SelectItem id="us-east">US East (N. Virginia)</SelectItem>
          <SelectItem id="ap-ne">Asia Pacific (Tokyo)</SelectItem>
        </Select>
        <Select label="Time zone" defaultSelectedKey="sto">
          <SelectItem id="utc">UTC</SelectItem>
          <SelectItem id="sto">Europe/Stockholm (UTC+1)</SelectItem>
          <SelectItem id="nyc">America/New_York (UTC−5)</SelectItem>
          <SelectItem id="tyo">Asia/Tokyo (UTC+9)</SelectItem>
        </Select>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="text" onPress={() => snackbar("Changes discarded")}>
          Discard
        </Button>
        <Button
          isPending={saving}
          onPress={() => {
            setSaving(true)
            setTimeout(() => (setSaving(false), snackbar("Saved")), 1400)
          }}
        >
          {!saving && <Icon>save</Icon>}
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
      <div className="mt-8 rounded-lg border border-error/40 p-4">
        <div className="text-title-sm text-error">Danger zone</div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="text-body-md text-on-surface-variant">Delete this workspace and all of its projects.</p>
          <Button className="bg-error text-on-error" onPress={() => snackbar("Deletion requires owner confirmation by email")}>
            Delete workspace
          </Button>
        </div>
      </div>
    </>
  )
}

function Notifications() {
  return (
    <>
      <SectionHead title="Notifications" description="Choose what reaches you, and where." />
      <div className="mt-4 divide-y divide-outline-variant">
        <SwitchRow title="Failed deployments" sub="Email and Slack, immediately" defaultSelected />
        <SwitchRow title="Overdue invoices" sub="Email to billing contacts" defaultSelected />
        <SwitchRow title="New users joining" sub="Daily digest" />
        <SwitchRow title="Policy changes" sub="Slack #platform-alerts" defaultSelected />
        <SwitchRow title="Weekly summary" sub="Mondays at 09:00" defaultSelected />
        <SwitchRow title="Product updates" sub="Changelog digest, monthly" />
      </div>
    </>
  )
}

function Security() {
  const [sessions, setSessions] = React.useState([
    { id: "mac", icon: "laptop_mac", title: "MacBook Pro · Chrome", sub: "Stockholm · this device", current: true },
    { id: "ios", icon: "phone_iphone", title: "iPhone 16 · Kestrel app", sub: "Stockholm · 2 h ago" },
    { id: "win", icon: "desktop_windows", title: "Windows · Edge", sub: "Berlin · yesterday" },
  ])
  return (
    <>
      <SectionHead title="Security" description="Authentication and active sessions." />
      <div className="mt-4 divide-y divide-outline-variant">
        <SwitchRow title="Require MFA for all members" sub="21 of 24 users already enrolled" defaultSelected />
        <SwitchRow title="SSO via Okta" sub="SAML 2.0 · enforced for @kestrel.io" defaultSelected />
        <SwitchRow title="IP allow-list" sub="Restrict console access to office and VPN ranges" />
      </div>
      <div className="mt-6 text-title-sm">Active sessions</div>
      <ul className="mt-2 space-y-2">
        {sessions.map((s) => (
          <li key={s.id} className="flex items-center gap-3 rounded-lg bg-surface p-3">
            <span className="grid size-10 place-items-center rounded-full bg-secondary-container text-on-secondary-container">
              <Icon size={20}>{s.icon}</Icon>
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-body-md">{s.title}</div>
              <div className="text-body-sm text-on-surface-variant">{s.sub}</div>
            </div>
            {s.current ? (
              <span className="rounded-sm bg-tertiary-container px-2 py-0.5 text-label-md text-on-tertiary-container">Current</span>
            ) : (
              <Button variant="text" size="sm" className="text-error" onPress={() => (setSessions((x) => x.filter((y) => y.id !== s.id)), snackbar("Session revoked"))}>
                Revoke
              </Button>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}

function ApiKeys() {
  const [keys, setKeys] = React.useState([
    { name: "CI pipeline", key: "ksk_live_9f2a…c41e", role: "Deployer", used: "Used 3 min ago" },
    { name: "Terraform", key: "ksk_live_71bd…0a93", role: "Admin", used: "Used yesterday" },
    { name: "Grafana read-only", key: "ksk_live_c0de…77f1", role: "Viewer", used: "Used 2 h ago" },
  ])
  return (
    <>
      <SectionHead
        title="API keys"
        description="Keys inherit the permissions of the role they're scoped to."
        action={
          <Button onPress={() => snackbar("New key created — copy it now, it won't be shown again", { action: { label: "Copy", onAction: () => {} } })}>
            <Icon>add</Icon>
            Create key
          </Button>
        }
      />
      <ul className="mt-4 space-y-2">
        {keys.map((k) => (
          <li key={k.key} className="flex flex-wrap items-center gap-3 rounded-lg bg-surface p-3">
            <span className="grid size-10 place-items-center rounded-md bg-primary-container text-on-primary-container">
              <Icon size={20}>key</Icon>
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-body-md font-medium">{k.name}</div>
              <div className="font-mono text-body-sm text-on-surface-variant">{k.key}</div>
            </div>
            <span className="rounded-sm bg-secondary-container px-2 py-0.5 text-label-md text-on-secondary-container">{k.role}</span>
            <span className="hidden text-body-sm text-on-surface-variant sm:inline">{k.used}</span>
            <IconButton
              aria-label={`Copy ${k.name} key`}
              onPress={() => {
                navigator.clipboard?.writeText(k.key).catch(() => {})
                snackbar(`Copied ${k.name} key`)
              }}
            >
              <Icon size={20}>content_copy</Icon>
            </IconButton>
            <Button
              variant="text"
              size="sm"
              className="text-error"
              onPress={() => {
                setKeys((x) => x.filter((y) => y.key !== k.key))
                snackbar("Key revoked", { action: { label: "Undo", onAction: () => setKeys((x) => [...x, k]) } })
              }}
            >
              Revoke
            </Button>
          </li>
        ))}
      </ul>
    </>
  )
}

function Billing() {
  return (
    <>
      <SectionHead title="Billing" description="Plan, payment method and invoices." />
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-primary-container p-5 text-on-primary-container">
          <div className="text-label-lg">Current plan</div>
          <div className="mt-1 text-headline-sm font-medium">Enterprise · annual</div>
          <div className="mt-1 text-body-md">$184,000 / year · renews Mar 1, 2027</div>
          <Button className="mt-4" onPress={() => snackbar("Your success engineer will reach out")}>
            Change plan
          </Button>
        </div>
        <div className="rounded-lg bg-surface p-5">
          <div className="text-label-lg text-on-surface-variant">Payment method</div>
          <div className="mt-2 flex items-center gap-3">
            <span className="grid h-10 w-14 place-items-center rounded-sm bg-surface-container-highest">
              <Icon>account_balance</Icon>
            </span>
            <div>
              <div className="text-body-lg">Invoice · NET 30</div>
              <div className="text-body-sm text-on-surface-variant">billing@kestrel-ops.com</div>
            </div>
          </div>
          <Button variant="outlined" className="mt-4" onPress={() => snackbar("Payment method editor (demo)")}>
            Update
          </Button>
        </div>
      </div>
      <div className="mt-6 text-title-sm">Invoices</div>
      <ul className="mt-2 divide-y divide-outline-variant rounded-lg bg-surface">
        {["Oct 2026", "Sep 2026", "Aug 2026"].map((m) => (
          <li key={m} className="flex items-center gap-3 px-4 py-3 text-body-md">
            <span className="flex-1">{m}</span>
            <span className="tabular-nums">$15,333.33</span>
            <span className="rounded-sm bg-tertiary-container px-2 py-0.5 text-label-md text-on-tertiary-container">Paid</span>
            <IconButton aria-label={`Download ${m} invoice`} onPress={() => snackbar(`Invoice ${m} downloaded`)}>
              <Icon size={20}>download</Icon>
            </IconButton>
          </li>
        ))}
      </ul>
    </>
  )
}

const SEEDS = [
  ["Violet", "#6750A4"],
  ["Blue", "#0B57D0"],
  ["Teal", "#006A6A"],
  ["Green", "#386A20"],
  ["Amber", "#8B5000"],
  ["Red", "#B3261E"],
] as const
const SCHEMES: [SchemeVariant, string][] = [
  ["tonalSpot", "Tonal spot"],
  ["vibrant", "Vibrant"],
  ["expressive", "Expressive"],
  ["fidelity", "Fidelity"],
  ["monochrome", "Monochrome"],
]

function Appearance() {
  const { resolvedMode, setMode, seed, setSeed, variant, setVariant } = useTheme()
  const current = (seed ?? "#6750A4").toLowerCase()
  return (
    <>
      <SectionHead title="Appearance" description="Dynamic color from a seed, applied across the console instantly." />
      <div className="mt-6 text-title-sm">Theme</div>
      <ConnectedButtonGroup
        aria-label="Theme"
        variant="filled"
        className="mt-2"
        selectedKeys={[resolvedMode]}
        onSelectionChange={(k) => {
          const m = [...k][0] as "light" | "dark" | undefined
          if (m) setMode(m)
        }}
      >
        <ConnectedButton id="light">
          <Icon size={20}>light_mode</Icon>
          Light
        </ConnectedButton>
        <ConnectedButton id="dark">
          <Icon size={20}>dark_mode</Icon>
          Dark
        </ConnectedButton>
      </ConnectedButtonGroup>
      <div className="mt-6 text-title-sm">Seed color</div>
      <div className="mt-2 flex flex-wrap gap-3">
        {SEEDS.map(([name, hex]) => {
          const on = current === hex.toLowerCase()
          return (
            <button
              key={hex}
              aria-label={name}
              aria-pressed={on}
              onClick={() => setSeed(hex.toLowerCase() === "#6750a4" && variant === "tonalSpot" ? null : hex)}
              className={cn(
                "focus-ring grid size-12 place-items-center rounded-full ring-offset-2 ring-offset-surface-container-low transition-all duration-300 ease-emphasized hover:scale-110",
                on && "ring-2 ring-on-surface",
              )}
              style={{ background: hex }}
            >
              <Icon size={20} className={cn("text-white", !on && "invisible")}>
                check
              </Icon>
            </button>
          )
        })}
      </div>
      <div className="mt-6 text-title-sm">Scheme</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {SCHEMES.map(([id, label]) => (
          <FilterChipButton
            key={id}
            selected={variant === id}
            onPress={() => {
              setVariant(id)
              if (!seed) setSeed("#6750A4")
            }}
          >
            {label}
          </FilterChipButton>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-8">
        {["bg-primary", "bg-primary-container", "bg-secondary", "bg-secondary-container", "bg-tertiary", "bg-tertiary-container", "bg-surface-container-highest", "bg-error"].map((c) => (
          <div key={c} className={cn("h-12 rounded-md", c)} />
        ))}
      </div>
    </>
  )
}
