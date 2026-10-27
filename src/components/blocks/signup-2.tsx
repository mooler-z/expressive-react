"use client"

import * as React from "react"
import { Radio, RadioGroup } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { SegmentedButton, SegmentedButtonGroup } from "@/components/ui/button-group"
import { ChipGroup, FilterChip } from "@/components/ui/chip"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

/*
 * Signup 02 · Multi-step
 * Workspace setup in three steps with a vertical stepper (a progress bar on compact).
 * Back and Continue move between steps; finishing shows the ready state.
 */

export interface Signup2Props {
  onComplete?: (values: { teamSize: string; platforms: string[]; storefront: string }) => void
  className?: string
}

const STEPS = [
  { title: "Your account", description: "Name, email and password" },
  { title: "Studio", description: "Team size and platforms" },
  { title: "First title", description: "Connect a storefront" },
]
const SIZES = ["1–10", "11–50", "51–200", "200+"]
const PLATFORMS = ["PC", "PlayStation", "Xbox", "Switch", "iOS", "Android"]
const STOREFRONTS = [
  { id: "steam", mono: "ST", name: "Steamworks", detail: "PC · Steam Deck" },
  { id: "psn", mono: "PS", name: "PlayStation Partners", detail: "PS5 · PS4" },
  { id: "xbox", mono: "XB", name: "Xbox Partner Center", detail: "Series X|S · PC" },
  { id: "apple", mono: "AP", name: "App Store Connect", detail: "iOS · iPadOS" },
]

