import { Checkbox } from "@/components/ui/checkbox"
import { Row, Section } from "@/docs/section"

export default function CheckboxesSection() {
  return (
    <Section
      id="checkbox"
      description="18dp box, 2dp corners, 48dp touch target with a state layer. Unselected, selected, indeterminate, error and disabled."
      spec="https://m3.material.io/components/checkbox/overview"
    >
      <Row label="States">
        <Checkbox>Unselected</Checkbox>
        <Checkbox defaultSelected>Selected</Checkbox>
        <Checkbox isIndeterminate>Indeterminate</Checkbox>
        <Checkbox isInvalid>Error</Checkbox>
        <Checkbox isDisabled>Disabled</Checkbox>
        <Checkbox isDisabled defaultSelected>
          Disabled selected
        </Checkbox>
      </Row>
    </Section>
  )
}
