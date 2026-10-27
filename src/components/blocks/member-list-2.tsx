"use client"

import * as React from "react"

import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { snackbar } from "@/components/ui/snackbar"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

/*
 * Member list 02 · Presence cards with on-call filter
 * Presence cards with local time and quick actions. The switch narrows the grid to whoever is on call right now.
 */

type Presence = "online" | "away" | "busy" | "offline"

const PRESENCE: Record<Presence, { dot: string; label: string }> = {
  online: { dot: "bg-primary", label: "Online" },
  away: { dot: "bg-tertiary", label: "Away" },
  busy: { dot: "bg-error", label: "In a meeting" },
  offline: { dot: "bg-outline-variant", label: "Offline" },
}

const AVATARS = [
  "bg-primary-container text-on-primary-container",
  "bg-tertiary-container text-on-tertiary-container",
  "bg-secondary-container text-on-secondary-container",
]

const PEOPLE = (
  [
    ["Maya Ortiz", "Live ops lead", "online", 1, false],
    ["Ines Moreau", "Head of Live Ops", "online", 1, true],
    ["Sofia Marin", "Economy designer", "offline", 2, false],
    ["Tomás Ibarra", "Community manager", "away", -3, false],
    ["Ama Owusu", "Support lead", "online", 0, true],
    ["Hana Nakamura", "Player support", "online", 9, false],
    ["Bea Castillo", "Community moderator", "offline", 8, false],
    ["Kenji Watanabe", "Server engineer", "online", 9, true],
    ["Jae-won Park", "Build & release", "busy", 9, false],
    ["Rafael Vidal", "Backend engineer", "online", 0, false],
    ["Dana Novak", "Security engineer", "away", 1, false],
    ["Eli Laine", "Client engineer", "offline", 2, false],
  ] as const
).map(([name, title, presence, utcOffset, onCall], i) => ({
  name,
  title,
  presence: presence as Presence,
  utcOffset,
  onCall,
  avatar: AVATARS[i % 3],
  initials: name
    .split(" ")
    .map((w) => w[0])
    .join(""),
  email: `${name.split(" ")[0].toLowerCase().normalize("NFD").replace(/[^a-z]/g, "")}@cinder.gg`,
}))

function useUtcMinutes() {
  const read = () => {
    const now = new Date()
    return now.getUTCHours() * 60 + now.getUTCMinutes()
  }
  const [minutes, setMinutes] = React.useState(read)
  React.useEffect(() => {
    const t = setInterval(() => setMinutes(read()), 30000)
    return () => clearInterval(t)
  }, [])
  return minutes
}

const localTime = (utcMinutes: number, offset: number) => {
  const m = (((utcMinutes + offset * 60) % 1440) + 1440) % 1440
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(Math.round(m % 60)).padStart(2, "0")}`
}

export function MemberList2({ className }: { className?: string }) {
  const [onCallOnly, setOnCallOnly] = React.useState(false)
  const utc = useUtcMinutes()
  const people = onCallOnly ? PEOPLE.filter((p) => p.onCall) : PEOPLE.slice(0, 8)

  return (
    <div className={cn("bg-surface-container-low p-4 md:p-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-title-lg font-medium">Who's around</h4>
        <Switch isSelected={onCallOnly} onChange={setOnCallOnly} className="flex-row-reverse text-label-lg text-on-surface-variant">
          On call only
        </Switch>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {people.map((p) => (
          <div
            key={p.email}
            className="flex flex-col items-center gap-3 rounded-xl bg-surface p-5 text-center transition-shadow duration-300 hover:shadow-2"
          >
            <span className="relative">
              <span className={cn("grid size-16 place-items-center rounded-full text-title-lg", p.avatar)}>{p.initials}</span>
              <span
                aria-label={PRESENCE[p.presence].label}
                className={cn("absolute right-0.5 bottom-0.5 size-4 rounded-full ring-2 ring-surface", PRESENCE[p.presence].dot)}
              />
            </span>
            <div className="max-w-full min-w-0">
              <div className="truncate text-title-md">{p.name}</div>
              <div className="truncate text-body-sm text-on-surface-variant">{p.title}</div>
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              <span className="inline-flex h-6 items-center gap-1 rounded-sm bg-surface-container-high px-2 text-label-md text-on-surface-variant">
                {PRESENCE[p.presence].label} · {localTime(utc, p.utcOffset)}
              </span>
              {p.onCall && (
                <span className="inline-flex h-6 items-center gap-1 rounded-sm bg-tertiary-container px-2 text-label-md text-on-tertiary-container">
                  <Icon size={16}>support</Icon>
                  On call
                </span>
              )}
            </div>
            <div className="mt-auto flex gap-1">
              <IconButton aria-label={`Message ${p.name}`} onPress={() => snackbar(`Opening a Slack DM with ${p.name}`)}>
                <Icon size={20}>chat</Icon>
              </IconButton>
              <IconButton
                aria-label={`Copy ${p.name}'s email`}
                onPress={async () => {
                  try {
                    await navigator.clipboard.writeText(p.email)
                  } catch {
                    // clipboard blocked
                  }
                  snackbar(`Copied ${p.email}`)
                }}
              >
                <Icon size={20}>mail</Icon>
              </IconButton>
              <IconButton
                aria-label={`Page ${p.name}`}
                onPress={() => snackbar(`Paged ${p.name}`, { action: { label: "Undo", onAction: () => {} } })}
              >
                <Icon size={20}>notifications_active</Icon>
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
