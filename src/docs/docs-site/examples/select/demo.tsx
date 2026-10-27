import { Select, SelectItem } from "@/components/ui/select"

export default function SelectDemo() {
  return (
    <div className="flex w-full max-w-xl flex-wrap justify-center gap-6">
      <div className="w-64">
        <Select label="Region" defaultSelectedKey="fra">
          <SelectItem id="iad">US East (N. Virginia)</SelectItem>
          <SelectItem id="pdx">US West (Oregon)</SelectItem>
          <SelectItem id="fra">Europe (Frankfurt)</SelectItem>
          <SelectItem id="nrt">Asia Pacific (Tokyo)</SelectItem>
        </Select>
      </div>
      <div className="w-64">
        <Select label="Plan" variant="filled">
          <SelectItem id="free">Free</SelectItem>
          <SelectItem id="pro">Pro</SelectItem>
          <SelectItem id="enterprise">Enterprise</SelectItem>
        </Select>
      </div>
    </div>
  )
}
