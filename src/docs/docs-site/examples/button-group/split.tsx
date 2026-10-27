import { SplitButton, SplitButtonAction, SplitButtonMenu } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { MenuItem } from "@/components/ui/menu"
import { snackbar } from "@/components/ui/snackbar"

export default function ButtonGroupSplit() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <SplitButton>
        <SplitButtonAction onPress={() => snackbar("Saved")}>
          <Icon name="save" />
          Save
        </SplitButtonAction>
        <SplitButtonMenu aria-label="More save options" onAction={(key) => snackbar(String(key))}>
          <MenuItem id="Saved as copy" icon="file_copy">Save a copy</MenuItem>
          <MenuItem id="Saved as template" icon="dashboard_customize">Save as template</MenuItem>
        </SplitButtonMenu>
      </SplitButton>

      <SplitButton variant="tonal">
        <SplitButtonAction onPress={() => snackbar("Exported PDF")}>Export</SplitButtonAction>
        <SplitButtonMenu aria-label="Export format" onAction={(key) => snackbar(`Exported ${String(key)}`)}>
          <MenuItem id="PNG">PNG</MenuItem>
          <MenuItem id="SVG">SVG</MenuItem>
        </SplitButtonMenu>
      </SplitButton>

      <SplitButton variant="outlined" size="xs">
        <SplitButtonAction onPress={() => snackbar("Merged")}>Merge</SplitButtonAction>
        <SplitButtonMenu aria-label="Merge strategy" onAction={(key) => snackbar(String(key))}>
          <MenuItem id="Squashed and merged">Squash and merge</MenuItem>
          <MenuItem id="Rebased and merged">Rebase and merge</MenuItem>
        </SplitButtonMenu>
      </SplitButton>
    </div>
  )
}
