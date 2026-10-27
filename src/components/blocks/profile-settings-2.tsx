"use client"

import * as React from "react"
import { Link, Tab, TabList, TabPanel, Tabs } from "react-aria-components"

import { StatusBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

/*
 * Profile settings 02 · Vertical tabs
 * Four tabs on the left that become a horizontal row on compact. Other sessions can be
 * signed out one at a time.
 */

export interface Session {
  id: string
  device: string
  icon: string
  where: string
  current?: boolean
}

export interface ProfileSettings2Props {
  sessions?: Session[]
  onSignOutSession?: (id: string) => void
  changePasswordHref?: string
  manageTwoFactorHref?: string
  className?: string
}

const SESSIONS: Session[] = [
  { id: "mac", device: "MacBook Pro · Chrome", icon: "laptop_mac", where: "Stockholm, SE · active now", current: true },
  { id: "iphone", device: "iPhone 15 · Lumen app", icon: "smartphone", where: "Stockholm, SE · 2 hours ago" },
  { id: "pc", device: "Windows PC · Edge", icon: "desktop_windows", where: "Austin, US · 3 days ago" },
]

const TABS = [
  { id: "profile", label: "Profile", icon: "person" },
  { id: "account", label: "Account", icon: "manage_accounts" },
  { id: "security", label: "Security", icon: "shield" },
  { id: "sessions", label: "Sessions", icon: "devices" },
]

export function ProfileSettings2({
  sessions: initialSessions = SESSIONS,
  onSignOutSession,
  changePasswordHref = "#",
  manageTwoFactorHref = "#",
  className,
}: ProfileSettings2Props) {
  const wide = useMediaQuery("(min-width: 600px)", true)
  const [sessions, setSessions] = React.useState(initialSessions)

  const signOut = (s: Session) => {
    setSessions((list) => list.filter((x) => x.id !== s.id))
    onSignOutSession?.(s.id)
    snackbar(`Signed out of ${s.device.split(" · ")[0]}`)
  }

  return (
    <Tabs orientation={wide ? "vertical" : "horizontal"} className={cn("grid min-h-[560px] bg-surface md:grid-cols-[220px_minmax(0,1fr)]", className)}>
      <TabList
        aria-label="Account settings"
        className="relative no-scrollbar flex gap-1 overflow-x-auto border-b border-outline-variant bg-surface-container-low p-3 md:flex-col md:border-e md:border-b-0"
      >
        {TABS.map((t) => (
          <Tab
            key={t.id}
            id={t.id}
            className={cn(
              "group state-layer focus-ring inline-flex h-12 shrink-0 cursor-pointer items-center gap-3 rounded-full px-4 text-label-lg text-on-surface-variant outline-none",
              "data-selected:bg-secondary-container data-selected:text-on-secondary-container",
            )}
          >
            <Icon className="group-data-selected:[--icon-fill:1]">{t.icon}</Icon>
            {t.label}
          </Tab>
        ))}
      </TabList>
      <div className="min-w-0 p-5 md:p-8">
        <TabPanel id="profile" className="max-w-xl animate-fade-up space-y-5 outline-none">
          <Heading title="Profile" description="How you appear to the rest of the studio." />
          <TextField label="Full name" defaultValue="Maya Ortiz" />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Job title" defaultValue="Live ops lead" />
            <TextField label="Pronouns" defaultValue="she/her" />
          </div>
          <Button onPress={() => snackbar("Profile saved")}>Save</Button>
        </TabPanel>
        <TabPanel id="account" className="max-w-xl animate-fade-up space-y-5 outline-none">
          <Heading title="Account" description="Sign-in details and preferences." />
          <TextField label="Username" defaultValue="maya.ortiz" />
          <TextField type="email" label="Email" defaultValue="maya@cinder.gg" />
          <div className="flex flex-wrap gap-2">
            <Button onPress={() => snackbar("Account details saved")}>Save</Button>
            <Button variant="outlined" className="pr-4 pl-3" onPress={() => snackbar("Preparing your data export · we'll email a link")}>
              <Icon>download</Icon>
              Export my data
            </Button>
          </div>
        </TabPanel>
        <TabPanel id="security" className="max-w-2xl animate-fade-up space-y-5 outline-none">
          <Heading title="Security" description="Password, two-step verification and passkeys." />
          <ul className="divide-y divide-outline-variant rounded-xl border border-outline-variant">
            <SecurityRow icon="password" title="Password" detail="Last changed Jul 30, 2026" action={<LinkButton href={changePasswordHref}>Change</LinkButton>} />
            <SecurityRow
              icon="phonelink_lock"
              title="Two-step verification"
              detail="On · authenticator app and 2 security keys"
              action={<LinkButton href={manageTwoFactorHref}>Manage</LinkButton>}
            />
            <SecurityRow
              icon="passkey"
              title="Passkeys"
              detail="1 passkey · MacBook Pro"
              action={
                <Button variant="outlined" onPress={() => snackbar("Follow your browser's prompt to create a passkey")}>
                  Add passkey
                </Button>
              }
            />
          </ul>
        </TabPanel>
        <TabPanel id="sessions" className="max-w-2xl animate-fade-up space-y-5 outline-none">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <Heading title="Sessions" description="Devices signed in to your account." />
            <Button
              variant="outlined"
              isDisabled={sessions.every((s) => s.current)}
              onPress={() => {
                setSessions((list) => list.filter((s) => s.current))
                snackbar("Signed out of all other sessions")
              }}
            >
              Sign out others
            </Button>
          </div>
          <ul className="divide-y divide-outline-variant rounded-xl border border-outline-variant">
            {sessions.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center gap-4 p-4">
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-full",
                    s.current ? "bg-primary-container text-on-primary-container" : "bg-surface-container-highest text-on-surface-variant",
                  )}
                >
                  <Icon size={20}>{s.icon}</Icon>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-title-sm">{s.device}</div>
                  <div className="text-body-md text-on-surface-variant">{s.where}</div>
                </div>
                {s.current ? (
                  <StatusBadge variant="primary-container" size="md">
                    This device
                  </StatusBadge>
                ) : (
                  <Button variant="text" className="text-error" onPress={() => signOut(s)}>
                    Sign out
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </TabPanel>
      </div>
    </Tabs>
  )
}

function Heading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="text-headline-sm font-medium">{title}</h3>
      <p className="mt-1 text-body-md text-on-surface-variant">{description}</p>
    </div>
  )
}

function SecurityRow({ icon, title, detail, action }: { icon: string; title: string; detail: string; action: React.ReactNode }) {
  return (
    <li className="flex flex-wrap items-center gap-4 p-4">
      <Icon className="text-on-surface-variant">{icon}</Icon>
      <div className="min-w-0 flex-1">
        <div className="text-title-sm">{title}</div>
        <div className="text-body-md text-on-surface-variant">{detail}</div>
      </div>
      {action}
    </li>
  )
}

function LinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="state-layer focus-ring inline-flex h-10 items-center rounded-full border border-outline-variant px-4 text-label-lg text-on-surface-variant">
      {children}
    </Link>
  )
}
