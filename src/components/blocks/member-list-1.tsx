"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { ChipGroup, FilterChip } from "@/components/ui/chip"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Menu, MenuItem, MenuPopover, MenuTrigger } from "@/components/ui/menu"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * Member list 01 · List with role filter
 * Search across name, title and team, role filter chips, presence and local time on each row,
 * and a row menu.
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

const ROLE_TONE: Record<string, string> = {
  Owner: "bg-primary text-on-primary",
  Admin: "bg-primary-container text-on-primary-container",
  "Live ops": "bg-tertiary-container text-on-tertiary-container",
  Analyst: "bg-secondary-container text-on-secondary-container",
  Support: "bg-secondary-container text-on-secondary-container",
  Viewer: "bg-surface-container-highest text-on-surface-variant",
}

const PEOPLE = (
  [
    ["Maya Ortiz", "Live ops lead", "Owner", "Live ops", "online", "Stockholm", 1],
    ["Ines Moreau", "Head of Live Ops", "Admin", "Live ops", "online", "Lyon", 1],
    ["Sofia Marin", "Economy designer", "Live ops", "Live ops", "offline", "Bucharest", 2],
    ["Tomás Ibarra", "Community manager", "Live ops", "Community & support", "away", "Buenos Aires", -3],
    ["Ama Owusu", "Support lead", "Support", "Community & support", "online", "Accra", 0],
    ["Hana Nakamura", "Player support", "Support", "Community & support", "online", "Osaka", 9],
    ["Bea Castillo", "Community moderator", "Support", "Community & support", "offline", "Manila", 8],
    ["Kenji Watanabe", "Server engineer", "Admin", "Engineering", "online", "Tokyo", 9],
    ["Jae-won Park", "Build & release", "Admin", "Engineering", "busy", "Seoul", 9],
    ["Rafael Vidal", "Backend engineer", "Viewer", "Engineering", "online", "Lisbon", 0],
    ["Dana Novak", "Security engineer", "Admin", "Engineering", "away", "Prague", 1],
    ["Eli Laine", "Client engineer", "Viewer", "Engineering", "offline", "Helsinki", 2],
    ["Priya Raman", "Data analyst", "Analyst", "Insights", "online", "Bengaluru", 5.5],
    ["Noor Haddad", "Data analyst", "Analyst", "Insights", "online", "Amman", 3],
    ["Lukas Brandt", "Producer", "Viewer", "Studio", "offline", "Berlin", 1],
    ["Ruth Mensah", "Finance & billing", "Analyst", "Studio", "away", "London", 0],
  ] as const
).map(([name, title, role, team, presence, city, utcOffset], i) => ({
  name,
  title,
  role,
  team,
  presence: presence as Presence,
  city,
  utcOffset,
  avatar: AVATARS[i % 3],
  initials: name
    .split(" ")
    .map((w) => w[0])
    .join(""),
  email: `${name.split(" ")[0].toLowerCase().normalize("NFD").replace(/[^a-z]/g, "")}@cinder.gg`,
}))

const ROLES = ["All", "Admin", "Live ops", "Analyst", "Support", "Viewer"]

/** Minutes since midnight UTC, refreshed every 30s. */
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

export function MemberList1({ className }: { className?: string }) {
  const [query, setQuery] = React.useState("")
  const [role, setRole] = React.useState("All")
  const utc = useUtcMinutes()
  const q = query.trim().toLowerCase()
  const people = PEOPLE.filter(
    (p) =>
      (role === "All" || p.role === role) &&
      (!q || p.name.toLowerCase().includes(q) || p.title.toLowerCase().includes(q) || p.team.toLowerCase().includes(q)),
  )

  return (
    <div className={cn("bg-surface", className)}>
      <div className="flex flex-wrap items-center gap-3 px-4 pt-4 md:px-6">
        <div className="min-w-0 flex-1">
          <h4 className="text-title-lg font-medium">People</h4>
          <p className="text-body-sm text-on-surface-variant">
            {people.length} of {PEOPLE.length}
          </p>
        </div>
        <label className="flex h-10 w-full items-center gap-2 rounded-full bg-surface-container-high pr-2 pl-3 text-on-surface-variant sm:w-64">
          <Icon size={20}>search</Icon>
          <input
            type="search"
            placeholder="Name, title or team"
            aria-label="Search people"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-body-md text-on-surface outline-none placeholder:text-on-surface-variant"
          />
        </label>
      </div>
      <ChipGroup
        aria-label="Role"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[role]}
        onSelectionChange={(k) => setRole(String([...k][0]))}
        className="px-4 py-3 md:px-6"
      >
        {ROLES.map((r) => (
          <FilterChip key={r} id={r}>
            {r}
          </FilterChip>
        ))}
      </ChipGroup>

      <ul className="border-t border-outline-variant">
        {people.map((p) => (
          <li
            key={p.email}
            className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-outline-variant/60 px-4 py-2.5 last:border-b-0 md:px-6"
          >
            <span className="relative shrink-0">
              <span className={cn("grid size-10 place-items-center rounded-full text-label-lg", p.avatar)}>{p.initials}</span>
              <span
                aria-label={PRESENCE[p.presence].label}
                className={cn("absolute right-0 bottom-0 size-3 rounded-full ring-2 ring-surface", PRESENCE[p.presence].dot)}
              />
            </span>
            <div className="min-w-[min(100%,180px)] flex-1">
              <div className="truncate text-title-sm">{p.name}</div>
              <div className="truncate text-body-sm text-on-surface-variant">
                {p.title} · {p.team}
              </div>
            </div>
            <span className="hidden w-36 items-center gap-1 text-body-sm text-on-surface-variant md:inline-flex">
              <Icon size={16}>schedule</Icon>
              <span className="tabular-nums">{localTime(utc, p.utcOffset)}</span> · {p.city}
            </span>
            <span className={cn("inline-flex h-6 w-20 items-center justify-center rounded-sm text-label-md", ROLE_TONE[p.role])}>{p.role}</span>
            <MenuTrigger>
              <IconButton aria-label={`Actions for ${p.name}`}>
                <Icon>more_vert</Icon>
              </IconButton>
              <MenuPopover placement="bottom end">
                <Menu
                  aria-label={`Actions for ${p.name}`}
                  className="w-52"
                  onAction={async (k) => {
                    if (k === "email") {
                      try {
                        await navigator.clipboard.writeText(p.email)
                      } catch {
                        // clipboard blocked
                      }
                      snackbar(`Copied ${p.email}`)
                    } else snackbar(k === "message" ? `Opening a Slack DM with ${p.name}` : `Opening ${p.name}'s profile`)
                  }}
                >
                  <MenuItem id="message" icon="chat">
                    Message
                  </MenuItem>
                  <MenuItem id="profile" icon="person">
                    View profile
                  </MenuItem>
                  <MenuItem id="email" icon="mail">
                    Copy email
                  </MenuItem>
                </Menu>
              </MenuPopover>
            </MenuTrigger>
          </li>
        ))}
      </ul>

      {people.length === 0 && (
        <div className="flex flex-col items-center gap-1 border-t border-outline-variant px-4 py-10 text-center">
          <Icon size={36} className="text-on-surface-variant">
            person_search
          </Icon>
          <div className="text-title-md">Nobody matches</div>
          <Button
            variant="outlined"
            className="mt-2"
            onPress={() => {
              setQuery("")
              setRole("All")
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}
