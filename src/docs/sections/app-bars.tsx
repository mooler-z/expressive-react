import { BottomAppBar, TopAppBar } from "@/components/ui/app-bar"
import { Avatar } from "@/components/ui/avatar"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { LinearProgress } from "@/components/ui/progress"
import { Shape } from "@/components/ui/shape"
import { snackbar } from "@/components/ui/snackbar"
import { Tab, TabList, Tabs } from "@/components/ui/tabs"
import { Section, Variant, Variants } from "@/docs/section"

function Action({ icon, label }: { icon: string; label?: string }) {
  return (
    <IconButton aria-label={label ?? icon.replace(/_/g, " ")} onPress={() => snackbar(label ?? icon.replace(/_/g, " "))}>
      <Icon>{icon}</Icon>
    </IconButton>
  )
}

const frame = "overflow-hidden rounded-lg bg-surface"

export default function AppBarsSection() {
  return (
    <Section
      id="app-bars"
      description="Small (64dp), center-aligned, medium flexible (112dp) and large flexible (120dp). Surface at rest, surface-container when content scrolls beneath. Bottom app bar: 80dp."
      spec="https://m3.material.io/components/app-bars/overview"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-md">
          <TopAppBar
            scrolled={false}
            title="Small top app bar"
            navigation={<Action icon="arrow_back" label="Back" />}
            actions={
              <>
                <Action icon="attach_file" label="Attach" />
                <Action icon="more_vert" label="More options" />
              </>
            }
          />
        </div>
        <div className="overflow-hidden rounded-md">
          <TopAppBar
            scrolled
            variant="center"
            title="Center-aligned"
            navigation={<Action icon="menu" label="Menu" />}
            actions={<Avatar name="Kestrel" size="sm" className="me-2" />}
          />
        </div>
        <div className="overflow-hidden rounded-md">
          <TopAppBar
            scrolled={false}
            variant="medium"
            title="Medium flexible"
            navigation={<Action icon="arrow_back" label="Back" />}
            actions={<Action icon="more_vert" label="More options" />}
          />
        </div>
        <div className="relative h-64 overflow-y-auto rounded-md bg-surface">
          <TopAppBar
            variant="large"
            title="Large flexible"
            subtitle="Scroll this frame — the title collapses into the bar"
            navigation={<Action icon="arrow_back" label="Back" />}
            actions={<Action icon="more_vert" label="More options" />}
          />
          <div className="space-y-3 px-4 pt-2 pb-4">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="h-12 rounded-md bg-surface-container" />
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-md md:col-span-2">
          <BottomAppBar
            fab={
              <IconButton size="md" variant="filled" aria-label="New" className="rounded-lg bg-primary-container text-on-primary-container shadow-1" onPress={() => snackbar("New note")}>
                <Icon>add</Icon>
              </IconButton>
            }
          >
            <Action icon="check_box" label="New checklist" />
            <Action icon="brush" label="New drawing" />
            <Action icon="mic" label="New voice note" />
            <Action icon="image" label="New image note" />
          </BottomAppBar>
        </div>
      </div>

      <Variants cols="md:grid-cols-2">
        <Variant n={1} label="Small · scrolled" className={frame}>
          <div className="w-full">
            <TopAppBar
              scrolled
              title="Deployments"
              navigation={<Action icon="arrow_back" label="Back" />}
              actions={
                <>
                  <Action icon="filter_list" label="Filter" />
                  <Action icon="more_vert" label="More options" />
                </>
              }
            />
            <ul className="divide-y divide-outline-variant text-body-md">
              <li className="flex items-center gap-3 px-4 py-3">
                <span className="flex-1 truncate">v2.14.0 · production</span>
                <span className="text-body-sm text-on-surface-variant">09:41</span>
              </li>
              <li className="flex items-center gap-3 px-4 py-3">
                <span className="flex-1 truncate">v2.13.2 · canary</span>
                <span className="text-body-sm text-on-surface-variant">08:10</span>
              </li>
            </ul>
          </div>
        </Variant>
        <Variant n={2} label="Contextual · 3 selected" className={frame}>
          <TopAppBar
            scrolled={false}
            title="3 selected"
            className="w-full"
            rowClassName="bg-secondary-container text-on-secondary-container [&_button]:text-on-secondary-container"
            navigation={<Action icon="close" label="Clear selection" />}
            actions={
              <>
                <Action icon="archive" label="Archive" />
                <Action icon="delete" label="Delete" />
                <Action icon="more_vert" label="More options" />
              </>
            }
          />
        </Variant>
        <Variant n={3} label="Search in bar" className={frame}>
          <TopAppBar scrolled={false} className="w-full" navigation={<Action icon="menu" label="Menu" />} actions={<Avatar name="Maya Lindqvist" size="sm" color="tertiary" className="mx-2" />}>
            <button className="state-layer focus-ring flex h-12 w-full min-w-0 cursor-pointer items-center gap-2 rounded-full bg-surface-container-high px-4 text-body-lg text-on-surface-variant">
              <Icon>search</Icon>
              <span className="truncate">Search services</span>
            </button>
          </TopAppBar>
        </Variant>
        <Variant n={4} label="With subtitle" className={frame}>
          <TopAppBar
            scrolled={false}
            className="w-full"
            title="Inbox"
            subtitle="maya@kestrel.io · 24 unread"
            navigation={<Action icon="arrow_back" label="Back" />}
            actions={
              <>
                <Action icon="search" label="Search" />
                <Action icon="more_vert" label="More options" />
              </>
            }
          />
        </Variant>
        <Variant n={5} label="Medium · with subtitle" className={frame}>
          <div className="w-full">
            <TopAppBar
              scrolled={false}
              variant="medium"
              title="Cluster health"
              subtitle="14 nodes · updated 2 min ago"
              navigation={<Action icon="arrow_back" label="Back" />}
              actions={
                <>
                  <Action icon="bookmark_border" label="Bookmark" />
                  <Action icon="more_vert" label="More options" />
                </>
              }
            />
          </div>
        </Variant>
        <Variant n={6} label="Large · primary container" className={frame}>
          <div className="w-full [&_[data-slot=top-app-bar]_button]:text-on-primary-container">
            <TopAppBar
              variant="large"
              title="Q3 report"
              containerClassName="bg-primary-container text-on-primary-container"
              navigation={<Action icon="menu" label="Menu" />}
              actions={<Action icon="share" label="Share" />}
            />
          </div>
        </Variant>
        <Variant n={7} label="Center-aligned · brand" className={frame}>
          <TopAppBar
            scrolled={false}
            variant="center"
            className="w-full"
            navigation={<Action icon="menu" label="Menu" />}
            actions={<Avatar name="Maya Lindqvist" size="sm" className="mx-2" />}
          >
            <span className="flex items-center justify-center gap-2 text-title-lg">
              <Shape shape="cookie7" className="size-6 text-primary" />
              Kestrel
            </span>
          </TopAppBar>
        </Variant>
        <Variant n={8} label="Small · loading" className={frame}>
          <TopAppBar
            scrolled={false}
            className="w-full"
            title="Audit log"
            navigation={<Action icon="arrow_back" label="Back" />}
            actions={<Action icon="refresh" label="Refresh" />}
            bottom={<LinearProgress isIndeterminate aria-label="Loading audit log" />}
          />
        </Variant>
        <Variant n={9} label="With tabs" className={frame}>
          <TopAppBar
            scrolled={false}
            className="w-full"
            title="Kestrel Grid"
            navigation={<Action icon="arrow_back" label="Back" />}
            actions={<Action icon="more_vert" label="More options" />}
            bottom={
              <Tabs aria-label="Cluster">
                <TabList variant="primary">
                  <Tab id="overview">Overview</Tab>
                  <Tab id="nodes">Nodes</Tab>
                  <Tab id="logs">Logs</Tab>
                </TabList>
              </Tabs>
            }
          />
        </Variant>
        <Variant n={10} label="Over media" className={frame}>
          <div className="relative h-44 w-full bg-tertiary-container text-on-tertiary-container">
            <span className="absolute inset-0 grid place-items-center">
              <Icon size={48}>landscape</Icon>
            </span>
            <div className="absolute inset-x-0 top-0 flex h-16 items-center gap-2 px-3">
              <IconButton variant="filled" aria-label="Back" className="bg-surface-container-highest text-on-surface">
                <Icon>arrow_back</Icon>
              </IconButton>
              <span className="flex-1" />
              <IconButton variant="filled" aria-label="Save" className="bg-surface-container-highest text-on-surface">
                <Icon>favorite</Icon>
              </IconButton>
              <IconButton variant="filled" aria-label="Share" className="bg-surface-container-highest text-on-surface">
                <Icon>share</Icon>
              </IconButton>
            </div>
          </div>
        </Variant>
      </Variants>
    </Section>
  )
}
