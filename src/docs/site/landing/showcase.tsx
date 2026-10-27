import * as React from "react"
import { Link, type Key } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChipGroup, FilterChip, InputChip, InputChipGroup } from "@/components/ui/chip"
import { Dialog, DialogActions, DialogBody, DialogHeadline, DialogIcon, DialogTrigger } from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { NavigationBar, NavigationBarItem } from "@/components/ui/navigation-bar"
import { CircularProgress, LinearProgress } from "@/components/ui/progress"
import { Reveal } from "@/components/ui/reveal"
import { Shape } from "@/components/ui/shape"
import { Slider } from "@/components/ui/slider"
import { snackbar } from "@/components/ui/snackbar"
import { Switch } from "@/components/ui/switch"
import { Tab, TabList, Tabs } from "@/components/ui/tabs"
import { TextField } from "@/components/ui/text-field"
import { useTheme } from "@/components/ui/theme-provider"
import { toast } from "@/components/ui/toast"
import { useTilt } from "@/hooks/use-tilt"
import { cn } from "@/lib/utils"
import { LinkButton, SectionTitle } from "@/docs/site/landing/shared"
import { docsHref } from "@/docs/site/site-nav"

/** "73 components, all live." Bento grid of real, interactive components. */
export function Showcase() {
  return (
    <Reveal>
      <section data-screen-label="Component showcase" className="mx-auto max-w-7xl px-4 pb-16 md:px-8 lg:pb-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <SectionTitle className="md:text-display-sm">73 components, all live.</SectionTitle>
            <p className="mt-3 max-w-prose text-body-lg text-on-surface-variant">
              Grouped the M3 way: actions, communication, containment, navigation, selection, inputs, content, data and chat. Press anything.
            </p>
          </div>
          <LinkButton href="/docs/button" variant="outlined" className="pr-3 pl-4" trailingIcon={<Icon name="arrow_forward" size={20} />}>
            All components
          </LinkButton>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-6">
          <Tile span={4} title="Button" doc="button" contentClassName="flex-wrap content-center items-center justify-center gap-3">
            {(["elevated", "filled", "tonal", "outlined", "text"] as const).map((v) => (
              <Button key={v} variant={v} className="capitalize" onPress={() => snackbar(`${v[0].toUpperCase() + v.slice(1)} · demo action`)}>
                {v}
              </Button>
            ))}
          </Tile>

          <Tile span={2} title="Switch" doc="switch" contentClassName="flex-wrap content-center items-center justify-center gap-6">
            <Switch aria-label="Wi-Fi" />
            <Switch aria-label="Bluetooth" icons defaultSelected />
          </Tile>

          <Tile span={3} title="Slider" doc="slider" contentClassName="flex-col justify-center">
            <Slider aria-label="Volume" size="xs" defaultValue={40} valueIndicator="always" className="mt-6" />
          </Tile>

          <Tile span={3} title="Chips" doc="chip" contentClassName="flex-wrap content-center items-center justify-center gap-2">
            <ChipsDemo />
          </Tile>

          <Tile span={4} title="Navigation bar" doc="navigation-bar" contentClassName="items-center">
            <NavigationBar defaultValue="home" layout="vertical" className="w-full rounded-md bg-surface-container">
              <NavigationBarItem value="home" icon="home" label="Home" />
              <NavigationBarItem value="explore" icon="explore" label="Explore" />
              <NavigationBarItem value="alerts" icon="notifications" label="Alerts" badge={3} badgeLabel="3 new alerts" />
              <NavigationBarItem value="profile" icon="person" label="Profile" />
            </NavigationBar>
          </Tile>

          <Tile span={2} title="Loading indicator" doc="loading-indicator" contentClassName="flex-wrap content-center items-center justify-center gap-6">
            <LoadingIndicator size={56} />
            <div className="inline-flex h-12 items-center gap-3 rounded-full bg-surface-container-high pr-5 pl-3 text-label-lg">
              <LoadingIndicator size={28} aria-label="Installing" />
              Installing…
            </div>
          </Tile>

          <Tile span={2} title="Progress" doc="progress" contentClassName="flex-col justify-center gap-5">
            <div className="flex items-center gap-4">
              <CircularProgress value={72} size={56} aria-label="Upload">
                <span className="text-label-lg">72%</span>
              </CircularProgress>
              <CircularProgress isIndeterminate tone="tertiary" aria-label="Syncing" />
            </div>
            <LinearProgress isIndeterminate aria-label="Loading" />
          </Tile>

          <Tile span={2} title="Text field" doc="text-field" contentClassName="flex-col justify-center">
            <TextField label="Email" type="email" description="We'll never share it." />
          </Tile>

          <Tile span={2} title="Tabs" doc="tabs" contentClassName="flex-col justify-center">
            <Tabs defaultSelectedKey="flights">
              <TabList aria-label="Trip type">
                <Tab id="flights" icon="flight">
                  Flights
                </Tab>
                <Tab id="stays" icon="hotel">
                  Stays
                </Tab>
                <Tab id="explore" icon="explore">
                  Explore
                </Tab>
              </TabList>
            </Tabs>
          </Tile>

          <Tile span={3} title="Card" doc="card" contentClassName="items-center justify-center">
            <TiltCard />
          </Tile>

          <Tile span={3} title="Dialog · Snackbar · Toast" doc="dialog" contentClassName="flex-wrap content-center items-center justify-center gap-3">
            <ResetThemeDialog />
            <Button
              variant="tonal"
              icon={<Icon name="notifications_active" size={20} />}
              onPress={() =>
                snackbar("Component copied to clipboard", { action: { label: "Undo", onAction: () => snackbar("Copy undone") } })
              }
            >
              Snackbar
            </Button>
            <Button
              variant="outlined"
              icon={<Icon name="campaign" size={20} />}
              onPress={() => toast({ title: "Build finished", description: "12 components, 0 warnings", icon: "check_circle", tone: "tertiary" })}
            >
              Toast
            </Button>
          </Tile>
        </div>
      </section>
    </Reveal>
  )
}

