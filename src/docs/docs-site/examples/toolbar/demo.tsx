import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import {
  FloatingToolbar,
  ToolbarButton,
  ToolbarFab,
  ToolbarSeparator,
  ToolbarToggleButton,
  ToolbarToggleGroup,
} from "@/components/ui/toolbar"

export default function ToolbarDemo() {
  return (
    <FloatingToolbar
      aria-label="Text formatting"
      fab={
        <ToolbarFab aria-label="Add comment" onPress={() => snackbar("Comment added")}>
          <Icon name="add_comment" />
        </ToolbarFab>
      }
    >
      <ToolbarToggleGroup aria-label="Style" selectionMode="multiple" defaultSelectedKeys={["bold"]}>
        <ToolbarToggleButton id="bold" aria-label="Bold">
          <Icon name="format_bold" />
        </ToolbarToggleButton>
        <ToolbarToggleButton id="italic" aria-label="Italic">
          <Icon name="format_italic" />
        </ToolbarToggleButton>
        <ToolbarToggleButton id="underline" aria-label="Underline">
          <Icon name="format_underlined" />
        </ToolbarToggleButton>
      </ToolbarToggleGroup>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Insert link" onPress={() => snackbar("Insert link")}>
        <Icon name="link" />
      </ToolbarButton>
    </FloatingToolbar>
  )
}
