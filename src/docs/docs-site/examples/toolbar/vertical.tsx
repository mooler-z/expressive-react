import { Icon } from "@/components/ui/icon"
import { FloatingToolbar, ToolbarButton, ToolbarSeparator, ToolbarToggleButton, ToolbarToggleGroup } from "@/components/ui/toolbar"

export default function ToolbarVertical() {
  return (
    <FloatingToolbar aria-label="Canvas tools" orientation="vertical">
      <ToolbarToggleGroup aria-label="Tool" selectionMode="single" disallowEmptySelection defaultSelectedKeys={["select"]}>
        <ToolbarToggleButton id="select" aria-label="Select">
          <Icon name="arrow_selector_tool" />
        </ToolbarToggleButton>
        <ToolbarToggleButton id="draw" aria-label="Draw">
          <Icon name="draw" />
        </ToolbarToggleButton>
        <ToolbarToggleButton id="text" aria-label="Text">
          <Icon name="text_fields" />
        </ToolbarToggleButton>
      </ToolbarToggleGroup>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Zoom in">
        <Icon name="zoom_in" />
      </ToolbarButton>
      <ToolbarButton aria-label="Zoom out">
        <Icon name="zoom_out" />
      </ToolbarButton>
    </FloatingToolbar>
  )
}
