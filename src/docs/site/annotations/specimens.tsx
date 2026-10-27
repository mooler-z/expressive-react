import * as React from "react"

import { Button, ToggleButton } from "@/components/ui/button"
import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { FilterChip, ChipGroup } from "@/components/ui/chip"
import { Checkbox } from "@/components/ui/checkbox"
import { CommandDialog, CommandFooter, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogActions, DialogBody, DialogHeadline, DialogIcon, DialogTrigger } from "@/components/ui/dialog"
import { FabMenu, FabMenuItem } from "@/components/ui/fab"
import { Icon } from "@/components/ui/icon"
import { ToggleIconButton } from "@/components/ui/icon-button"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { Menu, MenuItem, MenuPopover, MenuTrigger } from "@/components/ui/menu"
import { NavigationBar, NavigationBarItem } from "@/components/ui/navigation-bar"
import { LinearProgress } from "@/components/ui/progress"
import { Shape } from "@/components/ui/shape"
import { Slider } from "@/components/ui/slider"
import { snackbar } from "@/components/ui/snackbar"
import { Switch } from "@/components/ui/switch"
import { Tab, TabList, Tabs } from "@/components/ui/tabs"
import { TextField } from "@/components/ui/text-field"
import { useTheme, type SchemeVariant } from "@/components/ui/theme-provider"
import { toast } from "@/components/ui/toast"
import { usePressScale } from "@/hooks/use-press-scale"

/* Live specimens for the annotated board. Each one is the real library component the spec describes. */

function ButtonSpecimen() {
  const ref = React.useRef<HTMLButtonElement>(null)
  usePressScale(ref)
  return (
    <>
      <Button ref={ref} size="md" icon={<Icon name="touch_app" />}>
        Press and hold
      </Button>
      <Button variant="tonal">Small</Button>
      <Button variant="outlined" size="lg">
        Large
      </Button>
    </>
  )
}

function ToggleSpecimen() {
  return (
    <>
      <div className="flex gap-2">
        <ToggleIconButton variant="filled" aria-label="Favorite" defaultSelected>
          <Icon name="favorite" />
        </ToggleIconButton>
        <ToggleIconButton variant="filled" aria-label="Bookmark">
          <Icon name="bookmark" />
        </ToggleIconButton>
        <ToggleIconButton variant="filled" aria-label="Star">
          <Icon name="star" />
        </ToggleIconButton>
      </div>
      <ToggleButton variant="outlined" icon={<Icon name="notifications" />}>
        Follow
      </ToggleButton>
      <ConnectedButtonGroup aria-label="Range" variant="tonal" defaultSelectedKeys={["day"]}>
        <ConnectedButton id="day">Day</ConnectedButton>
        <ConnectedButton id="week">Week</ConnectedButton>
        <ConnectedButton id="month">Month</ConnectedButton>
      </ConnectedButtonGroup>
    </>
  )
}

function SwitchSpecimen() {
  return (
    <>
      <Switch>Off → on</Switch>
      <Switch icons defaultSelected>
        With icon
      </Switch>
      <Checkbox defaultSelected>Checkbox</Checkbox>
    </>
  )
}

function SliderSpecimen() {
  return (
    <div className="w-full max-w-md space-y-6">
      <Slider aria-label="Single value" defaultValue={45} valueIndicator="always" className="pt-10" />
      <Slider aria-label="Range" defaultValue={[20, 60]} />
    </div>
  )
}

function FabSpecimen() {
  return (
    <div className="flex min-h-[272px] w-full items-end justify-end self-stretch">
      <FabMenu aria-label="Meeting actions" onAction={(key) => snackbar(`${String(key)} · demo action`)}>
        <FabMenuItem id="Start meeting" icon="videocam">
          Start meeting
        </FabMenuItem>
        <FabMenuItem id="Schedule" icon="calendar_add_on">
          Schedule
        </FabMenuItem>
        <FabMenuItem id="Copy link" icon="link">
          Copy link
        </FabMenuItem>
      </FabMenu>
    </div>
  )
}

function LoadingSpecimen() {
  return (
    <>
      <LoadingIndicator />
      <LoadingIndicator contained size={56} />
      <div className="w-full max-w-sm space-y-4">
        <LinearProgress value={60} wavy aria-label="Wavy progress" />
        <LinearProgress isIndeterminate aria-label="Loading" />
      </div>
    </>
  )
}

function ShapesSpecimen() {
  return (
    <>
      <Shape cycle={["cookie7", "clover4", "sunny"]} interval={3000} hoverShape="burst" className="size-28 cursor-pointer text-primary-container" />
      <div className="animate-[spin_40s_linear_infinite] motion-reduce:animate-none">
        <Shape cycle={["clover4", "cookie9", "pentagon"]} interval={2800} hoverShape="verySunny" className="size-28 cursor-pointer text-tertiary-container" />
      </div>
      <div className="animate-[spin_60s_linear_infinite] motion-reduce:animate-none">
        <Shape cycle={["sunny", "cookie12", "circle"]} interval={3200} hoverShape="gem" className="size-28 cursor-pointer text-secondary-container" />
      </div>
    </>
  )
}

function NavSpecimen() {
  return (
    <>
      <NavigationBar defaultValue="home" className="w-full max-w-sm rounded-md">
        <NavigationBarItem value="home" icon="home" label="Home" />
        <NavigationBarItem value="docs" icon="menu_book" label="Docs" />
        <NavigationBarItem value="blocks" icon="view_quilt" label="Blocks" />
        <NavigationBarItem value="themes" icon="palette" label="Themes" />
      </NavigationBar>
      <Tabs defaultSelectedKey="preview">
        <TabList aria-label="Preview or code" variant="pill">
          <Tab id="preview">Preview</Tab>
          <Tab id="code">Code</Tab>
        </TabList>
      </Tabs>
    </>
  )
}

