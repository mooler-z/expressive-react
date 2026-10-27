import { Radio, RadioGroup } from "@/components/ui/radio"

export default function RadioHorizontal() {
  return (
    <RadioGroup label="Billing" orientation="horizontal" defaultValue="monthly">
      <Radio value="monthly">Monthly</Radio>
      <Radio value="yearly">Yearly</Radio>
    </RadioGroup>
  )
}
