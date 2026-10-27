import * as React from "react"

import { Section } from "@/docs/section"
import { cn } from "@/lib/utils"

/* Each row plays on hover (or tap). Transition values are inline styles so every row can use its own token. */
const SPRINGS = [
  ["fast-spatial", "ζ 0.6 · k 800", "Shape morphs, small moves (buttons, switches)", "bg-primary"],
  ["default-spatial", "ζ 0.8 · k 380", "Medium moves: sheets, menus, cards", "bg-secondary"],
  ["slow-spatial", "ζ 0.8 · k 200", "Large moves: full-screen transitions", "bg-tertiary"],
] as const

const EASINGS = [
  ["ease-emphasized", "--md-easing-emphasized", "bg-primary"],
  ["ease-emphasized-decelerate", "--md-easing-emphasized-decelerate", "bg-secondary"],
  ["ease-emphasized-accelerate", "--md-easing-emphasized-accelerate", "bg-tertiary"],
  ["ease-bounce", "--md-easing-bounce", "bg-primary-fixed-dim"],
] as const

function Track({ label, sub, timing, dot }: { label: string; sub?: string; timing: React.CSSProperties; dot: string }) {
  const [on, setOn] = React.useState(false)
  return (
    <div
      className="grid cursor-pointer grid-cols-[150px_1fr] items-center gap-4 rounded-full bg-surface-container px-5 py-2 sm:grid-cols-[240px_1fr]"
      onPointerEnter={(e) => e.pointerType === "mouse" && setOn(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOn(false)}
      onClick={() => setOn((v) => !v)}
    >
      <span className="min-w-0">
        <span className="block truncate font-mono text-body-sm">{label}</span>
        {sub && <span className="block truncate text-body-sm text-on-surface-variant">{sub}</span>}
      </span>
      <div className="relative h-8">
        <div
          className={cn("absolute top-1 size-6", dot)}
          style={{
            ...timing,
            transitionProperty: "left, border-radius",
            left: on ? "calc(100% - 24px)" : 0,
            borderRadius: on ? 6 : 12,
          }}
        />
      </div>
    </div>
  )
}

export default function MotionSection() {
  return (
    <Section
      id="motion"
      description="The M3 Expressive motion scheme. Springs are compiled to CSS linear() curves with their settle durations (--md-spring-*), and the classic easings stay available. Hover or tap a row to play it."
      spec="https://m3.material.io/styles/motion/overview"
    >
      <div className="space-y-3">
        <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Expressive springs · spatial</div>
        {SPRINGS.map(([name, params, use, dot]) => (
          <Track
            key={name}
            label={`ease-${name}`}
            sub={`${params} · ${use}`}
            dot={dot}
            timing={{ transitionDuration: `var(--md-spring-${name}-duration)`, transitionTimingFunction: `var(--md-spring-${name})` }}
          />
        ))}
      </div>
      <div className="space-y-3">
        <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Expressive springs · effects (color, opacity)</div>
        <EffectsDemo />
      </div>
      <div className="space-y-3">
        <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Easing curves · 700ms</div>
        {EASINGS.map(([label, token, dot]) => (
          <Track key={label} label={label} dot={dot} timing={{ transitionDuration: "700ms", transitionTimingFunction: `var(${token})` }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-body-sm text-on-surface-variant">
        <span>shape-morph</span>
        <span>ease-fast-spatial duration-(--md-spring-fast-spatial-duration)</span>
        <span>animate-morph</span>
        <span>animate-indeterminate</span>
        <span>animate-fade-up</span>
        <span>animate-pop</span>
        <span>animate-float</span>
      </div>
    </Section>
  )
}

function EffectsDemo() {
  const [on, setOn] = React.useState(false)
  return (
    <div className="flex flex-wrap gap-3">
      {(["fast-effects", "default-effects", "slow-effects"] as const).map((name) => (
        <button
          key={name}
          className={cn(
            "state-layer focus-ring flex h-14 flex-1 cursor-pointer items-center justify-center rounded-lg px-4 font-mono text-body-sm",
            on ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface",
          )}
          style={{
            transitionProperty: "background-color, color",
            transitionDuration: `var(--md-spring-${name}-duration)`,
            transitionTimingFunction: `var(--md-spring-${name})`,
          }}
          onClick={() => setOn((v) => !v)}
        >
          ease-{name}
        </button>
      ))}
    </div>
  )
}
