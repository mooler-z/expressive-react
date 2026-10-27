import { ComboBox, ComboBoxItem } from "@/components/ui/combobox"

const OWNERS = [
  { id: "maya", name: "Maya Lindqvist" },
  { id: "jonah", name: "Jonah Park" },
]

export default function ComboBoxStates() {
  return (
    <div className="grid w-full max-w-xl gap-6 sm:grid-cols-2">
      <ComboBox label="Owner" defaultItems={OWNERS} isRequired isInvalid errorMessage="Assign an owner">
        {(o) => <ComboBoxItem id={o.id}>{o.name}</ComboBoxItem>}
      </ComboBox>
      <ComboBox label="Owner" defaultItems={OWNERS} defaultSelectedKey="maya" isDisabled>
        {(o) => <ComboBoxItem id={o.id}>{o.name}</ComboBoxItem>}
      </ComboBox>
    </div>
  )
}
