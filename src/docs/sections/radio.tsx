import { Icon } from "@/components/ui/icon"
import { Radio, RadioGroup } from "@/components/ui/radio"
import { Section, Variant, Variants } from "@/docs/section"

export default function RadioSection() {
  return (
    <Section
      id="radio"
      description="20dp ring, 2dp stroke; selected shows a 10dp primary dot that springs in. Group them in a RadioGroup for arrow-key navigation."
      spec="https://m3.material.io/components/radio-button/overview"
    >
      <RadioGroup aria-label="Plan" defaultValue="standard" orientation="horizontal">
        <div className="grid w-full gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Radio value="standard">Standard</Radio>
          <Radio value="business">Business</Radio>
          <Radio value="enterprise">Enterprise</Radio>
          <Radio value="disabled" isDisabled>
            Disabled
          </Radio>
        </div>
      </RadioGroup>

      <Variants>
        <Variant n={1} label="Tertiary">
          <RadioGroup aria-label="Frequency" defaultValue="weekly" orientation="horizontal">
            <Radio value="weekly" className="[--radio-accent:var(--md-tertiary)]">
              Weekly
            </Radio>
            <Radio value="monthly" className="[--radio-accent:var(--md-tertiary)]">
              Monthly
            </Radio>
          </RadioGroup>
        </Variant>
        <Variant n={2} label="Error · required">
          <RadioGroup label="Severity *" isInvalid isRequired orientation="horizontal" errorMessage="Pick one to file it">
            <Radio value="low">Low</Radio>
            <Radio value="high">High</Radio>
          </RadioGroup>
        </Variant>
        <Variant n={3} label="With descriptions">
          <RadioGroup aria-label="Rollout" defaultValue="rolling">
            {[
              ["rolling", "Rolling", "One node at a time"],
              ["blue-green", "Blue / green", "Swap after health checks"],
            ].map(([v, title, body]) => (
              <Radio key={v} value={v}>
                <span className="min-w-0">
                  <span className="block">{title}</span>
                  <span className="block text-body-sm text-on-surface-variant">{body}</span>
                </span>
              </Radio>
            ))}
          </RadioGroup>
        </Variant>
        <Variant n={4} label="Radio cards">
          <RadioGroup aria-label="Plan" defaultValue="starter" className="w-full">
            <div className="grid w-full gap-2">
              {[
                ["starter", "Starter", "3 projects", "$0"],
                ["team", "Team", "Unlimited projects", "$24"],
              ].map(([v, title, body, price]) => (
                <Radio
                  key={v}
                  value={v}
                  className="flex rounded-md border border-outline-variant py-1 pr-4 transition-colors data-selected:border-primary data-selected:bg-primary/8"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-title-sm">{title}</span>
                    <span className="block text-body-sm text-on-surface-variant">{body}</span>
                  </span>
                  <span className="text-title-md tabular-nums">{price}</span>
                </Radio>
              ))}
            </div>
          </RadioGroup>
        </Variant>
        <Variant n={5} label="Trailing · list" className="overflow-hidden rounded-lg bg-surface">
          <RadioGroup aria-label="Theme" defaultValue="system">
            <div className="divide-y divide-outline-variant">
              {[
                ["system", "contrast", "System"],
                ["light", "light_mode", "Light"],
                ["dark", "dark_mode", "Dark"],
              ].map(([v, icon, label]) => (
                <Radio key={v} value={v} placement="end" className="state-layer flex w-full gap-4 py-1 pr-2 pl-4">
                  <Icon className="text-on-surface-variant">{icon}</Icon>
                  <span className="flex-1">{label}</span>
                </Radio>
              ))}
            </div>
          </RadioGroup>
        </Variant>
        <Variant n={6} label="Inline · horizontal">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-title-sm">Billing</span>
            <RadioGroup aria-label="Billing" defaultValue="monthly" orientation="horizontal">
              <Radio value="monthly">Monthly</Radio>
              <Radio value="yearly">Yearly −20%</Radio>
            </RadioGroup>
          </div>
        </Variant>
        <Variant n={7} label="Dense · 40dp">
          <RadioGroup aria-label="Time zone" defaultValue="utc">
            {["UTC", "Local time", "Server time"].map((v) => (
              <Radio key={v} value={v.toLowerCase() === "utc" ? "utc" : v} dense className="text-body-md">
                {v}
              </Radio>
            ))}
          </RadioGroup>
        </Variant>
        <Variant n={8} label="Spring dot · motion">
          <RadioGroup aria-label="Motion demo" defaultValue="bounce" orientation="horizontal">
            <Radio value="bounce">Bounce in</Radio>
            <Radio value="tap">Tap to switch</Radio>
          </RadioGroup>
        </Variant>
      </Variants>
    </Section>
  )
}