export function Signup2({ onComplete, className }: Signup2Props) {
  const [step, setStep] = React.useState(0)
  const [done, setDone] = React.useState(false)
  const [size, setSize] = React.useState("11–50")
  const [platforms, setPlatforms] = React.useState(new Set(["PC", "PlayStation", "Xbox", "iOS", "Android"]))
  const [store, setStore] = React.useState("steam")
  const isDone = (i: number) => done || i < step
  const pct = Math.round(((done ? 3 : step) / 3) * 100)

  const next = () => {
    if (step < 2) return setStep(step + 1)
    setDone(true)
    onComplete?.({ teamSize: size, platforms: [...platforms], storefront: store })
  }

  return (
    <div className={cn("grid min-h-[620px] place-items-center bg-surface-container px-4 py-10", className)}>
      <div className="grid w-full max-w-3xl overflow-hidden rounded-xl bg-surface md:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="border-b border-outline-variant bg-surface-container-low p-6 md:border-r md:border-b-0">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-md bg-primary text-on-primary">
              <Icon size={20} filled>
                stadia_controller
              </Icon>
            </span>
            <span className="text-title-lg font-semibold">Lumen</span>
          </div>
          <ol className="mt-8 hidden md:block">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-3" aria-current={i === step && !done ? "step" : undefined}>
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full text-label-lg transition-colors duration-300",
                      isDone(i)
                        ? "bg-primary text-on-primary"
                        : i === step
                          ? "border-2 border-primary text-primary"
                          : "border-2 border-outline-variant text-on-surface-variant",
                    )}
                  >
                    {isDone(i) ? <Icon size={18}>check</Icon> : i + 1}
                  </span>
                  {i < 2 && (
                    <span className={cn("my-1 min-h-8 w-0.5 flex-1 rounded-full transition-colors duration-300", isDone(i) ? "bg-primary" : "bg-outline-variant")} />
                  )}
                </div>
                <div className="pt-1 pb-6">
                  <div className={cn("text-title-sm", i === step && !done ? "text-on-surface" : "text-on-surface-variant")}>{s.title}</div>
                  <div className="text-body-sm text-on-surface-variant">{s.description}</div>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6 md:hidden">
            <div className="text-label-lg">{done ? "All set" : `Step ${step + 1} of 3`}</div>
            <div className="mt-2 h-1.5 rounded-full bg-secondary-container">
              <div className="h-full rounded-full bg-primary transition-[width] duration-500 ease-emphasized" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </aside>

        <div className="flex min-h-[460px] flex-col p-6 md:p-8">
          {done ? (
            <div className="flex flex-1 animate-pop flex-col items-center justify-center gap-3 text-center">
              <span className="grid size-16 place-items-center rounded-full bg-primary-container text-on-primary-container">
                <Icon size={32}>rocket_launch</Icon>
              </span>
              <h2 className="mt-2 text-headline-sm font-medium">Cinder Studio is ready</h2>
              <p className="max-w-sm text-body-md text-on-surface-variant">Importing the last 90 days from Steamworks. Dashboards fill in over the next hour.</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <Button onPress={() => snackbar("Opening Lumen…")}>Open dashboard</Button>
                <Button
                  variant="text"
                  onPress={() => {
                    setStep(0)
                    setDone(false)
                  }}
                >
                  Start over
                </Button>
              </div>
            </div>
          ) : (
            <div key={step} className="animate-fade-up">
              {step === 0 && (
                <div className="space-y-4">
                  <h2 className="text-headline-sm font-medium">Create your account</h2>
                  <TextField label="Full name" autoComplete="name" defaultValue="Maya Ortiz" />
                  <TextField type="email" label="Work email" autoComplete="email" defaultValue="maya@cinder.gg" />
                  <TextField type="password" label="Password" autoComplete="new-password" defaultValue="frostfire-night-42" />
                </div>
              )}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="text-headline-sm font-medium">Tell us about your studio</h2>
                  <TextField label="Studio name" defaultValue="Cinder Studio" />
                  <div>
                    <div id="signup-2-size" className="text-label-lg text-on-surface-variant">
                      Team size
                    </div>
                    <SegmentedButtonGroup
                      aria-labelledby="signup-2-size"
                      className="mt-2"
                      selectedKeys={[size]}
                      onSelectionChange={(keys) => setSize(String([...keys][0] ?? size))}
                    >
                      {SIZES.map((s) => (
                        <SegmentedButton key={s} id={s}>
                          {s}
                        </SegmentedButton>
                      ))}
                    </SegmentedButtonGroup>
                  </div>
                  <div>
                    <div id="signup-2-platforms" className="text-label-lg text-on-surface-variant">
                      Platforms you ship on
                    </div>
                    <ChipGroup
                      aria-labelledby="signup-2-platforms"
                      className="mt-2"
                      selectedKeys={platforms}
                      onSelectionChange={(keys) => setPlatforms(new Set([...keys].map(String)))}
                    >
                      {PLATFORMS.map((p) => (
                        <FilterChip key={p} id={p}>
                          {p}
                        </FilterChip>
                      ))}
                    </ChipGroup>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-headline-sm font-medium">Connect your first title</h2>
                  <p className="text-body-md text-on-surface-variant">Lumen reads players, purchases and sessions from the storefront. You can add more titles later.</p>
                  <RadioGroup aria-label="Storefront" value={store} onChange={setStore} className="grid gap-2 sm:grid-cols-2">
                    {STOREFRONTS.map((s) => (
                      <Radio
                        key={s.id}
                        value={s.id}
                        className={cn(
                          "group state-layer focus-ring relative flex cursor-pointer items-center gap-3 rounded-lg border border-outline-variant p-4",
                          "transition-colors duration-200 data-selected:border-primary data-selected:bg-primary-container/40",
                        )}
                      >
                        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-surface-container-highest text-label-lg">{s.mono}</span>
                        <span className="min-w-0">
                          <span className="block text-title-sm">{s.name}</span>
                          <span className="block text-body-sm text-on-surface-variant">{s.detail}</span>
                        </span>
                        <Icon filled className="absolute top-3 right-3 text-primary opacity-0 transition-opacity group-data-selected:opacity-100">
                          check_circle
                        </Icon>
                      </Radio>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </div>
          )}
          <span className="flex-1" />
          {!done && (
            <div className="mt-8 flex items-center justify-between gap-2">
              <Button variant="text" className={cn("pr-4 pl-3", step === 0 && "invisible")} onPress={() => setStep(Math.max(0, step - 1))}>
                <Icon>arrow_back</Icon>
                Back
              </Button>
              <Button className="pr-4 pl-5" onPress={next}>
                {step === 2 ? "Create workspace" : "Continue"}
                <Icon>arrow_forward</Icon>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
