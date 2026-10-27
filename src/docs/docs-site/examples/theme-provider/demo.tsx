import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ThemeScope } from "@/components/ui/theme-provider"

const seeds = ["#6750A4", "#0B57D0", "#006A6A", "#9C4146"]

export default function ThemeProviderDemo() {
  const [seed, setSeed] = useState(seeds[1])

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex gap-2">
        {seeds.map((hex) => (
          <button
            key={hex}
            type="button"
            aria-label={`Seed ${hex}`}
            aria-pressed={seed === hex}
            onClick={() => setSeed(hex)}
            className="focus-ring size-8 cursor-pointer rounded-full border-2 border-transparent aria-pressed:border-on-surface"
            style={{ background: hex }}
          />
        ))}
      </div>
      <div className="grid w-full max-w-xl gap-4 sm:grid-cols-2">
        {(["light", "dark"] as const).map((mode) => (
          <ThemeScope key={mode} seed={seed} mode={mode} className="flex flex-col gap-4 rounded-xl p-5">
            <h3 className="text-title-sm text-on-surface capitalize">{mode}</h3>
            <div className="flex flex-wrap gap-2">
              <Button size="xs">Filled</Button>
              <Button size="xs" variant="tonal">Tonal</Button>
              <Button size="xs" variant="outlined">Outlined</Button>
            </div>
            <div className="rounded-lg bg-primary-container p-4 text-on-primary-container">primary-container</div>
            <Switch defaultSelected>Notifications</Switch>
          </ThemeScope>
        ))}
      </div>
    </div>
  )
}
