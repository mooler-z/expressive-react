import { Select, SelectItem, SelectSection } from "@/components/ui/select"

export default function SelectSections() {
  return (
    <div className="w-72">
      <Select label="Instance type" defaultSelectedKey="m7">
        <SelectSection title="General purpose">
          <SelectItem id="t4">t4 · 2 vCPU · 4 GB</SelectItem>
          <SelectItem id="m7">m7 · 4 vCPU · 16 GB</SelectItem>
        </SelectSection>
        <SelectSection title="Memory optimized">
          <SelectItem id="r7">r7 · 4 vCPU · 32 GB</SelectItem>
          <SelectItem id="x2">x2 · 8 vCPU · 128 GB</SelectItem>
        </SelectSection>
      </Select>
    </div>
  )
}
