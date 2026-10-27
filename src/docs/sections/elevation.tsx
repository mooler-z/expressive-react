import { Section } from "@/docs/section"

const LEVELS = [
  ["level 0", "bg-surface"],
  ["level 1", "bg-surface-container-low shadow-1"],
  ["level 2", "bg-surface-container shadow-2"],
  ["level 3", "bg-surface-container-high shadow-3"],
  ["level 4", "bg-surface-container-high shadow-4"],
  ["level 5", "bg-surface-container-highest shadow-5"],
] as const

export default function ElevationSection() {
  return (
    <Section
      id="elevation"
      description="Levels 0–5 as shadow-1 … shadow-5. M3 prefers tonal surface containers over shadows; combine both for floating elements."
      spec="https://m3.material.io/styles/elevation/overview"
    >
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        {LEVELS.map(([label, className]) => (
          <div key={label} className={`flex h-24 items-end rounded-md p-3 font-mono text-body-sm ${className}`}>
            {label}
          </div>
        ))}
      </div>
    </Section>
  )
}
