import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { RevealWords } from "@/components/ui/reveal"

export default function RevealDemo() {
  const [run, setRun] = useState(0)

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <RevealWords key={run} as="h2" className="justify-center text-display-sm">
        Components that <span className="text-primary">bounce</span> back.
      </RevealWords>
      <Button variant="tonal" icon={<Icon name="replay" />} onPress={() => setRun((n) => n + 1)}>
        Replay
      </Button>
    </div>
  )
}
