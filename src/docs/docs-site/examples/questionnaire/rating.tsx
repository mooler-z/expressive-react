import { useState } from "react"

import { RatingScale } from "@/components/ui/questionnaire"

export default function QuestionnaireRating() {
  const [effort, setEffort] = useState<number | null>(3)

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="text-title-md">How easy was setup?</div>
      <RatingScale aria-label="Setup effort" min={1} max={5} value={effort} onChange={setEffort} minLabel="Very hard" maxLabel="Very easy" />
    </div>
  )
}
