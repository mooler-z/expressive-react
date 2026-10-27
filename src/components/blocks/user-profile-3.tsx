"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * User profile 03 · Staff member
 * A teammate's page: local time, on-call status, contact and page actions, what their role allows,
 * and recent audit-log activity.
 */

const CAN = ["Publish events", "Edit prices", "Grant items", "Ban players", "Manage members"]
const CANNOT = ["Billing", "Transfer ownership"]

const ACTIVITY: { icon: string; text: React.ReactNode; when: string }[] = [
  { icon: "rocket_launch", text: <>Published <span className="font-medium">Double XP Weekend</span> to Production</>, when: "12 min ago" },
  { icon: "sell", text: <>Set <span className="font-medium">Frostfire Pass sale</span> to 30% off</>, when: "1 h ago" },
  { icon: "person_add", text: <>Invited <span className="font-medium">noor@cinder.gg</span> as Analyst</>, when: "2 d ago" },
  { icon: "gavel", text: <>Banned <span className="font-medium">zero_cool_jp</span> · cheating</>, when: "9 d ago" },
  {
    icon: "tune",
    text: (
      <>
        Changed remote config <span className="font-mono text-body-sm">ranked_queue_max_wait</span> to 120 s
      </>
    ),
    when: "2 w ago",
  },
]

/** Local wall-clock time for a UTC offset, refreshed every 30s. */
function useLocalTime(utcOffsetHours: number) {
  const fmt = React.useCallback(() => {
    const now = new Date()
    const m = ((((now.getUTCHours() * 60 + now.getUTCMinutes() + utcOffsetHours * 60) % 1440) + 1440) % 1440)
    return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(Math.round(m % 60)).padStart(2, "0")}`
  }, [utcOffsetHours])
  const [time, setTime] = React.useState(fmt)
  React.useEffect(() => {
    const t = setInterval(() => setTime(fmt()), 30000)
    return () => clearInterval(t)
  }, [fmt])
  return time
}

export function UserProfile3({ className }: { className?: string }) {
  const time = useLocalTime(1)
  const [paging, setPaging] = React.useState<"idle" | "busy" | "done">("idle")

  React.useEffect(() => {
    if (paging !== "busy") return
    const t = setTimeout(() => setPaging("done"), 1400)
    return () => clearTimeout(t)
  }, [paging])

  return (
    <div className={cn("bg-surface", className)}>
      <div className="h-28 bg-primary-container md:h-36" />
      <div className="px-4 pb-6 md:px-8">
        <div className="-mt-12 flex flex-wrap items-end gap-4">
          <span className="relative grid size-24 shrink-0 place-items-center rounded-full bg-tertiary-container text-headline-md text-on-tertiary-container ring-4 ring-surface">
            IM
            <span aria-label="Online" className="absolute right-1 bottom-1 size-4 rounded-full bg-primary ring-2 ring-surface" />
          </span>
          <div className="min-w-[min(100%,220px)] flex-1 pb-1">
            <h4 className="text-headline-sm font-medium">Ines Moreau</h4>
            <div className="text-body-md text-on-surface-variant">Head of Live Ops · Lyon · {time} local time</div>
          </div>
          <div className="flex flex-wrap gap-2 pb-1">
            <Button variant="outlined" className="pr-4 pl-3" onPress={() => snackbar("Opening a Slack DM with Ines")}>
              <Icon>chat</Icon>
              Message
            </Button>
            <Button
              variant="outlined"
              className="pr-4 pl-3"
              onPress={async () => {
                try {
                  await navigator.clipboard.writeText("ines@cinder.gg")
                } catch {
                  // clipboard blocked
                }
                snackbar("Copied ines@cinder.gg")
              }}
            >
              <Icon>mail</Icon>
              Copy email
            </Button>
            <Button className="pr-4 pl-3" isPending={paging === "busy"} isDisabled={paging === "done"} onPress={() => setPaging("busy")}>
              {paging === "idle" && <Icon>notifications_active</Icon>}
              {paging === "idle" ? "Page" : paging === "busy" ? "Paging…" : "Ines was paged"}
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-tertiary-container p-5 text-on-tertiary-container">
              <Icon>support</Icon>
              <div>
                <div className="text-title-sm">On call · primary</div>
                <div className="text-body-md">Until Fri, Oct 30 · 18:00 UTC</div>
              </div>
            </div>
            <div className="rounded-xl bg-surface-container-low p-5">
              <dl className="grid grid-cols-2 gap-4">
                {[
                  ["Role", "Admin"],
                  ["Team", "Live ops"],
                  ["Titles", "All 3"],
                  ["Joined", "Feb 2024"],
                ].map(([dt, dd]) => (
                  <div key={dt}>
                    <dt className="text-body-sm text-on-surface-variant">{dt}</dt>
                    <dd className="mt-0.5 text-body-lg">{dd}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="rounded-xl bg-surface-container-low p-5">
              <div className="text-title-sm">Can</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {CAN.map((c) => (
                  <span key={c} className="inline-flex h-7 items-center rounded-sm bg-secondary-container px-2.5 text-label-md text-on-secondary-container">
                    {c}
                  </span>
                ))}
              </div>
              <div className="mt-4 text-title-sm">Can't</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {CANNOT.map((c) => (
                  <span key={c} className="inline-flex h-7 items-center rounded-sm border border-outline-variant px-2.5 text-label-md text-on-surface-variant">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-surface-container-low p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="text-title-md">Recent activity</div>
              <Button variant="text" className="h-9 px-3" onPress={() => snackbar("Opening the audit log filtered to Ines")}>
                Audit log
              </Button>
            </div>
            <ul className="mt-2 divide-y divide-outline-variant/60">
              {ACTIVITY.map((a) => (
                <li key={a.when} className="flex items-start gap-3 py-3">
                  <Icon size={20} className="mt-0.5 text-on-surface-variant">
                    {a.icon}
                  </Icon>
                  <span className="min-w-0 flex-1 text-body-md">{a.text}</span>
                  <span className="shrink-0 text-body-sm text-on-surface-variant">{a.when}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
