import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { CircularProgress, LinearProgress } from "@/components/ui/progress"
import { Section, Variant, Variants } from "@/docs/section"

/** Animate from 0 to `to` on mount and on replay. */
function useReplay(to: number) {
  const [value, setValue] = React.useState(0)
  const replay = React.useCallback(() => {
    setValue(0)
    requestAnimationFrame(() => requestAnimationFrame(() => setValue(to)))
  }, [to])
  React.useEffect(replay, [replay])
  return [value, replay] as const
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-label-md tracking-wider text-on-surface-variant uppercase">{children}</div>
}

export default function ProgressSection() {
  const [a, replayA] = useReplay(60)
  const [w, replayW] = useReplay(60)
  const [t, replayT] = useReplay(35)
  return (
    <Section
      id="progress"
      description="4dp tracks with a 4dp gap and a stop indicator. Expressive adds the wavy active indicator, thicker tracks and the new loading indicator."
      spec="https://m3.material.io/components/progress-indicators/overview"
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Linear · determinate {a}%</Label>
              <Button variant="text" size="xs" onPress={replayA}>
                <Icon>replay</Icon>
                Replay
              </Button>
            </div>
            <LinearProgress value={a} aria-label="Determinate" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Linear · wavy</Label>
              <Button variant="text" size="xs" onPress={replayW}>
                <Icon>replay</Icon>
                Replay
              </Button>
            </div>
            <LinearProgress value={w} wavy aria-label="Wavy" />
          </div>
          <div className="space-y-2">
            <Label>Linear · indeterminate · flat and wavy</Label>
            <LinearProgress isIndeterminate aria-label="Loading" />
            <LinearProgress isIndeterminate wavy aria-label="Loading" />
          </div>
          <div className="space-y-2">
            <Label>Linear · thick (8dp) with label</Label>
            <div className="flex items-center gap-3">
              <LinearProgress value={t} thickness={8} tone="tertiary" aria-label="Thick" className="flex-1" />
              <span className="text-label-lg text-on-surface-variant tabular-nums">{t}%</span>
              <IconButton size="xs" aria-label="Replay" onPress={replayT} className="text-tertiary">
                <Icon>replay</Icon>
              </IconButton>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <Label>Circular · determinate · indeterminate · wavy · sizes</Label>
          <div className="flex flex-wrap items-center gap-6">
            <CircularProgress value={a} aria-label="Determinate" />
            <CircularProgress isIndeterminate aria-label="Loading" />
            <CircularProgress value={w} wavy aria-label="Wavy" />
            <CircularProgress isIndeterminate wavy aria-label="Loading" />
            <CircularProgress isIndeterminate size={24} aria-label="Loading" />
            <CircularProgress value={78} size={64} aria-label="Storage">
              78%
            </CircularProgress>
          </div>
        </div>
      </div>

      <Variants>
        <Variant n={1} label="Thick · tertiary" className="flex min-h-24 flex-col justify-center gap-2 rounded-lg bg-surface p-4">
          <div className="flex justify-between text-label-md text-on-surface-variant">
            <span>Uploading</span>
            <span className="tabular-nums">72%</span>
          </div>
          <LinearProgress value={72} thickness={8} tone="tertiary" aria-label="Uploading" />
        </Variant>
        <Variant n={2} label="Error" className="flex min-h-24 flex-col justify-center gap-2 rounded-lg bg-surface p-4">
          <LinearProgress value={38} tone="error" aria-label="Upload failed" />
          <div className="flex items-center gap-2 text-body-sm text-error">
            <Icon size={18}>error</Icon>
            <span className="flex-1">Upload failed at 38%</span>
            <Button variant="text" size="xs">
              Retry
            </Button>
          </div>
        </Variant>
        <Variant n={3} label="Steps · 3 of 4" className="flex min-h-24 flex-col justify-center gap-2 rounded-lg bg-surface p-4">
          <div className="text-label-md text-on-surface-variant">Step 3 of 4 · Billing</div>
          <LinearProgress value={3} maxValue={4} aria-label="Step 3 of 4" />
        </Variant>
        <Variant n={4} label="Circular · with value">
          <CircularProgress value={64} size={64} aria-label="CPU">
            64%
          </CircularProgress>
          <CircularProgress value={28} size={48} tone="tertiary" aria-label="Memory">
            <span className="text-label-sm">28%</span>
          </CircularProgress>
        </Variant>
        <Variant n={5} label="In a file row" className="flex min-h-24 items-center gap-3 rounded-lg bg-surface p-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary-container text-on-secondary-container">
            <Icon>description</Icon>
          </span>
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex justify-between text-body-md">
              <span className="truncate">audit-log.csv</span>
              <span className="shrink-0 text-body-sm whitespace-nowrap text-on-surface-variant">3.2 / 8 MB</span>
            </div>
            <LinearProgress value={40} aria-label="audit-log.csv" />
          </div>
          <IconButton size="xs" aria-label="Cancel upload">
            <Icon>close</Icon>
          </IconButton>
        </Variant>
        <Variant n={6} label="Indeterminate · card refresh" className="overflow-hidden rounded-lg bg-surface">
          <LinearProgress isIndeterminate aria-label="Refreshing" />
          <div className="p-4">
            <div className="text-title-sm">Cluster health</div>
            <div className="text-body-md text-on-surface-variant">Refreshing 14 nodes…</div>
          </div>
        </Variant>
        <Variant n={7} label="Segmented · 5 steps" className="flex min-h-24 flex-col justify-center gap-2 rounded-lg bg-surface p-4">
          <div className="flex justify-between text-label-md text-on-surface-variant">
            <span>Workspace setup</span>
            <span>Step 3 of 5</span>
          </div>
          <div className="flex gap-1" role="progressbar" aria-label="Workspace setup" aria-valuenow={3} aria-valuemin={0} aria-valuemax={5}>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-full ${i < 3 ? "bg-primary" : "bg-secondary-container"}`} />
            ))}
          </div>
        </Variant>
        <Variant n={8} label="Buffer · media" className="flex min-h-24 flex-col justify-center gap-2 rounded-lg bg-surface p-4">
          <div className="relative flex h-3 items-center" role="progressbar" aria-label="Playback" aria-valuenow={41}>
            <div className="h-1 w-full rounded-full bg-secondary-container" />
            <div className="absolute h-1 w-[64%] rounded-full bg-primary/30" />
            <div className="absolute h-1 w-[41%] rounded-full bg-primary" />
            <span className="absolute left-[41%] size-3 -translate-x-1/2 rounded-full bg-primary" />
          </div>
          <div className="flex justify-between text-body-sm text-on-surface-variant tabular-nums">
            <span>1:42</span>
            <span>4:08</span>
          </div>
        </Variant>
        <Variant n={9} label="Stacked · storage" className="flex min-h-24 flex-col justify-center gap-2 rounded-lg bg-surface p-4">
          <div className="flex justify-between text-label-md">
            <span>Storage</span>
            <span className="text-on-surface-variant">38.4 of 50 GB</span>
          </div>
          <div className="flex h-2 gap-1" role="img" aria-label="Media 22 GB, Backups 11 GB, Other 5.4 GB of 50 GB">
            <span className="w-[44%] rounded-full bg-primary" />
            <span className="w-[22%] rounded-full bg-tertiary" />
            <span className="w-[11%] rounded-full bg-primary-fixed-dim" />
            <span className="flex-1 rounded-full bg-secondary-container" />
          </div>
          <div className="flex flex-wrap gap-3 text-body-sm text-on-surface-variant">
            {[["bg-primary", "Media 22 GB"], ["bg-tertiary", "Backups 11 GB"], ["bg-primary-fixed-dim", "Other 5.4 GB"]].map(([c, l]) => (
              <span key={l} className="inline-flex items-center gap-1.5">
                <span className={`size-2 rounded-full ${c}`} />
                {l}
              </span>
            ))}
          </div>
        </Variant>
        <Variant n={10} label="Milestones · rollout" className="flex min-h-24 flex-col justify-center gap-2 rounded-lg bg-surface p-4">
          <div className="flex justify-between text-label-md">
            <span>Rollout · 4.2.0</span>
            <span className="text-on-surface-variant">50% of users</span>
          </div>
          <div className="relative flex h-4 items-center">
            <LinearProgress value={50} aria-label="Rollout" showStop={false} />
            {[0, 10, 50, 100].map((m) => (
              <span
                key={m}
                className={`absolute size-2.5 -translate-x-1/2 rounded-full ring-2 ring-surface ${m <= 50 ? "bg-primary" : "bg-secondary-container"}`}
                style={{ left: `${m}%` }}
              />
            ))}
          </div>
          <div className="relative h-4 text-label-sm text-on-surface-variant">
            {[10, 50, 100].map((m) => (
              <span key={m} className={`absolute ${m === 100 ? "-translate-x-full" : "-translate-x-1/2"}`} style={{ left: `${m}%` }}>
                {m}%
              </span>
            ))}
          </div>
        </Variant>
        <PausedVariant />
        <Variant n={12} label="Complete · 100%" className="flex min-h-24 flex-col justify-center gap-2 rounded-lg bg-surface p-4">
          <div className="flex items-center gap-2 text-label-md">
            <Icon size={18} filled className="text-primary">
              check_circle
            </Icon>
            <span className="flex-1">Export complete</span>
            <span className="text-on-surface-variant">100%</span>
          </div>
          <LinearProgress value={100} aria-label="Export" />
          <div className="text-body-sm text-on-surface-variant">kestrel-orders-oct.csv · 12.4 MB</div>
        </Variant>
        <Variant n={13} label="Circular · thick 8dp">
          <CircularProgress value={42} size={80} thickness={8} aria-label="Quota">
            <span className="text-title-sm">42%</span>
          </CircularProgress>
          <CircularProgress value={78} size={80} thickness={8} wavy tone="tertiary" aria-label="Goal">
            <span className="text-title-sm">78%</span>
          </CircularProgress>
        </Variant>
        <CountdownVariant />
        <Variant n={15} label="Indeterminate · under an app bar" className="overflow-hidden rounded-lg bg-surface">
          <div className="flex h-12 items-center gap-1 bg-surface-container px-1">
            <IconButton aria-label="Back">
              <Icon>arrow_back</Icon>
            </IconButton>
            <span className="flex-1 text-title-md">Orders</span>
            <IconButton aria-label="More">
              <Icon>more_vert</Icon>
            </IconButton>
          </div>
          <LinearProgress isIndeterminate aria-label="Loading orders" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-3/4 rounded-full bg-surface-container-highest" />
            <div className="h-3 w-1/2 rounded-full bg-surface-container-highest" />
          </div>
        </Variant>
        <Variant n={16} label="Transfers · in a list" className="divide-y divide-outline-variant rounded-lg bg-surface">
          {[
            ["download", "kestrel-cli-4.2.0.pkg", "2.1 of 4.8 GB", 44, "primary"],
            ["upload", "audit-log-oct.zip", "91%", 91, "tertiary"],
          ].map(([icon, name, meta, v, tone]) => (
            <div key={name as string} className="flex items-center gap-3 p-3">
              <Icon className={tone === "primary" ? "text-primary" : "text-tertiary"}>{icon as string}</Icon>
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex justify-between gap-2 text-body-sm">
                  <span className="truncate">{name}</span>
                  <span className="shrink-0 text-on-surface-variant">{meta}</span>
                </div>
                <LinearProgress value={v as number} tone={tone as "primary" | "tertiary"} aria-label={name as string} />
              </div>
            </div>
          ))}
        </Variant>
      </Variants>
    </Section>
  )
}

function PausedVariant() {
  const [paused, setPaused] = React.useState(true)
  return (
    <Variant n={11} label="Paused · resume" className="flex min-h-24 flex-col justify-center gap-2 rounded-lg bg-surface p-4">
      <div className="flex items-center gap-2 text-label-md text-on-surface-variant">
        <Icon size={18}>{paused ? "pause_circle" : "sync"}</Icon>
        <span className="flex-1">{paused ? "Paused · 54%" : "Syncing · 54%"}</span>
        <Button variant="text" size="xs" onPress={() => setPaused((p) => !p)}>
          {paused ? "Resume" : "Pause"}
        </Button>
      </div>
      <LinearProgress
        value={54}
        aria-label="Sync"
        wavy={!paused}
        className={paused ? "[&_[data-slot=progress-indicator]]:bg-outline [&_[data-slot=progress-track]]:bg-surface-container-highest [&_span]:bg-outline" : undefined}
      />
    </Variant>
  )
}

function CountdownVariant() {
  const [left, setLeft] = React.useState(42)
  React.useEffect(() => {
    const t = setInterval(() => setLeft((s) => (s <= 0 ? 60 : s - 1)), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <Variant n={14} label="Circular · countdown" className="flex min-h-24 items-center gap-4 rounded-lg bg-surface p-4">
      <CircularProgress value={left} maxValue={60} size={56} tone="tertiary" aria-label="Code expiry">
        <Icon size={20} className="text-tertiary">
          timer
        </Icon>
      </CircularProgress>
      <div className="min-w-0">
        <div className="text-title-sm">
          Code expires in 0:{String(left).padStart(2, "0")}
        </div>
        <div className="text-body-sm text-on-surface-variant">Request a new one once it runs out</div>
      </div>
    </Variant>
  )
}
