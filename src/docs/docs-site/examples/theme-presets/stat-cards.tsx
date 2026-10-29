import { Icon } from "@/components/ui/icon"
import { ThemeScope } from "@/components/ui/theme-provider"

const STATS = [
  { label: "Students", value: "1,284", icon: "school", gradient: "from-[#28c76f] to-[#18e2b6]" },
  { label: "Attendance", value: "96.4%", icon: "how_to_reg", gradient: "from-[#0074ff] to-[#52abff]" },
  { label: "Teachers", value: "86", icon: "groups", gradient: "from-[#6c63ff] to-[#938cff]" },
  { label: "Fees due, ETB", value: "42k", icon: "payments", gradient: "from-[#fb8c00] to-[#ffc940]" },
]

export default function HenonStatCards() {
  return (
    <ThemeScope preset="henon" className="w-full rounded-xl p-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className={`flex items-center gap-3 rounded-lg bg-linear-45 p-4 text-white shadow-[0_6px_16px_-6px_rgb(16_42_102/0.35)] ${s.gradient}`}>
            <Icon name={s.icon} size={34} />
            <div className="min-w-0">
              <div className="truncate text-title-lg font-semibold tabular-nums">{s.value}</div>
              <div className="truncate text-label-md opacity-90">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </ThemeScope>
  )
}
