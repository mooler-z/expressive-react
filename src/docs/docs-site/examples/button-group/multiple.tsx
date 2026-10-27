import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"

export default function ButtonGroupMultiple() {
  return (
    <ConnectedButtonGroup aria-label="Text style" selectionMode="multiple" defaultSelectedKeys={["bold"]}>
      <ConnectedButton id="bold" iconOnly aria-label="Bold">
        <Icon name="format_bold" />
      </ConnectedButton>
      <ConnectedButton id="italic" iconOnly aria-label="Italic">
        <Icon name="format_italic" />
      </ConnectedButton>
      <ConnectedButton id="underline" iconOnly aria-label="Underline">
        <Icon name="format_underlined" />
      </ConnectedButton>
      <ConnectedButton id="strike" iconOnly aria-label="Strikethrough">
        <Icon name="strikethrough_s" />
      </ConnectedButton>
    </ConnectedButtonGroup>
  )
}
