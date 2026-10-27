"use client"

import * as React from "react"
import { Button as AriaButton } from "react-aria-components"

import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * Member list 03 · Directory by team
 * A compact two-column directory with sticky team headers inside a scroll area.
 * The chips above jump to a team.
 */

type Presence = "online" | "away" | "busy" | "offline"

const DOT: Record<Presence, string> = {
  online: "bg-primary",
  away: "bg-tertiary",
  busy: "bg-error",
  offline: "bg-outline-variant",
}

const AVATARS = [
  "bg-primary-container text-on-primary-container",
  "bg-tertiary-container text-on-tertiary-container",
  "bg-secondary-container text-on-secondary-container",
]

const TEAMS = ["Live ops", "Engineering", "Community & support", "Insights", "Studio"]

const PEOPLE = (
  [
    ["Maya Ortiz", "Live ops lead", "Live ops", "online", 1],
    ["Ines Moreau", "Head of Live Ops", "Live ops", "online", 1],
    ["Sofia Marin", "Economy designer", "Live ops", "offline", 2],
    ["Tomás Ibarra", "Community manager", "Community & support", "away", -3],
    ["Ama Owusu", "Support lead", "Community & support", "online", 0],
    ["Hana Nakamura", "Player support", "Community & support", "online", 9],
    ["Bea Castillo", "Community moderator", "Community & support", "offline", 8],
    ["Kenji Watanabe", "Server engineer", "Engineering", "online", 9],
    ["Jae-won Park", "Build & release", "Engineering", "busy", 9],
    ["Rafael Vidal", "Backend engineer", "Engineering", "online", 0],
    ["Dana Novak", "Security engineer", "Engineering", "away", 1],
    ["Eli Laine", "Client engineer", "Engineering", "offline", 2],
    ["Priya Raman", "Data analyst", "Insights", "online", 5.5],
    ["Noor Haddad", "Data analyst", "Insights", "online", 3],
    ["Lukas Brandt", "Producer", "Studio", "offline", 1],
    ["Ruth Mensah", "Finance & billing", "Studio", "away", 0],
  ] as const
).map(([name, title, team, presence, utcOffset], i) => ({
  name,
  title,
  team,
  presence: presence as Presence,
  utcOffset,
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

export function MemberList3({ className }: { className?: string }) {
  const scroller = React.useRef<HTMLDivElement>(null)
  const utc = useUtcMinutes()

  const jump = (team: string) => {
    const el = scroller.current?.querySelector<HTMLElement>(`[data-team="${CSS.escape(team)}"]`)
    if (scroller.current && el) scroller.current.scrollTo({ top: el.offsetTop, behavior: "smooth" })
  }

  return (
    <div className={cn("bg-surface", className)}>
      <div className="flex flex-wrap items-center gap-2 border-b border-outline-variant px-4 py-3 md:px-6">
        <span className="mr-1 text-title-sm">Jump to</span>
        {TEAMS.map((t) => (
          <AriaButton
            key={t}
            onPress={() => jump(t)}
            className="state-layer focus-ring inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-outline-variant px-3 text-label-lg text-on-surface-variant"
          >
            {t}
            <span className="text-label-md opacity-70">{PEOPLE.filter((p) => p.team === t).length}</span>
          </AriaButton>
        ))}
      </div>
      <div ref={scroller} className="relative max-h-[480px] overflow-y-auto">
        {TEAMS.map((t) => {
          const members = PEOPLE.filter((p) => p.team === t)
          return (
            <section key={t} data-team={t} aria-label={t}>
              <h5 className="sticky top-0 z-10 flex items-center gap-2 bg-surface-container px-4 py-2 text-title-sm md:px-6">
                {t}
                <span className="text-label-md text-on-surface-variant">{members.length}</span>
              </h5>
              <ul className="grid gap-x-6 px-2 py-1 sm:grid-cols-2 md:px-4">
                {members.map((p) => (
                  <li key={p.email}>
                    <AriaButton
                      onPress={() => snackbar(`${p.name} · ${p.email}`)}
                      className="state-layer focus-ring flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-left"
                    >
                      <span className="relative shrink-0">
                        <span className={cn("grid size-9 place-items-center rounded-full text-label-md", p.avatar)}>{p.initials}</span>
                        <span className={cn("absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full ring-2 ring-surface", DOT[p.presence])} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-body-lg">{p.name}</span>
                        <span className="block truncate text-body-sm text-on-surface-variant">{p.title}</span>
                      </span>
                      <span className="shrink-0 text-body-sm text-on-surface-variant tabular-nums">{localTime(utc, p.utcOffset)}</span>
                    </AriaButton>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}
