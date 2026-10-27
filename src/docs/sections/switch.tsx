import { Switch } from "@/components/ui/switch"
import { Row, Section } from "@/docs/section"

export default function SwitchesSection() {
  return (
    <Section
      id="switch"
      description="52×32 track. Unselected: outline border, 16dp outline handle. Selected: primary track, 24dp on-primary handle. Optional icons."
      spec="https://m3.material.io/components/switch/overview"
    >
      <Row label="States">
        <Switch>Off</Switch>
        <Switch defaultSelected>On</Switch>
        <Switch icons defaultSelected>
          With icons
        </Switch>
        <Switch isDisabled>Disabled</Switch>
        <Switch isDisabled defaultSelected>
          Disabled on
        </Switch>
      </Row>
    </Section>
  )
}
