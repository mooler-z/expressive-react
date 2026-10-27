import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs"
import { Section, Variant, Variants } from "@/docs/section"

const panel = "p-4 text-body-md text-on-surface-variant"
const frame = "overflow-hidden rounded-lg bg-surface"

function Count({ n }: { n: number }) {
  return <span className="ms-2 rounded-full bg-on-surface/8 px-2 text-label-md tabular-nums">{n}</span>
}

export default function TabsSection() {
  return (
    <Section
      id="tabs"
      description="Primary tabs (3dp rounded indicator under icon + label) and secondary tabs (2dp full-width indicator). The indicator slides between tabs on the fast spatial spring. Scrollable when they overflow."
      spec="https://m3.material.io/components/tabs/overview"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Tabs aria-label="Travel" className="rounded-md bg-surface">
          <TabList variant="primary">
            <Tab id="flights" icon="flight">
              Flights
            </Tab>
            <Tab id="trips" icon="luggage">
              Trips
            </Tab>
            <Tab id="explore" icon="explore">
              Explore
            </Tab>
          </TabList>
          <TabPanel id="flights" className={panel}>
            Flights · 3 upcoming. Next: SFO → FRA, Nov 2, 18:40.
          </TabPanel>
          <TabPanel id="trips" className={panel}>
            Trips · Berlin offsite (Nov), Tokyo customer week (Jan).
          </TabPanel>
          <TabPanel id="explore" className={panel}>
            Explore · destinations your team visits most, ranked.
          </TabPanel>
        </Tabs>
        <Tabs aria-label="Product" className="rounded-md bg-surface">
          <TabList variant="secondary">
            <Tab id="overview">Overview</Tab>
            <Tab id="specs">Specifications</Tab>
            <Tab id="reviews" badge={2} badgeLabel="2 new reviews">
              Reviews
            </Tab>
          </TabList>
          <TabPanel id="overview" className={panel}>
            Overview · secondary tabs sit inside a page, under primary navigation.
          </TabPanel>
          <TabPanel id="specs" className={panel}>
            Specifications · 2dp full-width indicator, title-small text.
          </TabPanel>
          <TabPanel id="reviews" className={panel}>
            Reviews · 2 new since your last visit.
          </TabPanel>
        </Tabs>
      </div>

      <Variants cols="md:grid-cols-2 xl:grid-cols-3">
        <Variant n={1} label="Segmented pill">
          <Tabs aria-label="Range" defaultSelectedKey="week">
            <TabList variant="pill">
              <Tab id="day">Day</Tab>
              <Tab id="week">Week</Tab>
              <Tab id="month">Month</Tab>
            </TabList>
          </Tabs>
        </Variant>
        <Variant n={2} label="With counts" className={frame}>
          <Tabs aria-label="Pull requests" className="w-full">
            <TabList variant="secondary">
              <Tab id="open">
                Open
                <Count n={12} />
              </Tab>
              <Tab id="merged">
                Merged
                <Count n={48} />
              </Tab>
              <Tab id="closed">
                Closed
                <Count n={3} />
              </Tab>
            </TabList>
          </Tabs>
        </Variant>
        <Variant n={3} label="Scrollable" className={frame}>
          <Tabs aria-label="Service" className="w-full">
            <TabList variant="primary" scrollable>
              {["Overview", "Deploys", "Policies", "Incidents", "Costs", "Audit log", "Owners", "Settings"].map((t) => (
                <Tab key={t} id={t}>
                  {t}
                </Tab>
              ))}
            </TabList>
          </Tabs>
        </Variant>
        <Variant n={4} label="Vertical" className={frame}>
          <Tabs aria-label="Account" orientation="vertical" className="w-full">
            <TabList variant="secondary" className="w-40">
              <Tab id="profile" icon="person">
                Profile
              </Tab>
              <Tab id="alerts" icon="notifications">
                Alerts
              </Tab>
              <Tab id="keys" icon="key">
                API keys
              </Tab>
            </TabList>
            <TabPanel id="profile" className={panel}>
              Name, photo and pronouns.
            </TabPanel>
            <TabPanel id="alerts" className={panel}>
              Email and push rules.
            </TabPanel>
            <TabPanel id="keys" className={panel}>
              2 active keys.
            </TabPanel>
          </Tabs>
        </Variant>
        <Variant n={5} label="Icon only" className={frame}>
          <Tabs aria-label="View" className="w-full">
            <TabList variant="primary">
              <Tab id="grid" icon="grid_view" aria-label="Grid" />
              <Tab id="list" icon="view_list" aria-label="List" />
              <Tab id="map" icon="map" aria-label="Map" />
              <Tab id="timeline" icon="timeline" aria-label="Timeline" />
            </TabList>
          </Tabs>
        </Variant>
        <Variant n={6} label="Inline icons · badge dot" className={frame}>
          <Tabs aria-label="Inbox" className="w-full">
            <TabList variant="primary">
              <Tab id="primary" icon="inbox" inlineIcon>
                Primary
              </Tab>
              <Tab id="updates" icon="info" inlineIcon badge>
                Updates
              </Tab>
            </TabList>
          </Tabs>
        </Variant>
      </Variants>
    </Section>
  )
}
