import { Radio, RadioGroup } from "@/components/ui/radio"

export default function RadioAccentDense() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-10">
      <RadioGroup label="Theme · tertiary" defaultValue="system">
        <Radio value="light" className="[--radio-accent:var(--md-tertiary)]">Light</Radio>
        <Radio value="dark" className="[--radio-accent:var(--md-tertiary)]">Dark</Radio>
        <Radio value="system" className="[--radio-accent:var(--md-tertiary)]">System</Radio>
      </RadioGroup>
      <RadioGroup label="Density · 40dp" defaultValue="compact">
        <Radio value="comfortable" dense>Comfortable</Radio>
        <Radio value="compact" dense>Compact</Radio>
        <Radio value="disabled" dense isDisabled>Disabled</Radio>
      </RadioGroup>
    </div>
  )
}
