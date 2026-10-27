import { Checkbox } from "@/components/ui/checkbox"

export default function CheckboxDemo() {
  return (
    <div className="flex flex-col items-start gap-1">
      <Checkbox defaultSelected>Email me about deploys</Checkbox>
      <Checkbox>Weekly usage report</Checkbox>
      <Checkbox isIndeterminate>Product updates</Checkbox>
    </div>
  )
}
