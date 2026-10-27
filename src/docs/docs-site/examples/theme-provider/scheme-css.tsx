import { useEffect, useState } from "react"

import { CodeBlock } from "@/components/ui/code-block"
import { schemeColors } from "@/components/ui/theme-provider"

export default function ThemeProviderSchemeCss() {
  const [colors, setColors] = useState<Record<string, string>>({})

  useEffect(() => {
    schemeColors("#006A6A", "tonalSpot", 0, false).then(setColors)
  }, [])

  const roles = ["--md-primary", "--md-on-primary", "--md-primary-container", "--md-surface", "--md-surface-container"]
  const code = roles.map((role) => `${role}: ${colors[role] ?? "…"};`).join("\n")

  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <div className="flex gap-2">
        {roles.map((role) => (
          <span key={role} title={role} className="h-10 flex-1 rounded-sm" style={{ background: colors[role] }} />
        ))}
      </div>
      <CodeBlock code={code} language="css" filename="schemeColors('#006A6A')" />
    </div>
  )
}