function LayersSpecimen() {
  const [paletteOpen, setPaletteOpen] = React.useState(false)
  const run = (label: string) => () => {
    setPaletteOpen(false)
    snackbar(label)
  }
  return (
    <>
      <DialogTrigger>
        <Button icon={<Icon name="open_in_full" />}>Dialog</Button>
        <Dialog className="max-w-sm">
          <DialogIcon>open_in_full</DialogIcon>
          <DialogHeadline>Basic dialog</DialogHeadline>
          <DialogBody>
            The scrim fades in over 200ms while the card rises and scales from .92 on the emphasized-decelerate curve (450ms). Esc, the scrim or an
            action closes it in 150ms, and focus returns to the trigger.
          </DialogBody>
          <DialogActions>
            <Button variant="text" slot="close">
              Cancel
            </Button>
            <Button slot="close">Got it</Button>
          </DialogActions>
        </Dialog>
      </DialogTrigger>
      <Button variant="tonal" icon={<Icon name="search" />} onPress={() => setPaletteOpen(true)}>
        Palette · ⌘K
      </Button>
      <CommandDialog isOpen={paletteOpen} onOpenChange={setPaletteOpen} shortcut={null}>
        <CommandInput placeholder="Search docs…" />
        <CommandList>
          <CommandGroup title="Components">
            <CommandItem icon="smart_button" onAction={run("Opening Button")}>
              Button
            </CommandItem>
            <CommandItem icon="toggle_on" onAction={run("Opening Switch")}>
              Switch
            </CommandItem>
            <CommandItem icon="linear_scale" onAction={run("Opening Slider")}>
              Slider
            </CommandItem>
          </CommandGroup>
          <CommandGroup title="Pages">
            <CommandItem icon="palette" onAction={run("Opening Theme builder")}>
              Theme builder
            </CommandItem>
            <CommandItem icon="dataset" onAction={run("Opening Design tokens")}>
              Design tokens
            </CommandItem>
          </CommandGroup>
        </CommandList>
        <CommandFooter />
      </CommandDialog>
      <Button
        variant="outlined"
        icon={<Icon name="notifications_active" />}
        onPress={() => snackbar("Snackbar from the bottom", { action: { label: "Undo", onAction: () => {} } })}
      >
        Snackbar
      </Button>
      <Button
        variant="outlined"
        icon={<Icon name="campaign" />}
        onPress={() => toast({ title: "Toast", description: "Bottom-end, 6s, pauses on hover", icon: "check_circle", tone: "tertiary" })}
      >
        Toast
      </Button>
      <MenuTrigger>
        <Button variant="outlined" trailingIcon={<Icon name="keyboard_arrow_down" size={20} />}>
          Menu
        </Button>
        <MenuPopover>
          <Menu aria-label="Item actions" onAction={(key) => snackbar(`${String(key)} · demo action`)} className="w-52">
            <MenuItem id="Rename" icon="edit">
              Rename
            </MenuItem>
            <MenuItem id="Duplicate" icon="content_copy">
              Duplicate
            </MenuItem>
            <MenuItem id="Delete" icon="delete">
              Delete
            </MenuItem>
          </Menu>
        </MenuPopover>
      </MenuTrigger>
    </>
  )
}

function TextSpecimen() {
  return (
    <div className="w-full max-w-md space-y-5">
      <TextField label="Project name" />
      <ChipGroup aria-label="Filters" defaultSelectedKeys={["filter"]}>
        <FilterChip id="filter">Filter</FilterChip>
        <FilterChip id="chips">Chips</FilterChip>
        <FilterChip id="morph">Morph</FilterChip>
      </ChipGroup>
    </div>
  )
}

const SEEDS = ["#6750A4", "#0B57D0", "#006A6A", "#386A20", "#7D5700", "#9C4146", "#8E4585", "#4A6572"]
const VARIANTS: SchemeVariant[] = ["tonalSpot", "vibrant", "expressive", "fidelity", "content", "neutral", "monochrome", "rainbow", "fruitSalad"]
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)]

function ThemeSpecimen() {
  const { resolvedMode, setMode, setSeed, setVariant, setContrast } = useTheme()
  const dark = resolvedMode === "dark"
  return (
    <>
      <Button icon={<Icon name={dark ? "light_mode" : "dark_mode"} />} onPress={() => setMode(dark ? "light" : "dark")}>
        Toggle dark mode
      </Button>
      <Button
        variant="tonal"
        icon={<Icon name="shuffle" />}
        onPress={() => {
          setSeed(pick(SEEDS))
          setVariant(pick(VARIANTS))
        }}
      >
        Random seed
      </Button>
      <Button
        variant="text"
        onPress={() => {
          setSeed(null)
          setVariant("tonalSpot")
          setContrast(0)
        }}
      >
        Reset
      </Button>
    </>
  )
}

export const SPECIMENS: Record<string, () => React.ReactNode> = {
  button: ButtonSpecimen,
  toggle: ToggleSpecimen,
  switch: SwitchSpecimen,
  slider: SliderSpecimen,
  fab: FabSpecimen,
  loading: LoadingSpecimen,
  shapes: ShapesSpecimen,
  nav: NavSpecimen,
  layers: LayersSpecimen,
  text: TextSpecimen,
  theme: ThemeSpecimen,
}
