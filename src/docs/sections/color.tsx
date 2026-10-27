import * as React from "react"

import { Section } from "@/docs/section"
import { cn } from "@/lib/utils"

/** Reads the live value of each --md-* role; re-reads when the theme class or injected seed style changes. */
function useRoleHex() {
  const [hex, setHex] = React.useState<Record<string, string>>({})
  React.useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement)
      const next: Record<string, string> = {}
      for (const role of ALL_ROLES) next[role] = cs.getPropertyValue(`--md-${role}`).trim()
      setHex(next)
    }
    read()
    const mo = new MutationObserver(read)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    mo.observe(document.head, { childList: true, subtree: true, characterData: true })
    return () => mo.disconnect()
  }, [])
  return hex
}

const KEY = [
  ["primary", "bg-primary text-on-primary", "bg-on-primary text-primary", "bg-primary-container text-on-primary-container", "bg-on-primary-container text-primary-container"],
  ["secondary", "bg-secondary text-on-secondary", "bg-on-secondary text-secondary", "bg-secondary-container text-on-secondary-container", "bg-on-secondary-container text-secondary-container"],
  ["tertiary", "bg-tertiary text-on-tertiary", "bg-on-tertiary text-tertiary", "bg-tertiary-container text-on-tertiary-container", "bg-on-tertiary-container text-tertiary-container"],
  ["error", "bg-error text-on-error", "bg-on-error text-error", "bg-error-container text-on-error-container", "bg-on-error-container text-error-container"],
] as const

const SURFACES = [
  ["surface", "bg-surface border border-outline-variant"],
  ["surface-dim", "bg-surface-dim"],
  ["surface-bright", "bg-surface-bright border border-outline-variant"],
  ["surface-container-lowest", "bg-surface-container-lowest border border-outline-variant"],
  ["surface-container-low", "bg-surface-container-low"],
  ["surface-container", "bg-surface-container"],
  ["surface-container-high", "bg-surface-container-high"],
  ["surface-container-highest", "bg-surface-container-highest"],
  ["surface-variant", "bg-surface-variant"],
] as const

const CONTENT = [
  ["on-surface", "bg-on-surface text-surface"],
  ["on-surface-variant", "bg-on-surface-variant text-surface"],
  ["outline", "bg-outline text-surface"],
  ["outline-variant", "bg-outline-variant text-on-surface"],
  ["inverse-surface", "bg-inverse-surface text-inverse-on-surface"],
  ["inverse-on-surface", "bg-inverse-on-surface text-inverse-surface"],
  ["inverse-primary", "bg-inverse-primary text-on-primary-container"],
] as const

const FIXED = [
  ["primary-fixed", "bg-primary-fixed text-on-primary-fixed"],
  ["primary-fixed-dim", "bg-primary-fixed-dim text-on-primary-fixed"],
  ["on-primary-fixed", "bg-on-primary-fixed text-primary-fixed"],
  ["on-primary-fixed-variant", "bg-on-primary-fixed-variant text-primary-fixed"],
  ["secondary-fixed", "bg-secondary-fixed text-on-secondary-fixed"],
  ["secondary-fixed-dim", "bg-secondary-fixed-dim text-on-secondary-fixed"],
  ["tertiary-fixed", "bg-tertiary-fixed text-on-tertiary-fixed"],
  ["tertiary-fixed-dim", "bg-tertiary-fixed-dim text-on-tertiary-fixed"],
] as const

const ALL_ROLES = [
  ...KEY.flatMap(([r]) => [r, `on-${r}`, `${r}-container`, `on-${r}-container`]),
  ...SURFACES.map(([r]) => r),
  ...CONTENT.map(([r]) => r),
  ...FIXED.map(([r]) => r),
]

function Swatch({ role, className, hex, label }: { role: string; className: string; hex?: string; label?: string }) {
  return (
    <div className={cn("flex flex-col justify-end gap-0.5 p-2", className)}>
      <span className="truncate text-label-md">{label ?? role}</span>
      {hex && <span className="font-mono text-label-sm opacity-70">{hex}</span>}
    </div>
  )
}

export default function ColorSection() {
  const hex = useRoleHex()
  return (
    <Section
      id="color"
      description="Each role is a Tailwind color: bg-primary text-on-primary, bg-surface-container-high, and alpha works too (bg-primary/10). Toggle dark mode or pick a seed in the top bar; every swatch and value updates."
      spec="https://m3.material.io/styles/color/roles"
    >
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {KEY.map(([r, a, b, c, d]) => (
          <div key={r} className="space-y-1">
            <Swatch role={r} hex={hex[r]} className={cn("h-20 rounded-t-md", a)} />
            <Swatch role={`on-${r}`} hex={hex[`on-${r}`]} className={cn("h-12", b)} />
            <Swatch role={`${r}-container`} hex={hex[`${r}-container`]} className={cn("h-20", c)} />
            <Swatch role={`on-${r}-container`} hex={hex[`on-${r}-container`]} className={cn("h-12 rounded-b-md", d)} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1 md:grid-cols-5 lg:grid-cols-9">
        {SURFACES.map(([r, c], i) => (
          <Swatch
            key={r}
            role={r}
            label={r.replace("surface-container-", "container-").replace("surface-container", "container")}
            hex={hex[r]}
            className={cn("h-20 text-on-surface", c, i === 0 && "rounded-l-md", i === SURFACES.length - 1 && "rounded-r-md")}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1 md:grid-cols-7">
        {CONTENT.map(([r, c], i) => (
          <Swatch key={r} role={r} hex={hex[r]} className={cn("h-16", c, i === 0 && "rounded-l-md", i === CONTENT.length - 1 && "rounded-r-md")} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1 md:grid-cols-4 lg:grid-cols-8">
        {FIXED.map(([r, c], i) => (
          <Swatch key={r} role={r} hex={hex[r]} className={cn("h-16", c, i === 0 && "rounded-l-md", i === FIXED.length - 1 && "rounded-r-md")} />
        ))}
      </div>
    </Section>
  )
}
