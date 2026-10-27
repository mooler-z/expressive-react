import { useState } from "react"

import { Button } from "@/components/ui/button"
import { RevealWords } from "@/components/ui/reveal"

export default function RevealWordsExample() {
  const [run, setRun] = useState(0)

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <RevealWords key={`slow-${run}`} as="p" stagger={140} className="justify-center text-headline-sm">
        One word at a time
      </RevealWords>
      <RevealWords key={`late-${run}`} as="p" delay={500} stagger={40} className="justify-center text-title-md text-on-surface-variant">
        then the rest, quickly, after a pause.
      </RevealWords>
      <Button variant="text" onPress={() => setRun((n) => n + 1)}>
        Replay
      </Button>
    </div>
  )
}
