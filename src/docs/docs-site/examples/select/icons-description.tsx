import { Select, SelectItem } from "@/components/ui/select"

export default function SelectIconsDescription() {
  return (
    <div className="w-72">
      <Select label="Visibility" icon="visibility" defaultSelectedKey="team" description="Who can open this dashboard">
        <SelectItem id="private" icon="lock" description="Only you">Private</SelectItem>
        <SelectItem id="team" icon="group" description="Everyone on Platform">Team</SelectItem>
        <SelectItem id="public" icon="public" description="Anyone with the link">Public</SelectItem>
      </Select>
    </div>
  )
}
