import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { CircularProgress, LinearProgress } from "@/components/ui/progress"

export default function ProgressLive() {
  const [value, setValue] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setValue((v) => {
        if (v >= 100) {
          setRunning(false)
          return 100
        }
        return Math.min(100, v + 7)
      })
    }, 300)
    return () => clearInterval(id)
  }, [running])

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      <LinearProgress aria-label="Export" value={value} wavy className="w-full" />
      <CircularProgress aria-label="Export" value={value} size={64} thickness={6}>
        <span className="text-label-md tabular-nums">{value}%</span>
      </CircularProgress>
      <Button
        variant="tonal"
        icon={<Icon name={value >= 100 ? "replay" : "play_arrow"} />}
        isDisabled={running}
        onPress={() => {
          setValue(0)
          setRunning(true)
        }}
      >
        {value >= 100 ? "Run again" : "Start export"}
      </Button>
    </div>
  )
}
