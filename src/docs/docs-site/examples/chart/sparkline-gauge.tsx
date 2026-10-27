import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Gauge, Sparkline } from "@/components/ui/chart"

const TREND = [12, 18, 15, 22, 19, 27, 24, 31, 29, 36]

export default function SparklineAndGauge() {
  const [used, setUsed] = useState(62)

  return (
    <div className="grid w-full max-w-2xl items-center gap-6 sm:grid-cols-2">
      <div className="flex items-end justify-between gap-3 rounded-lg bg-surface-container p-4">
        <div>
          <div className="text-headline-md tabular-nums">2,418</div>
          <div className="text-body-sm text-on-surface-variant">signups in the last 10 days</div>
        </div>
        <Sparkline data={TREND} color="tertiary" className="h-12 w-28" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <Gauge value={used} sublabel="of error budget used" aria-label="Error budget used" className="max-w-[200px]" />
        <Button size="xs" variant="tonal" onPress={() => setUsed((u) => (u >= 95 ? 20 : u + 15))}>
          Burn budget
        </Button>
      </div>
    </div>
  )
}