const SPAN = { 2: "md:col-span-2", 3: "md:col-span-3", 4: "md:col-span-4" } as const

function Tile({
  span,
  title,
  doc,
  contentClassName,
  children,
}: {
  span: keyof typeof SPAN
  title: string
  doc: string
  contentClassName?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("group flex min-w-0 flex-col rounded-xl bg-surface-container-low p-5 transition-colors duration-300 hover:bg-surface-container", SPAN[span])}>
      <div className={cn("flex min-h-[120px] flex-1", contentClassName)}>{children}</div>
      <Link href={docsHref(doc)} className="focus-ring mt-4 flex items-center justify-between rounded-sm text-title-sm">
        {title}
        <Icon
          name="arrow_forward"
          size={20}
          className="text-on-surface-variant transition-transform duration-(--md-spring-fast-spatial-duration) ease-fast-spatial group-hover:translate-x-1"
        />
      </Link>
    </div>
  )
}

function ChipsDemo() {
  const [selected, setSelected] = React.useState<Set<Key>>(new Set(["actions"]))
  const [people, setPeople] = React.useState([{ id: "maya", name: "Maya" }])
  return (
    <>
      <ChipGroup aria-label="Component groups" selectedKeys={selected} onSelectionChange={setSelected} className="flex flex-wrap justify-center gap-2">
        <FilterChip id="actions">Actions</FilterChip>
        <FilterChip id="navigation">Navigation</FilterChip>
        <FilterChip id="selection">Selection</FilterChip>
      </ChipGroup>
      <InputChipGroup
        aria-label="People"
        items={people}
        onRemove={() => {
          const removed = people
          setPeople([])
          snackbar("Removed Maya", { action: { label: "Undo", onAction: () => setPeople(removed) } })
        }}
        renderEmptyState={() => null}
      >
        {(p) => (
          <InputChip id={p.id} icon={<Icon name="person" size={18} />}>
            {p.name}
          </InputChip>
        )}
      </InputChipGroup>
    </>
  )
}

function TiltCard() {
  const ref = React.useRef<HTMLDivElement>(null)
  useTilt(ref, { max: 6 })
  return (
    <div ref={ref} className="w-full max-w-sm">
      <Card variant="elevated" className="flex flex-row gap-4 bg-surface-container-lowest p-3 transition-shadow hover:shadow-2">
        <div className="grid size-20 shrink-0 place-items-center rounded-md bg-tertiary-container text-on-tertiary-container">
          <Shape cycle={["cookie9", "clover4", "sunny"]} interval={2400} className="size-10" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-title-md">Elevated card</div>
          <p className="text-body-md text-on-surface-variant">Hover to tilt, press for ripple.</p>
          <Button size="xs" className="mt-2" onPress={() => snackbar("Card action · demo")}>
            Open
          </Button>
        </div>
      </Card>
    </div>
  )
}

function ResetThemeDialog() {
  const { setTheme } = useTheme()
  return (
    <DialogTrigger>
      <Button icon={<Icon name="open_in_full" size={20} />}>Open dialog</Button>
      <Dialog modalClassName="max-w-sm">
        <DialogIcon>delete_sweep</DialogIcon>
        <DialogHeadline>Reset the theme?</DialogHeadline>
        <DialogBody>Your seed color and variant go back to the Material baseline. You can pick them again any time.</DialogBody>
        <DialogActions>
          <Button variant="text" slot="close">
            Cancel
          </Button>
          <Button
            slot="close"
            onPress={() => {
              setTheme({ seed: null, variant: "tonalSpot", contrast: 0 })
              snackbar("Theme reset to baseline")
            }}
          >
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </DialogTrigger>
  )
}
