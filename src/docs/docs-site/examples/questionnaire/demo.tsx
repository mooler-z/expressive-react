import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { ChoiceCard, ChoiceGroup, Questionnaire, QuestionnaireStep, RatingScale } from "@/components/ui/questionnaire"

const save = () => new Promise<void>((resolve) => setTimeout(resolve, 900))

export default function QuestionnaireDemo() {
  const [clusters, setClusters] = useState<string | null>(null)
  const [clouds, setClouds] = useState<string[]>([])
  const [score, setScore] = useState<number | null>(null)
  const [key, setKey] = useState(0)

  return (
    <Questionnaire
      key={key}
      label="Onboarding"
      onSubmit={save}
      completion={
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <Icon name="check_circle" filled size={40} className="text-primary" />
          <div className="text-headline-sm">Thanks, you're all set</div>
          <p className="text-body-md text-on-surface-variant">We tuned your dashboards for {clusters === "many" ? "a fleet" : "your clusters"}.</p>
          <Button variant="text" onPress={() => setKey((k) => k + 1)}>
            Start over
          </Button>
        </div>
      }
      className="w-full max-w-lg"
    >
      <QuestionnaireStep title="How many clusters does your team run?" isComplete={!!clusters}>
        <ChoiceGroup aria-label="Clusters" value={clusters} onChange={setClusters}>
          <ChoiceCard value="one" icon="looks_one">
            Just one
          </ChoiceCard>
          <ChoiceCard value="few" icon="filter_3">
            Two to five
          </ChoiceCard>
          <ChoiceCard value="many" icon="hub">
            More than five
          </ChoiceCard>
        </ChoiceGroup>
      </QuestionnaireStep>
      <QuestionnaireStep title="Which clouds do you deploy to?" description="Pick all that apply." isComplete={clouds.length > 0}>
        <ChoiceGroup selectionMode="multiple" aria-label="Clouds" value={clouds} onChange={setClouds}>
          <ChoiceCard value="aws">AWS</ChoiceCard>
          <ChoiceCard value="gcp">Google Cloud</ChoiceCard>
          <ChoiceCard value="azure">Azure</ChoiceCard>
        </ChoiceGroup>
      </QuestionnaireStep>
      <QuestionnaireStep title="How likely are you to recommend Kestrel?" isComplete={score !== null}>
        <RatingScale aria-label="Recommendation score" value={score} onChange={setScore} minLabel="Not likely" maxLabel="Very likely" />
      </QuestionnaireStep>
    </Questionnaire>
  )
}
