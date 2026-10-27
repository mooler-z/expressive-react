import * as React from "react"

import { Button } from "@/components/ui/button"
import { ChipGroup, FilterChip } from "@/components/ui/chip"
import { EmptyState } from "@/components/ui/empty-state"
import { ChoiceCard, ChoiceGroup, Questionnaire, QuestionnaireStep, RatingScale } from "@/components/ui/questionnaire"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"
import { Section, Variant, Variants } from "@/docs/section"

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

function Onboarding({ onRestart }: { onRestart: () => void }) {
  const [clusters, setClusters] = React.useState<string | null>("2-10")
  const [clouds, setClouds] = React.useState<string[]>(["aws", "onprem"])
  const [focus, setFocus] = React.useState<string | null>("reliability")

  return (
    <Questionnaire
      label="Onboarding"
      className="w-full max-w-xl"
      onSubmit={() => wait(1200)}
      completion={
        <EmptyState
          variant="plain"
          icon="check"
          shape="cookie9"
          title="You're all set"
          description={`${clusters} clusters on ${clouds.length} platform${clouds.length === 1 ? "" : "s"}, focused on ${focus}. We'll tailor your dashboards.`}
          actions={
            <Button variant="tonal" onPress={onRestart}>
              Start over
            </Button>
          }
        />
      }
    >
      <QuestionnaireStep title="How many clusters does your team run today?" isComplete={!!clusters}>
        <ChoiceGroup aria-label="Clusters" value={clusters} onChange={setClusters}>
          <ChoiceCard value="1" icon="looks_one">Just one</ChoiceCard>
          <ChoiceCard value="2-10" icon="hub">2 – 10</ChoiceCard>
          <ChoiceCard value="11-50" icon="lan">11 – 50</ChoiceCard>
          <ChoiceCard value="50+" icon="public">More than 50</ChoiceCard>
        </ChoiceGroup>
      </QuestionnaireStep>
      <QuestionnaireStep title="Which clouds do you run on?" description="Pick all that apply." isComplete={clouds.length > 0}>
        <ChoiceGroup selectionMode="multiple" aria-label="Clouds" value={clouds} onChange={setClouds}>
          <ChoiceCard value="aws" icon="cloud">AWS</ChoiceCard>
          <ChoiceCard value="gcp" icon="cloud_queue">Google Cloud</ChoiceCard>
          <ChoiceCard value="azure" icon="cloud_circle">Azure</ChoiceCard>
          <ChoiceCard value="onprem" icon="dns">On-premise</ChoiceCard>
        </ChoiceGroup>
      </QuestionnaireStep>
      <QuestionnaireStep title="What matters most this quarter?" isComplete={!!focus}>
        <ChoiceGroup aria-label="Priority" value={focus} onChange={setFocus}>
          <ChoiceCard value="cost" icon="savings">Cost</ChoiceCard>
          <ChoiceCard value="reliability" icon="verified">Reliability</ChoiceCard>
          <ChoiceCard value="velocity" icon="speed">Velocity</ChoiceCard>
          <ChoiceCard value="compliance" icon="policy">Compliance</ChoiceCard>
        </ChoiceGroup>
      </QuestionnaireStep>
    </Questionnaire>
  )
}

const TOOLS = ["Kubernetes", "Terraform", "Datadog", "PagerDuty", "GitHub Actions", "Argo CD", "Grafana"]

export default function QuestionnaireSection() {
  const [run, setRun] = React.useState(0)
  const [score, setScore] = React.useState<number | null>(9)
  return (
    <Section
      id="questionnaire"
      description="One question per step: progress on top, headline-small question, large choice cards that morph to secondary-container when selected, back/next in the footer."
    >
      <div className="grid place-items-center">
        <Onboarding key={run} onRestart={() => setRun((r) => r + 1)} />
      </div>

      <Variants cols="md:grid-cols-2">
        <Variant n={1} label="Multi-select chips" className="grid min-h-24 place-items-center rounded-lg bg-surface-container p-4">
          <Questionnaire size="sm" label="Onboarding" defaultStep={1} className="w-full" onSubmit={() => void snackbar("Answers saved")}>
            <QuestionnaireStep title="What's your role?">
              <ChoiceGroup aria-label="Role" defaultValue="sre">
                <ChoiceCard value="sre" icon="engineering">SRE</ChoiceCard>
                <ChoiceCard value="dev" icon="code">Developer</ChoiceCard>
              </ChoiceGroup>
            </QuestionnaireStep>
            <QuestionnaireStep title="Which tools does your team use?" description="Select all that apply" isSkippable>
              <ChipGroup aria-label="Tools" defaultSelectedKeys={["Kubernetes", "Datadog", "Argo CD"]} className="flex flex-wrap gap-2">
                {TOOLS.map((t) => (
                  <FilterChip key={t} id={t}>
                    {t}
                  </FilterChip>
                ))}
              </ChipGroup>
            </QuestionnaireStep>
            <QuestionnaireStep title="Anything else we should know?">
              <TextField label="Notes" multiline rows={3} />
            </QuestionnaireStep>
          </Questionnaire>
        </Variant>

        <Variant n={2} label="Rating scale · 0–10" className="grid min-h-24 place-items-center rounded-lg bg-surface-container p-4">
          <Questionnaire
            size="sm"
            label="Onboarding"
            defaultStep={2}
            className="w-full"
            onSubmit={async () => {
              await wait(1000)
              snackbar("Thanks for the feedback!")
            }}
          >
            <QuestionnaireStep title="What's your role?">
              <ChoiceGroup aria-label="Role" defaultValue="sre">
                <ChoiceCard value="sre" icon="engineering">SRE</ChoiceCard>
                <ChoiceCard value="dev" icon="code">Developer</ChoiceCard>
              </ChoiceGroup>
            </QuestionnaireStep>
            <QuestionnaireStep title="Which tools does your team use?">
              <ChipGroup aria-label="Tools" className="flex flex-wrap gap-2">
                {TOOLS.slice(0, 4).map((t) => (
                  <FilterChip key={t} id={t}>
                    {t}
                  </FilterChip>
                ))}
              </ChipGroup>
            </QuestionnaireStep>
            <QuestionnaireStep
              title="How likely are you to recommend Kestrel?"
              description="0 is not likely, 10 is very likely"
              isComplete={score !== null}
            >
              <RatingScale aria-label="Likelihood to recommend" value={score} onChange={setScore} minLabel="Not likely" maxLabel="Very likely" />
              <TextField label="What's the main reason for your score? (optional)" multiline rows={2} className="mt-4" />
            </QuestionnaireStep>
          </Questionnaire>
        </Variant>
      </Variants>
    </Section>
  )
}
