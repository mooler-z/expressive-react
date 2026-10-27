import * as React from "react"
import { Button as AriaButton, Dialog, DialogTrigger, ListBox, ListBoxItem, Popover } from "react-aria-components"

import { LandingBento } from "@/components/blocks/marketing/landing-bento"
import { LandingCalculator } from "@/components/blocks/marketing/landing-calculator"
import { LandingEditorial } from "@/components/blocks/marketing/landing-editorial"
import { LandingGlobal } from "@/components/blocks/marketing/landing-global"
import { LandingMarquee } from "@/components/blocks/marketing/landing-marquee"
import { LandingOrbit } from "@/components/blocks/marketing/landing-orbit"
import { LandingPlayful } from "@/components/blocks/marketing/landing-playful"
import { LandingSplit } from "@/components/blocks/marketing/landing-split"
import { LandingSteps } from "@/components/blocks/marketing/landing-steps"
import { LandingTerminal } from "@/components/blocks/marketing/landing-terminal"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { useTheme } from "@/components/ui/theme-provider"

export const meta = { path: "/landing-variants" }

const VARIANTS: [string, React.ComponentType][] = [
  ["Orbit", LandingOrbit],
  ["Bento", LandingBento],
  ["Terminal", LandingTerminal],
  ["Editorial", LandingEditorial],
  ["Split", LandingSplit],
  ["Marquee", LandingMarquee],
  ["Global", LandingGlobal],
  ["Steps", LandingSteps],
  ["Calculator", LandingCalculator],
  ["Playful", LandingPlayful],
]
const KEY = "lv-variant"

function initial() {
  const h = Number((window.location.hash.match(/v=(\d+)/) || [])[1])
  if (h >= 1 && h <= VARIANTS.length) return h
  try {
    const saved = Number(localStorage.getItem(KEY))
    if (saved >= 1 && saved <= VARIANTS.length) return saved
  } catch {
    // storage blocked: start at 1
  }
  return 1
}

export default function Page() {
  const [v, setV] = React.useState(initial)
  const { resolvedMode, setMode } = useTheme()
  const dark = resolvedMode === "dark"
  const go = (n: number) => setV(((n - 1 + VARIANTS.length) % VARIANTS.length) + 1)

  React.useEffect(() => {
    const onHash = () => {
      const n = Number((window.location.hash.match(/v=(\d+)/) || [])[1])
      if (n >= 1 && n <= VARIANTS.length) setV(n)
    }
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  React.useEffect(() => {
    try {
      localStorage.setItem(KEY, String(v))
    } catch {
      // ignore
    }
    window.history.replaceState(null, "", `#v=${v}`)
    window.scrollTo({ top: 0 })
  }, [v])

  const [name, Variant] = VARIANTS[v - 1]
  return (
    <div className="min-h-screen bg-surface pb-24 font-sans text-on-surface">
      <div key={v} className="animate-[m3-fade-in_300ms_var(--md-easing-standard)]">
        <Variant />
      </div>

      {/* Floating variant switcher (docs only) */}
      <div className="fixed inset-x-0 bottom-4 z-[70] flex justify-center px-3">
        <div className="relative flex h-16 items-center gap-1 rounded-full bg-inverse-surface px-2 text-inverse-on-surface shadow-4">
          <IconButton aria-label="Previous variant" size="md" width="narrow" className="size-12 text-inverse-on-surface" onPress={() => go(v - 1)}>
            <Icon>chevron_left</Icon>
          </IconButton>
          <DialogTrigger>
            <AriaButton className="state-layer focus-ring inline-flex h-12 min-w-44 cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-label-lg outline-none">
              <span className="grid size-7 place-items-center rounded-full bg-inverse-primary text-label-md text-on-primary-fixed tabular-nums">{v}</span>
              {name}
              <Icon size={20}>expand_less</Icon>
            </AriaButton>
            <Popover placement="top" offset={8} className="w-64 rounded-lg bg-surface-container py-2 text-on-surface shadow-3 outline-none data-entering:animate-pop">
              <Dialog aria-label="Variants" className="outline-none">
                {({ close }) => (
                  <ListBox
                    aria-label="Variants"
                    selectionMode="single"
                    selectedKeys={[String(v)]}
                    onAction={(k) => {
                      setV(Number(k))
                      close()
                    }}
                    className="outline-none"
                  >
                    {VARIANTS.map(([n], i) => (
                      <ListBoxItem
                        key={n}
                        id={String(i + 1)}
                        textValue={n}
                        className="state-layer flex h-12 cursor-pointer items-center gap-3 px-4 text-label-lg outline-none data-focus-visible:bg-on-surface/10 data-selected:bg-secondary-container data-selected:text-on-secondary-container"
                      >
                        <span className="w-6 font-mono text-label-md text-on-surface-variant">{String(i + 1).padStart(2, "0")}</span>
                        {n}
                      </ListBoxItem>
                    ))}
                  </ListBox>
                )}
              </Dialog>
            </Popover>
          </DialogTrigger>
          <IconButton aria-label="Next variant" size="md" width="narrow" className="size-12 text-inverse-on-surface" onPress={() => go(v + 1)}>
            <Icon>chevron_right</Icon>
          </IconButton>
          <span className="mx-1 h-8 w-px bg-inverse-on-surface/20" />
          <IconButton aria-label="Toggle dark mode" size="md" width="narrow" className="size-12 text-inverse-on-surface" onPress={() => setMode(dark ? "light" : "dark")}>
            <Icon>{dark ? "light_mode" : "dark_mode"}</Icon>
          </IconButton>
        </div>
      </div>
    </div>
  )
}
