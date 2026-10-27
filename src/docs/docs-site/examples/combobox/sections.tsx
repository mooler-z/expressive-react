import { ComboBox, ComboBoxItem, ComboBoxSection } from "@/components/ui/combobox"

export default function ComboBoxSections() {
  return (
    <div className="w-full max-w-xs">
      <ComboBox label="Runtime" variant="filled" leading="terminal">
        <ComboBoxSection title="JavaScript">
          <ComboBoxItem id="node22" description="LTS until 2027">Node.js 22</ComboBoxItem>
          <ComboBoxItem id="bun" description="Fast startup">Bun 1.2</ComboBoxItem>
        </ComboBoxSection>
        <ComboBoxSection title="Other">
          <ComboBoxItem id="python" description="With uv">Python 3.13</ComboBoxItem>
          <ComboBoxItem id="go" description="Static binary">Go 1.24</ComboBoxItem>
        </ComboBoxSection>
      </ComboBox>
    </div>
  )
}
