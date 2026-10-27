import { Checkbox } from "@/components/ui/checkbox"

export default function CheckboxStates() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
      <Checkbox>Unselected</Checkbox>
      <Checkbox defaultSelected>Selected</Checkbox>
      <Checkbox isIndeterminate>Indeterminate</Checkbox>
      <Checkbox isInvalid>Error</Checkbox>
      <Checkbox isDisabled>Disabled</Checkbox>
      <Checkbox isDisabled defaultSelected>Disabled selected</Checkbox>
    </div>
  )
}
