import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"

const sizes = ["xs", "sm", "md"] as const

export default function ButtonGroupSizes() {
  return (
    <div className="flex flex-col items-center gap-4">
      {sizes.map((size) => (
        <ConnectedButtonGroup key={size} aria-label={`Alignment, ${size}`} size={size} defaultSelectedKeys={["left"]}>
          <ConnectedButton id="left">Left</ConnectedButton>
          <ConnectedButton id="center">Center</ConnectedButton>
          <ConnectedButton id="right">Right</ConnectedButton>
        </ConnectedButtonGroup>
      ))}
    </div>
  )
}
