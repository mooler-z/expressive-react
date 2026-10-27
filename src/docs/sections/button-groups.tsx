import { Button } from "@/components/ui/button"
import {
  ButtonGroup,
  ConnectedButton,
  ConnectedButtonGroup,
  SegmentedButton,
  SegmentedButtonGroup,
  SplitButton,
  SplitButtonAction,
  SplitButtonMenu,
} from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { MenuItem } from "@/components/ui/menu"
import { snackbar } from "@/components/ui/snackbar"
import { Section, Variant, Variants } from "@/docs/section"

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-label-md tracking-wider text-on-surface-variant uppercase">{children}</div>
)

export default function ButtonGroupsSection() {
  return (
    <Section
      id="button-groups"
      description="Connected groups share a 2dp gap with 8dp inner corners; the selected segment turns fully round. Standard groups are spaced 12dp, and pressing a button widens it while its neighbours squish. Split buttons pair an action with a menu."
      spec="https://m3.material.io/components/button-groups/overview"
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <Label>Connected · single select</Label>
          <ConnectedButtonGroup aria-label="Range" defaultSelectedKeys={["week"]}>
            <ConnectedButton id="day">Day</ConnectedButton>
            <ConnectedButton id="week">Week</ConnectedButton>
            <ConnectedButton id="month">Month</ConnectedButton>
            <ConnectedButton id="year">Year</ConnectedButton>
          </ConnectedButtonGroup>
          <div>
            <ConnectedButtonGroup aria-label="Text style" variant="tonal" size="md" selectionMode="multiple" defaultSelectedKeys={["bold"]}>
              <ConnectedButton id="bold" iconOnly aria-label="Bold">
                <Icon>format_bold</Icon>
              </ConnectedButton>
              <ConnectedButton id="italic" iconOnly aria-label="Italic">
                <Icon>format_italic</Icon>
              </ConnectedButton>
              <ConnectedButton id="underline" iconOnly aria-label="Underline">
                <Icon>format_underlined</Icon>
              </ConnectedButton>
              <ConnectedButton id="strike" iconOnly aria-label="Strikethrough">
                <Icon>format_strikethrough</Icon>
              </ConnectedButton>
            </ConnectedButtonGroup>
          </div>
        </div>
        <div className="space-y-3">
          <Label>Standard · press to squish neighbours</Label>
          <ButtonGroup aria-label="Message actions">
            <Button onPress={() => snackbar("Reply · demo action")}>
              <Icon>reply</Icon>
              Reply
            </Button>
            <Button variant="tonal" onPress={() => snackbar("Forward · demo action")}>
              <Icon>forward</Icon>
              Forward
            </Button>
            <Button variant="tonal" onPress={() => snackbar("Archive · demo action")}>
              <Icon>archive</Icon>
              Archive
            </Button>
          </ButtonGroup>
          <div className="pt-2">
            <Label>Split button</Label>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SplitButton>
              <SplitButtonAction onPress={() => snackbar("Saved", { action: { label: "Undo", onAction: () => snackbar("Restored") } })}>
                <Icon>save</Icon>
                Save
              </SplitButtonAction>
              <SplitButtonMenu aria-label="More save options" onAction={(key) => snackbar(String(key))}>
                <MenuItem id="Saved as draft" icon="draft">
                  Save as draft
                </MenuItem>
                <MenuItem id="Saved and published" icon="publish">
                  Save &amp; publish
                </MenuItem>
                <MenuItem id="Copy saved as “Untitled (2)”" icon="content_copy">
                  Save a copy
                </MenuItem>
              </SplitButtonMenu>
            </SplitButton>
            <SplitButton variant="outlined">
              <SplitButtonAction onPress={() => snackbar("Exporting as CSV…")}>Export</SplitButtonAction>
              <SplitButtonMenu aria-label="Export format" onAction={(key) => snackbar(`Exporting as ${String(key)}…`)}>
                <MenuItem id="CSV">CSV</MenuItem>
                <MenuItem id="JSON">JSON</MenuItem>
                <MenuItem id="PDF">PDF</MenuItem>
              </SplitButtonMenu>
            </SplitButton>
          </div>
        </div>
        <div className="space-y-3 md:col-span-2">
          <Label>Segmented buttons · outlined, multi-select</Label>
          <SegmentedButtonGroup aria-label="Library filter" selectionMode="multiple" defaultSelectedKeys={["songs"]}>
            <SegmentedButton id="songs">Songs</SegmentedButton>
            <SegmentedButton id="albums">Albums</SegmentedButton>
            <SegmentedButton id="podcasts">Podcasts</SegmentedButton>
          </SegmentedButtonGroup>
        </div>
      </div>

      <Variants cols="md:grid-cols-2 xl:grid-cols-3">
        <Variant n={1} label="Connected · icons">
          <ConnectedButtonGroup aria-label="Alignment" defaultSelectedKeys={["left"]}>
            {["left", "center", "right", "justify"].map((a) => (
              <ConnectedButton key={a} id={a} iconOnly aria-label={`Align ${a}`}>
                <Icon size={20}>{`format_align_${a}`}</Icon>
              </ConnectedButton>
            ))}
          </ConnectedButtonGroup>
        </Variant>
        <Variant n={2} label="Connected · multi-select">
          <ConnectedButtonGroup aria-label="Text style" selectionMode="multiple" defaultSelectedKeys={["bold", "underline"]}>
            {[
              ["bold", "format_bold"],
              ["italic", "format_italic"],
              ["underline", "format_underlined"],
              ["strike", "format_strikethrough"],
            ].map(([id, icon]) => (
              <ConnectedButton key={id} id={id} iconOnly aria-label={id}>
                <Icon size={20}>{icon}</Icon>
              </ConnectedButton>
            ))}
          </ConnectedButtonGroup>
        </Variant>
        <Variant n={3} label="Connected · XS">
          <ConnectedButtonGroup aria-label="Time range" size="xs" defaultSelectedKeys={["1w"]}>
            {["1h", "1d", "1w", "1m", "1y"].map((r) => (
              <ConnectedButton key={r} id={r}>
                {r}
              </ConnectedButton>
            ))}
          </ConnectedButtonGroup>
        </Variant>
        <Variant n={4} label="Connected · M">
          <ConnectedButtonGroup aria-label="View" size="md" defaultSelectedKeys={["grid"]}>
            <ConnectedButton id="list">
              <Icon>view_list</Icon>
              List
            </ConnectedButton>
            <ConnectedButton id="grid">
              <Icon>grid_view</Icon>
              Grid
            </ConnectedButton>
            <ConnectedButton id="map">
              <Icon>map</Icon>
              Map
            </ConnectedButton>
          </ConnectedButtonGroup>
        </Variant>
        <Variant n={5} label="Press widens · media">
          <ButtonGroup aria-label="Playback" size="md" className="items-center">
            <IconButton variant="tonal" size="sm" width="wide" aria-label="Previous">
              <Icon filled>skip_previous</Icon>
            </IconButton>
            <IconButton variant="filled" size="md" width="wide" shape="square" aria-label="Play">
              <Icon filled>play_arrow</Icon>
            </IconButton>
            <IconButton variant="tonal" size="sm" width="wide" aria-label="Next">
              <Icon filled>skip_next</Icon>
            </IconButton>
          </ButtonGroup>
        </Variant>
        <Variant n={6} label="Split · tonal · outlined">
          <SplitButton variant="tonal">
            <SplitButtonAction>
              <Icon>save</Icon>
              Save
            </SplitButtonAction>
            <SplitButtonMenu aria-label="More save options">
              <MenuItem icon="draft">Save as draft</MenuItem>
              <MenuItem icon="content_copy">Save a copy</MenuItem>
            </SplitButtonMenu>
          </SplitButton>
          <SplitButton variant="outlined">
            <SplitButtonAction>
              <Icon>ios_share</Icon>
              Export
            </SplitButtonAction>
            <SplitButtonMenu aria-label="Export options">
              <MenuItem>CSV</MenuItem>
              <MenuItem>PDF</MenuItem>
            </SplitButtonMenu>
          </SplitButton>
        </Variant>
      </Variants>
    </Section>
  )
}
