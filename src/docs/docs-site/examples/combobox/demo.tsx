import { ComboBox, ComboBoxItem } from "@/components/ui/combobox"

const REGIONS = [
  { id: "iad", name: "US East (N. Virginia)" },
  { id: "pdx", name: "US West (Oregon)" },
  { id: "gru", name: "South America (São Paulo)" },
  { id: "fra", name: "Europe (Frankfurt)" },
  { id: "arn", name: "Europe (Stockholm)" },
  { id: "nrt", name: "Asia Pacific (Tokyo)" },
  { id: "syd", name: "Asia Pacific (Sydney)" },
]

export default function ComboBoxDemo() {
  return (
    <div className="w-full max-w-xs">
      <ComboBox label="Region" defaultItems={REGIONS} placeholder="Search regions">
        {(region) => (
          <ComboBoxItem id={region.id} icon="public">
            {region.name}
          </ComboBoxItem>
        )}
      </ComboBox>
    </div>
  )
}
