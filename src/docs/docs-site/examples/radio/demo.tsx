import { Radio, RadioGroup } from "@/components/ui/radio"

export default function RadioDemo() {
  return (
    <RadioGroup label="Plan" defaultValue="pro">
      <Radio value="free">Free</Radio>
      <Radio value="pro">Pro</Radio>
      <Radio value="enterprise">Enterprise</Radio>
    </RadioGroup>
  )
}
