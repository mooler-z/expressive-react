import { useState } from "react"

import { Button } from "@/components/ui/button"
import { PaginationDots } from "@/components/ui/pagination"

const steps = ["Welcome", "Pick a theme", "Invite your team", "You're all set"]

export default function PaginationDotsExample() {
  const [index, setIndex] = useState(0)

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4 rounded-xl border border-outline-variant p-6">
      <p className="text-title-lg">{steps[index]}</p>
      <PaginationDots aria-label="Onboarding steps" count={steps.length} index={index} onIndexChange={setIndex} label={(i) => steps[i]} />
      <Button size="xs" variant="tonal" isDisabled={index === steps.length - 1} onPress={() => setIndex((i) => i + 1)}>
        Next
      </Button>
    </div>
  )
}
