import { useState } from "react"

import { Slider } from "@/components/ui/slider"

export default function SliderRange() {
  const [range, setRange] = useState([20, 60])
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <Slider
        label="Price"
        value={range}
        onChange={(v) => setRange(v as number[])}
        formatOptions={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
        showOutput
      />
      <p className="text-body-sm text-on-surface-variant">
        Plans between ${range[0]} and ${range[1]} a month
      </p>
    </div>
  )
}
