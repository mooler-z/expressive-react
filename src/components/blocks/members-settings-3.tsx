"use client"

import * as React from "react"

import { Avatar, AvatarGroup } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * Members settings 03 · Seats & teams
 * Seat usage for the plan above team cards. Adding a member takes a seat; when they run out
 * the meter turns red and prompts for more.
 */

export interface Team {
  name: string
  lead: string
  channel: string
  icon: string
  members: string[]
}

export interface MembersSettings3Props {
  seatsUsed?: number
  seatLimit?: number
  pricePerSeat?: string
  teams?: Team[]
  onAddSeats?: () => void
  onAddMember?: (team: string) => void
  className?: string
}

const TEAMS: Team[] = [
  { name: "Live ops", lead: "Ines Moreau", channel: "#live-ops", icon: "celebration", members: ["Ines Moreau", "Maya Ortiz", "Tomás Ibarra", "Sofia Marin"] },
  { name: "Engineering", lead: "Kenji Watanabe", channel: "#servers", icon: "dns", members: ["Kenji Watanabe", "Jun Park", "Rosa Vega", "Dev Nair", "Eli Laine"] },
  { name: "Community & support", lead: "Ama Owusu", channel: "#community", icon: "forum", members: ["Ama Owusu", "Ben Carter", "Hana Nowak"] },
  { name: "Insights", lead: "Priya Raman", channel: "#data", icon: "monitoring", members: ["Priya Raman", "Lukas Brandt"] },
]
const TONES = ["bg-primary-container text-on-primary-container", "bg-tertiary-container text-on-tertiary-container", "bg-secondary-container text-on-secondary-container"]

export function MembersSettings3({ seatsUsed = 14, seatLimit = 20, pricePerSeat = "$24", teams = TEAMS, onAddSeats, onAddMember, className }: MembersSettings3Props) {
  const [seats, setSeats] = React.useState(seatsUsed)
  const [added, setAdded] = React.useState<Record<string, number>>({})
  const full = seats >= seatLimit
  const addSeats = () => (onAddSeats ? onAddSeats() : snackbar(`Seat checkout · ${pricePerSeat} per seat each month`))

  const addMember = (team: string) => {
    if (full) return snackbar("No open seats left", { action: { label: "Add seats", onAction: addSeats } })
    setSeats((s) => s + 1)
    setAdded((a) => ({ ...a, [team]: (a[team] ?? 0) + 1 }))
    onAddMember?.(team)
    snackbar(`Invite sent · seat assigned to ${team}`)
  }

  return (
    <div className={cn("space-y-3 bg-surface-container-low p-4 md:p-6", className)}>
      <div className="flex flex-wrap items-center gap-4 rounded-xl bg-surface p-5">
        <div className="min-w-[min(100%,240px)] flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-title-md">
              {seats} of {seatLimit} seats used
            </span>
            <span className={cn("text-body-sm", full ? "text-error" : "text-on-surface-variant")}>{full ? "No open seats" : `${seatLimit - seats} open seats`}</span>
          </div>
          <div role="meter" aria-label="Seats used" aria-valuemin={0} aria-valuemax={seatLimit} aria-valuenow={seats} className="mt-2 flex h-2 items-center gap-1">
            <div className={cn("h-full rounded-full transition-[width] duration-500 ease-emphasized", full ? "bg-error" : "bg-primary")} style={{ width: `${(seats / seatLimit) * 100}%` }} />
            {!full && <div className="h-full flex-1 rounded-full bg-secondary-container" />}
          </div>
          <div className="mt-2 text-body-sm text-on-surface-variant">Studio plan · {pricePerSeat} per seat each month</div>
        </div>
        <Button variant="tonal" className="pr-4 pl-3" onPress={addSeats}>
          <Icon>add</Icon>
          Add seats
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {teams.map((t, i) => {
          const count = t.members.length + (added[t.name] ?? 0)
          return (
            <div key={t.name} className="flex flex-col gap-4 rounded-xl bg-surface p-5">
              <div className="flex items-start justify-between gap-2">
                <span className={cn("grid size-11 place-items-center rounded-lg", TONES[i % 3])}>
                  <Icon>{t.icon}</Icon>
                </span>
                <span className="font-mono text-body-sm text-on-surface-variant">{t.channel}</span>
              </div>
              <div>
                <div className="text-title-md">{t.name}</div>
                <div className="text-body-sm text-on-surface-variant">Lead · {t.lead}</div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <AvatarGroup max={4} size="sm" className="[--avatar-ring:var(--md-surface)]">
                  {[...t.members, ...Array.from({ length: added[t.name] ?? 0 }, (_, k) => `New Member ${k + 1}`)].map((name) => (
                    <Avatar key={name} name={name} size="sm" />
                  ))}
                </AvatarGroup>
                <span className="text-body-sm text-on-surface-variant">{count} members</span>
              </div>
              <Button variant="outlined" className="mt-auto w-full" onPress={() => addMember(t.name)}>
                <Icon>person_add</Icon>
                Add member
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
