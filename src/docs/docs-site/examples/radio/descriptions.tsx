import { Radio, RadioGroup } from "@/components/ui/radio"

const STRATEGIES = [
  { id: "rolling", title: "Rolling", description: "Replace instances a few at a time" },
  { id: "canary", title: "Canary", description: "Send 5% of traffic to the new version first" },
  { id: "blue-green", title: "Blue-green", description: "Switch all traffic once the new fleet is healthy" },
]

export default function RadioDescriptions() {
  return (
    <RadioGroup label="Rollout" defaultValue="canary" description="You can change this per environment.">
      {STRATEGIES.map((s) => (
        <Radio key={s.id} value={s.id} className="items-start">
          <span className="pt-3">
            <span className="block text-body-lg">{s.title}</span>
            <span className="block text-body-md text-on-surface-variant">{s.description}</span>
          </span>
        </Radio>
      ))}
    </RadioGroup>
  )
}
