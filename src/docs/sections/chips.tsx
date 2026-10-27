import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  AssistChip,
  Chip,
  ChipGroup,
  ChipInput,
  FilterChip,
  InputChip,
  InputChipGroup,
  SuggestionChip,
} from "@/components/ui/chip"
import { Icon } from "@/components/ui/icon"
import { Row, Section, Variant, Variants } from "@/docs/section"

const PEOPLE = [
  { id: "maya", label: "Maya Lindqvist", avatar: "ML" },
  { id: "ops", label: "ops-team@kestrel.io" },
  { id: "selected", label: "Selected" },
]

const INITIALS: Record<string, string> = { "Maya Lindqvist": "ML", "Jonah Park": "JP" }

export default function ChipsSection() {
  const [people, setPeople] = React.useState(PEOPLE)
  return (
    <Section
      id="chips"
      description="32dp, 8dp corners, label-large. Assist (action), filter (selected → secondary-container with check), input (removable, with avatar) and suggestion. Elevated variants drop the outline for level 1."
      spec="https://m3.material.io/components/chips/overview"
    >
      <Row label="Assist">
        <AssistChip icon="calendar_today">Add to calendar</AssistChip>
        <AssistChip icon="directions">Directions</AssistChip>
        <AssistChip icon="alarm" elevated>
          Elevated
        </AssistChip>
      </Row>
      <Row label="Filter · click to toggle">
        <FilterChip defaultSelected>Production</FilterChip>
        <FilterChip>Staging</FilterChip>
        <FilterChip>Europe</FilterChip>
        <FilterChip trailingIcon="arrow_drop_down">Region</FilterChip>
      </Row>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Input · remove with ×</div>
          <Button variant="text" size="xs" onPress={() => setPeople(PEOPLE)}>
            <Icon>restart_alt</Icon>
            Restore
          </Button>
        </div>
        <InputChipGroup
          aria-label="Recipients"
          items={people}
          selectionMode="none"
          onRemove={(keys) => setPeople((p) => p.filter((x) => !keys.has(x.id)))}
          renderEmptyState={() => <span className="text-body-md text-on-surface-variant">All removed</span>}
        >
          {(p) => (
            <InputChip
              id={p.id}
              avatar={p.avatar}
              className={p.id === "selected" ? "border-transparent bg-secondary-container text-on-secondary-container" : undefined}
            >
              {p.label}
            </InputChip>
          )}
        </InputChipGroup>
      </div>
      <Row label="Suggestion">
        <SuggestionChip>Show failed runs</SuggestionChip>
        <SuggestionChip>Compare with last week</SuggestionChip>
        <SuggestionChip elevated>Export CSV</SuggestionChip>
      </Row>

      <Variants>
        <Variant n={1} label="Filter · dropdown">
          <FilterChip isSelected trailingIcon="arrow_drop_down">
            Region: EU
          </FilterChip>
          <FilterChip trailingIcon="arrow_drop_down">Status</FilterChip>
        </Variant>
        <Variant n={2} label="Choice · single select">
          <ChipGroup aria-label="Sort" selectionMode="single" disallowEmptySelection defaultSelectedKeys={["newest"]} className="justify-center">
            <FilterChip id="newest">Newest</FilterChip>
            <FilterChip id="oldest">Oldest</FilterChip>
            <FilterChip id="active">Most active</FilterChip>
          </ChipGroup>
        </Variant>
        <Variant n={3} label="Input · in a field">
          <ChipInput
            label="To"
            defaultValue={["Maya Lindqvist", "Jonah Park"]}
            placeholder="Add people"
            renderAvatar={(v) =>
              INITIALS[v] ?? v.split(/\s+/).map((w) => w[0]?.toUpperCase()).join("").slice(0, 2)
            }
          />
        </Variant>
        <Variant n={4} label="Assist · elevated">
          <AssistChip elevated icon="directions">
            Directions
          </AssistChip>
          <AssistChip elevated icon="call">
            Call
          </AssistChip>
          <AssistChip elevated icon="language">
            Website
          </AssistChip>
        </Variant>
        <Variant n={5} label="Status">
          <Chip icon={<Icon filled>check_circle</Icon>} className="gap-1.5 border-transparent bg-tertiary-container pr-3 text-on-tertiary-container">
            Healthy
          </Chip>
          <Chip icon={<Icon filled>warning</Icon>} className="gap-1.5 border-transparent bg-secondary-container pr-3 text-on-secondary-container">
            Degraded
          </Chip>
          <Chip icon={<Icon filled>error</Icon>} className="gap-1.5 border-transparent bg-error-container pr-3 text-on-error-container">
            Failing
          </Chip>
        </Variant>
        <Variant n={6} label="Disabled">
          <AssistChip isDisabled icon="event">
            Assist
          </AssistChip>
          <FilterChip isDisabled defaultSelected>
            Filter
          </FilterChip>
        </Variant>
        <Variant n={7} label="Overflow · +N" className="flex min-h-24 items-center rounded-lg bg-surface p-4">
          <div className="flex w-full flex-wrap items-center gap-2">
            {["api-gateway", "auth", "billing"].map((s) => (
              <Chip key={s} className="px-3 font-mono text-body-sm">
                {s}
              </Chip>
            ))}
            <SuggestionChip className="border-transparent bg-surface-container-high px-3">+4</SuggestionChip>
          </div>
        </Variant>
        <Variant n={8} label="Dense · 24dp" className="flex min-h-24 flex-wrap items-center justify-center gap-1.5 rounded-lg bg-surface p-4">
          <Chip dense className="text-on-surface-variant">
            p95
          </Chip>
          <Chip dense className="text-on-surface-variant">
            eu-central-1
          </Chip>
          <Chip dense className="text-on-surface-variant">
            v2.14
          </Chip>
          <FilterChip dense defaultSelected>
            canary
          </FilterChip>
        </Variant>
      </Variants>
    </Section>
  )
}
