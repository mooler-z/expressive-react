import { Icon } from "@/components/ui/icon"
import { FloatingToolbar, ToolbarButton, ToolbarFab, ToolbarToggleButton, ToolbarToggleGroup } from "@/components/ui/toolbar"

export default function ToolbarVibrant() {
  return (
    <FloatingToolbar
      aria-label="Photo editing"
      color="vibrant"
      fab={
        <ToolbarFab aria-label="Save">
          <Icon name="check" />
        </ToolbarFab>
      }
    >
      <ToolbarToggleGroup aria-label="Tool" selectionMode="single" disallowEmptySelection defaultSelectedKeys={["crop"]}>
        <ToolbarToggleButton id="crop" aria-label="Crop">
          <Icon name="crop" />
        </ToolbarToggleButton>
        <ToolbarToggleButton id="tune" aria-label="Adjust">
          <Icon name="tune" />
        </ToolbarToggleButton>
        <ToolbarToggleButton id="filter" aria-label="Filters">
          <Icon name="filter_vintage" />
        </ToolbarToggleButton>
      </ToolbarToggleGroup>
      <ToolbarButton aria-label="Undo">
        <Icon name="undo" />
      </ToolbarButton>
    </FloatingToolbar>
  )
}
