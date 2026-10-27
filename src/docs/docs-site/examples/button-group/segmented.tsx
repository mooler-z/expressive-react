import { SegmentedButton, SegmentedButtonGroup } from "@/components/ui/button-group"

export default function ButtonGroupSegmented() {
  return (
    <SegmentedButtonGroup aria-label="Shipping" defaultSelectedKeys={["standard"]} className="w-full max-w-md">
      <SegmentedButton id="pickup" icon="storefront">Pickup</SegmentedButton>
      <SegmentedButton id="standard" icon="local_shipping">Standard</SegmentedButton>
      <SegmentedButton id="express" icon="bolt">Express</SegmentedButton>
    </SegmentedButtonGroup>
  )
}
