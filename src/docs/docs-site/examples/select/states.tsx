import { Select, SelectItem } from "@/components/ui/select"

export default function SelectStates() {
  return (
    <div className="grid w-full max-w-xl gap-6 sm:grid-cols-2">
      <Select label="Plan" isRequired isInvalid errorMessage="Pick a plan to continue">
        <SelectItem id="free">Free</SelectItem>
        <SelectItem id="pro">Pro</SelectItem>
      </Select>
      <Select label="Owner" isDisabled defaultSelectedKey="maya">
        <SelectItem id="maya">Maya Lindqvist</SelectItem>
      </Select>
      <Select label="Density · sm" density="sm" defaultSelectedKey="comfortable">
        <SelectItem id="comfortable">Comfortable</SelectItem>
        <SelectItem id="compact">Compact</SelectItem>
      </Select>
      <Select aria-label="Sort" density="xs" variant="filled" defaultSelectedKey="new">
        <SelectItem id="new">Newest first</SelectItem>
        <SelectItem id="old">Oldest first</SelectItem>
      </Select>
    </div>
  )
}
