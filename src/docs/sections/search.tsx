import * as React from "react"
import { ListBox } from "react-aria-components"

import { Avatar } from "@/components/ui/avatar"
import { ChipGroup, FilterChip } from "@/components/ui/chip"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { SearchBar, SearchHighlight, SearchItem, SearchSection, SearchView } from "@/components/ui/search"
import { Skeleton } from "@/components/ui/skeleton"
import { Section, Variant, Variants } from "@/docs/section"

const RECENT = ["checkout-api latency", "checkout service owners", "on-call rotation"]

export default function SearchSectionDemo() {
  const [picked, setPicked] = React.useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = React.useState(false)
  return (
    <Section
      id="search"
      description="Search bar: 56dp pill on surface-container-high. The search view expands out of the bar with live-filtered suggestions and recent queries. ↑/↓ to move, Enter to pick, Esc clears then closes."
      spec="https://m3.material.io/components/search/overview"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <SearchView
            placeholder="Search services, incidents, people"
            leading={
              <IconButton aria-label="Menu" className="text-on-surface">
                <Icon>menu</Icon>
              </IconButton>
            }
            trailing={
              <>
                <IconButton aria-label="Voice search">
                  <Icon>mic</Icon>
                </IconButton>
                <Avatar size="sm" name="Kestrel" fallback="K" className="mx-2" />
              </>
            }
            onAction={(k) => setPicked(String(k))}
          >
            <SearchSection title="Recent">
              {RECENT.map((r) => (
                <SearchItem key={r} id={r} icon="history" trailing="north_west">
                  {r}
                </SearchItem>
              ))}
            </SearchSection>
            <SearchSection title="Results">
              <SearchItem
                id="checkout-api"
                textValue="checkout-api"
                icon={
                  <span className="grid size-10 place-items-center rounded-full bg-primary-container text-on-primary-container">
                    <Icon>dns</Icon>
                  </span>
                }
                description="Service · us-east-1 · healthy"
              >
                <SearchHighlight>checkout-api</SearchHighlight>
              </SearchItem>
              <SearchItem
                id="INC-2291"
                textValue="INC-2291 Checkout error spike"
                icon={
                  <span className="grid size-10 place-items-center rounded-full bg-error-container text-on-error-container">
                    <Icon>warning</Icon>
                  </span>
                }
                description="Incident · resolved 2d ago"
              >
                <SearchHighlight>INC-2291 Checkout error spike</SearchHighlight>
              </SearchItem>
              <SearchItem
                id="maya"
                textValue="Maya Lindqvist"
                icon={<Avatar size="md" name="Maya Lindqvist" />}
                description="Platform lead · on call"
              >
                <SearchHighlight>Maya Lindqvist</SearchHighlight>
              </SearchItem>
            </SearchSection>
          </SearchView>
          <SearchBar
            placeholder="Search"
            trailing={
              <IconButton aria-label="Filters" aria-expanded={filtersOpen} onPress={() => setFiltersOpen((o) => !o)}>
                <Icon>tune</Icon>
              </IconButton>
            }
          />
          {filtersOpen && (
            <ChipGroup aria-label="Filters" defaultSelectedKeys={["services"]} className="animate-[m3-fade-up_300ms_var(--md-easing-emphasized-decelerate)]">
              <FilterChip id="services">Services</FilterChip>
              <FilterChip id="incidents">Incidents</FilterChip>
              <FilterChip id="people">People</FilterChip>
              <FilterChip id="week">Last 7 days</FilterChip>
            </ChipGroup>
          )}
          <p className="text-body-sm text-on-surface-variant">
            {picked ? (
              <>
                Picked <span className="text-on-surface">{picked}</span>.
              </>
            ) : (
              "Tap the first bar to open the search view and pick a result; the tune icon reveals filter chips."
            )}
          </p>
        </div>
        <div className="space-y-3">
          <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Full screen · compact windows</div>
          <SearchView mode="fullscreen" placeholder="Search docs">
            {["Getting started", "Theming", "Dynamic color", "Text fields", "Search"].map((d) => (
              <SearchItem key={d} id={d} icon="description">
                {d}
              </SearchItem>
            ))}
          </SearchView>
          <p className="text-body-sm text-on-surface-variant">On compact widths the view covers the window with a 72dp header.</p>
        </div>
      </div>

      <Variants>
        <Variant n={1} label="Docked · suggestions" className="flex min-h-24 flex-col justify-center gap-3 rounded-lg bg-surface p-4">
          <div className="w-full overflow-hidden rounded-xl bg-surface-container-high">
            <SearchBar aria-label="Search" defaultValue="check" className="rounded-none bg-transparent" />
            <hr className="m-0 border-0 border-t border-outline" />
            <ListBox aria-label="Suggestions" className="py-2 outline-none">
              {["checkout-api", "checkout-web", "health-check"].map((s) => (
                <SearchItem key={s} id={s} textValue={s} icon="history">
                  <SearchHighlight query="check">{s}</SearchHighlight>
                </SearchItem>
              ))}
            </ListBox>
          </div>
        </Variant>
        <Variant n={2} label="Scoped · prefix chip" className="flex min-h-24 flex-col justify-center gap-3 rounded-lg bg-surface p-4">
          <ScopedSearch />
        </Variant>
        <Variant n={3} label="No results" className="flex min-h-24 flex-col justify-center gap-3 rounded-lg bg-surface p-4">
          <SearchBar aria-label="Search" defaultValue="kubernets" />
          <div className="flex flex-col items-center gap-1 py-4 text-center">
            <Icon size={32} className="text-on-surface-variant">
              search_off
            </Icon>
            <div className="text-title-md">No matches for “kubernets”</div>
            <div className="text-body-md text-on-surface-variant">
              Did you mean <a href="#search">kubernetes</a>?
            </div>
          </div>
        </Variant>
        <Variant n={4} label="Loading results" className="flex min-h-24 flex-col justify-center gap-3 rounded-lg bg-surface p-4">
          <SearchBar aria-label="Search" defaultValue="latency" trailing={<LoadingIndicator size={36} className="mr-2" />} />
          <div className="space-y-3 px-2 py-2" aria-busy>
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="size-6 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5" style={{ width: `${66 - i * 12}%` }} />
                  <Skeleton className="h-3" style={{ width: `${50 - i * 8}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Variant>
      </Variants>
    </Section>
  )
}

function ScopedSearch() {
  const [scoped, setScoped] = React.useState(true)
  return (
    <SearchBar
      aria-label="Search logs"
      placeholder={scoped ? "Search logs" : "Search all services"}
      leading={
        <span className="flex shrink-0 items-center gap-2 pl-3">
          <Icon className="text-on-surface">search</Icon>
          {scoped && (
            <span className="inline-flex h-8 items-center gap-1 rounded-sm bg-secondary-container pr-1 pl-3 text-label-lg text-on-secondary-container">
              in: checkout-api
              <IconButton size="xs" width="narrow" aria-label="Remove scope" onPress={() => setScoped(false)} className="size-6 text-current">
                <Icon size={16}>close</Icon>
              </IconButton>
            </span>
          )}
        </span>
      }
    />
  )
}
