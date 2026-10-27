import { Checkbox } from "@/components/ui/checkbox"
import { FieldLegend, Fieldset } from "@/components/ui/field"

export default function FieldFieldset() {
  return (
    <Fieldset className="w-full max-w-md">
      <FieldLegend>Notify me about</FieldLegend>
      <div className="grid gap-x-6 sm:grid-cols-2">
        <Checkbox defaultSelected>Failed deploys</Checkbox>
        <Checkbox defaultSelected>Policy changes</Checkbox>
        <Checkbox>New members</Checkbox>
        <Checkbox>Weekly digest</Checkbox>
      </div>
    </Fieldset>
  )
}
