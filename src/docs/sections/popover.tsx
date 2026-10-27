import * as React from "react"
import { Button } from "@/components/ui/button"
import { ChipGroup, FilterChip } from "@/components/ui/chip"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Popover,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Section, Variant, Variants } from "@/docs/section"

const COLORS = ["#B3261E", "#8C4A00", "#7D5700", "#146C2E", "#006A6A", "#0B57D0", "#6750A4", "#984061"]

export default function PopoverSection() {
  return (
    <Section
      id="popover"
      description="Anchored surface-container cards at level 2 — no arrows in M3. Popovers open on press and hold controls; hover cards preview an entity on hover or focus."
    >
      <div className="grid gap-6 pb-4 md:grid-cols-2">
        <div className="min-h-[120px]">
          <PopoverTrigger>
            <Button variant="tonal" className="pr-3 pl-4">
              <Icon>tune</Icon>
              Filters
              <Icon>arrow_drop_down</Icon>
            </Button>
            <Popover className="w-80">
              <PopoverTitle>Filter deployments</PopoverTitle>
              <div className="mt-3 space-y-3 text-body-md">
                <Switch defaultSelected className="w-full flex-row-reverse justify-between text-body-md">
                  Failed only
                </Switch>
                <ChipGroup aria-label="Range" selectionMode="single" defaultSelectedKeys={["7"]} disallowEmptySelection>
                  <FilterChip id="7">7 days</FilterChip>
                  <FilterChip id="30">30 days</FilterChip>
                  <FilterChip id="90">90 days</FilterChip>
                </ChipGroup>
              </div>
              <div className="mt-4 -mb-2 flex justify-end gap-2">
                <Button variant="text" slot="close">Reset</Button>
                <Button variant="text" slot="close">Apply</Button>
              </div>
            </Popover>
          </PopoverTrigger>
        </div>

        <p className="max-w-md text-body-lg text-on-surface-variant">
          Deploy approved by{" "}
          <HoverCard>
            <HoverCardTrigger href="#popover">@maya</HoverCardTrigger>
            <HoverCardContent>
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-full bg-primary-container text-title-md text-on-primary-container">ML</span>
                <span>
                  <span className="block text-title-md text-on-surface">Maya Lindqvist</span>
                  <span className="block text-body-md text-on-surface-variant">Staff Platform Engineer</span>
                </span>
              </div>
              <p className="mt-3 text-body-md text-on-surface-variant">
                On call for <span className="font-mono">checkout</span> · Stockholm (UTC+1)
              </p>
              <div className="mt-3 flex gap-2">
                <Button variant="tonal" size="xs">
                  <Icon>chat</Icon>
                  Message
                </Button>
                <Button variant="outlined" size="xs">
                  <Icon>person</Icon>
                  Profile
                </Button>
              </div>
            </HoverCardContent>
          </HoverCard>{" "}
          at 14:02 after the canary held for 30 minutes.
        </p>
      </div>

      <Variants cols="md:grid-cols-2">
        <Variant n={1} label="Share · link & access" className="min-h-24 rounded-lg bg-surface p-4">
          <PopoverTrigger>
            <Button variant="tonal" className="pl-4">
              <Icon>share</Icon>
              Share
            </Button>
            <Popover className="w-[340px]">
              <PopoverTitle>Share “Q4 rollout plan”</PopoverTitle>
              <div className="mt-3 flex items-center gap-2 rounded-sm bg-surface-container-highest py-1 pr-1 pl-3">
                <Icon size={20} className="text-on-surface-variant">link</Icon>
                <span className="min-w-0 flex-1 truncate font-mono text-body-sm">kestrel.io/s/q4-rollout</span>
                <Button variant="text" size="xs">Copy</Button>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Icon className="text-on-surface-variant">public</Icon>
                <span className="flex-1 text-body-md">
                  Anyone with the link
                  <span className="block text-body-sm text-on-surface-variant">Can view</span>
                </span>
                <Icon className="text-on-surface-variant">expand_more</Icon>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-outline-variant pt-3">
                <div className="flex -space-x-2">
                  {[
                    ["ML", "bg-primary-container text-on-primary-container"],
                    ["JP", "bg-tertiary-container text-on-tertiary-container"],
                    ["AR", "bg-secondary-container text-on-secondary-container"],
                  ].map(([i, tone]) => (
                    <span key={i} className={`grid size-8 place-items-center rounded-full text-label-md ring-2 ring-surface-container ${tone}`}>{i}</span>
                  ))}
                </div>
                <span className="text-body-sm text-on-surface-variant">3 people have access</span>
              </div>
            </Popover>
          </PopoverTrigger>
        </Variant>

        <Variant n={2} label="Color picker" className="min-h-24 rounded-lg bg-surface p-4">
          <ColorPicker />
        </Variant>

        <Variant n={3} label="Inline help" className="min-h-24 rounded-lg bg-surface p-4">
          <div className="flex items-center gap-2 text-body-lg">
            Retention period
            <PopoverTrigger>
              <IconButton aria-label="How retention works" size="xs">
                <Icon>info</Icon>
              </IconButton>
              <Popover className="w-72" placement="bottom">
                <PopoverTitle>How retention works</PopoverTitle>
                <PopoverDescription>
                  Logs older than the period are deleted nightly. Audit logs are always kept for a year.
                </PopoverDescription>
                <div className="mt-2 -mb-2 -ml-3">
                  <Button variant="text" size="xs">
                    Learn more
                    <Icon>open_in_new</Icon>
                  </Button>
                </div>
              </Popover>
            </PopoverTrigger>
            <span className="ml-auto rounded-xs border border-outline px-3 py-1.5 text-body-md">30 days</span>
          </div>
        </Variant>

        <Variant n={4} label="Hover card · service" className="min-h-24 rounded-lg bg-surface p-4">
          <p className="text-body-md text-on-surface-variant">
            Deploy blocked on{" "}
            <HoverCard openDelay={300}>
              <HoverCardTrigger href="#popover" className="font-mono">checkout-api</HoverCardTrigger>
              <HoverCardContent>
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-md bg-secondary-container text-on-secondary-container">
                    <Icon>dns</Icon>
                  </span>
                  <span>
                    <span className="block font-mono text-title-sm text-on-surface">checkout-api</span>
                    <span className="block text-body-sm text-on-surface-variant">Team Payments · v4.2.0</span>
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  {[
                    ["142", "p95 ms"],
                    ["0.02%", "errors"],
                    ["1", "failing"],
                  ].map(([v, l]) => (
                    <span key={l} className="rounded-sm bg-surface-container-high py-2">
                      <span className="block text-title-md text-on-surface">{v}</span>
                      <span className="block text-label-sm text-on-surface-variant">{l}</span>
                    </span>
                  ))}
                </div>
              </HoverCardContent>
            </HoverCard>{" "}
            until the canary passes.
          </p>
          <p className="mt-2 text-body-sm text-on-surface-variant">Hover the service name · opens after 300 ms</p>
        </Variant>
      </Variants>
    </Section>
  )
}

function ColorPicker() {
  const [color, setColor] = React.useState(COLORS[6])
  return (
    <PopoverTrigger>
      <Button variant="outlined" className="pr-3 pl-4">
        <span className="size-4 rounded-full" style={{ background: color }} />
        Label color
        <Icon>arrow_drop_down</Icon>
      </Button>
      <Popover aria-label="Label color" className="w-60">
        <div className="text-title-sm">Label color</div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              aria-label={c}
              aria-pressed={c === color}
              onClick={() => setColor(c)}
              className="focus-ring grid size-10 cursor-pointer place-items-center rounded-full text-white transition-[border-radius] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial aria-pressed:rounded-md"
              style={{ background: c }}
            >
              {c === color && <Icon size={20}>check</Icon>}
            </button>
          ))}
        </div>
        <div className="mt-3 -mb-2 -ml-3">
          <Button variant="text" size="xs">
            <Icon>palette</Icon>
            Custom…
          </Button>
        </div>
      </Popover>
    </PopoverTrigger>
  )
}
