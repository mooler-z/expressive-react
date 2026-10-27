import { Section } from "@/docs/section"
import { useWindowSizeClass, type WindowSizeClass } from "@/hooks/use-window-size-class"
import { cn } from "@/lib/utils"

const ROWS: [WindowSizeClass, string, string, string, string, string][] = [
  ["compact", "Compact", "< 600", "(base)", "Navigation bar", "1"],
  ["medium", "Medium", "600 – 839", "md:", "Navigation rail", "1 (2 optional)"],
  ["expanded", "Expanded", "840 – 1199", "lg:", "Navigation rail", "2"],
  ["large", "Large", "1200 – 1599", "xl:", "Expanded rail / drawer", "2"],
  ["extra-large", "Extra-large", "≥ 1600", "2xl:", "Expanded rail / drawer", "2 – 3"],
]

export default function LayoutSection() {
  const current = useWindowSizeClass()
  return (
    <Section
      id="layout"
      description="Tailwind breakpoints are remapped to M3 window size classes; spacing stays on the 4dp grid. useWindowSizeClass() gives you the same classes in JS. Resize the window to watch the highlighted row change."
      spec="https://m3.material.io/foundations/layout/applying-layout/window-size-classes"
    >
      <div className="-mx-6 overflow-x-auto md:-mx-8">
        <table className="w-full min-w-[640px] text-left text-body-md">
          <thead className="text-label-lg text-on-surface-variant">
            <tr>
              {["Class", "Width", "Tailwind prefix", "Navigation", "Panes"].map((h) => (
                <th key={h} className="px-6 py-4 font-medium md:px-8">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {ROWS.map(([id, name, width, prefix, nav, panes]) => (
              <tr
                key={id}
                aria-current={current === id || undefined}
                className={cn("transition-colors duration-300", current === id && "bg-secondary-container text-on-secondary-container")}
              >
                <td className="px-6 py-4 font-medium md:px-8">
                  {name}
                  {current === id && <span className="ml-2 text-label-md">← now</span>}
                </td>
                <td className="px-6 py-4 md:px-8">{width}</td>
                <td className="px-6 py-4 font-mono text-body-sm md:px-8">{prefix}</td>
                <td className="px-6 py-4 md:px-8">{nav}</td>
                <td className="px-6 py-4 md:px-8">{panes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}
