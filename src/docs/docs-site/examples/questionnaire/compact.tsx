import { useState } from "react"

import { ChoiceCard, ChoiceGroup, Questionnaire, QuestionnaireStep } from "@/components/ui/questionnaire"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"

export default function QuestionnaireCompact() {
  const [role, setRole] = useState<string | null>(null)
  const [followUp, setFollowUp] = useState<string | null>(null)

  return (
    <div className="w-full max-w-sm rounded-xl bg-surface-container-low p-5">
      <Questionnaire
        size="sm"
        variant="plain"
        label="Feedback"
        onSubmit={() => {
          snackbar("Feedback sent")
        }}
      >
        <QuestionnaireStep title="What's your role?" isComplete={!!role}>
          <ChoiceGroup aria-label="Role" value={role} onChange={setRole}>
            <ChoiceCard value="eng">Engineer</ChoiceCard>
            <ChoiceCard value="sre">SRE / platform</ChoiceCard>
            <ChoiceCard value="lead">Lead</ChoiceCard>
          </ChoiceGroup>
        </QuestionnaireStep>
        <QuestionnaireStep title="Anything we should know?" description="Optional" isSkippable>
          <TextField label="Notes" multiline rows={3} />
        </QuestionnaireStep>
        <QuestionnaireStep title="Can we follow up?" isComplete={!!followUp}>
          <ChoiceGroup aria-label="Follow up" value={followUp} onChange={setFollowUp}>
            <ChoiceCard value="yes">Yes, email me</ChoiceCard>
            <ChoiceCard value="no">No thanks</ChoiceCard>
          </ChoiceGroup>
        </QuestionnaireStep>
      </Questionnaire>
    </div>
  )
}
