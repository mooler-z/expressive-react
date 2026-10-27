import { ChoiceCard, ChoiceGroup } from "@/components/ui/questionnaire"

export default function QuestionnaireChoices() {
  return (
    <ChoiceGroup aria-label="Deploy strategy" defaultValue="canary" className="w-full max-w-md">
      <ChoiceCard value="rolling" icon="autorenew" description="Replace pods in batches of 25%">
        Rolling
      </ChoiceCard>
      <ChoiceCard value="blue-green" icon="swap_horiz" description="Switch traffic once the new stack is healthy">
        Blue / green
      </ChoiceCard>
      <ChoiceCard value="canary" icon="science" description="Send 5% of traffic first">
        Canary
      </ChoiceCard>
      <ChoiceCard value="recreate" icon="restart_alt" description="Not available on the free plan" isDisabled>
        Recreate
      </ChoiceCard>
    </ChoiceGroup>
  )
}
