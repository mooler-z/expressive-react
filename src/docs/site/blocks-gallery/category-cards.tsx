import { ToggleButton, ToggleButtonGroup, type Key } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Ripple } from "@/components/ui/ripple"
import { Select, SelectItem } from "@/components/ui/select"
import { CATEGORIES, type BlockCategory } from "@/docs/site/blocks-gallery/catalog"
import { cn } from "@/lib/utils"

const ICONS: Record<BlockCategory, string> = {
  templates: "web",
  marketing: "campaign",
  dashboard: "monitoring",
  layouts: "dashboard",
  auth: "lock",
  settings: "settings",
  shell: "view_sidebar",
  data: "table_chart",
  people: "group",
}

const BLURBS: Record<BlockCategory, string> = {
  templates: "Full products, ready to fork",
  marketing: "Landing sections and pages",
  dashboard: "KPIs, charts and chart states",
  layouts: "M3 canonical layouts",
  auth: "Login, signup, 2FA and verify",
  settings: "Profile, members, notifications",
  shell: "App shells and sidebars",
  data: "Tables, stats and chart cards",
  people: "Invites, profiles and members",
}

const plural = (n: number) => `${n} ${n === 1 ? "block" : "blocks"}`

interface CategoryPickerProps {
  value: BlockCategory
  onChange: (next: BlockCategory) => void
  counts: Record<BlockCategory, number>
}

/**
 * The gallery's main control, as cards that read as choices: outlined at rest with a state layer
 * and hover lift, a radio-style indicator, and the selected card filled (secondary-container) with
 * a check. Single-select toggle group: arrow keys move focus, Enter / Space selects, so moving
 * through the cards doesn't load every category's previews.
 */
export function CategoryCards({ value, onChange, counts, className }: CategoryPickerProps & { className?: string }) {
  return (
    <ToggleButtonGroup
      aria-label="Block category"
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[value]}
      onSelectionChange={(keys: Set<Key>) => {
        const next = [...keys][0] as BlockCategory | undefined
        if (next) onChange(next)
      }}
      className={cn("grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5", className)}
      data-spec="Category cards|Single-select cards. Rest: outline-variant border + state layer, elevation 1 on hover. Selected: secondary-container fill, corners 16 → 28dp on the FastSpatial spring, filled check."
    >
      {CATEGORIES.map((c) => (
        <ToggleButton
          key={c.id}
          id={c.id}
          className={cn(
            "group state-layer focus-ring shape-morph relative flex min-w-0 cursor-pointer flex-col items-start rounded-lg border border-outline-variant",
            "bg-surface-container-low p-4 text-start text-on-surface select-none",
            "data-hovered:border-outline data-hovered:shadow-1 data-pressed:rounded-xl",
            "data-selected:rounded-xl data-selected:border-transparent data-selected:bg-secondary-container data-selected:text-on-secondary-container",
          )}
        >
          {({ isSelected }) => (
            <>
              <span className="flex w-full items-start justify-between gap-2">
                <span
                  className={cn(
                    "shape-morph grid size-10 shrink-0 place-items-center rounded-md",
                    isSelected ? "rounded-full bg-secondary text-on-secondary" : "bg-surface-container-highest text-on-surface-variant",
                  )}
                >
                  <Icon size={22} filled={isSelected}>
                    {ICONS[c.id]}
                  </Icon>
                </span>
                <Icon size={22} filled={isSelected} className={isSelected ? "text-on-secondary-container" : "text-on-surface-variant"}>
                  {isSelected ? "check_circle" : "radio_button_unchecked"}
                </Icon>
              </span>
              <span className="mt-3 block text-title-md">{c.label}</span>
              <span className={cn("block text-body-sm tabular-nums", isSelected ? "text-on-secondary-container" : "text-on-surface-variant")}>
                {plural(counts[c.id])}
              </span>
              <span className={cn("mt-1 hidden text-body-sm md:block", isSelected ? "text-on-secondary-container/80" : "text-on-surface-variant")}>
                {BLURBS[c.id]}
              </span>
              <Ripple />
            </>
          )}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

/**
 * Compact switcher that slides in under the site header once the cards have scrolled away,
 * so the category can change from anywhere in a long gallery.
 */
export function CategoryBar({ value, onChange, counts, visible, onShowAll }: CategoryPickerProps & { visible: boolean; onShowAll: () => void }) {
  return (
    <div
      inert={!visible}
      aria-hidden={!visible || undefined}
      className={cn(
        "fixed inset-x-0 top-16 z-30 border-b border-outline-variant bg-surface/95 backdrop-blur transition-[translate,opacity] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0",
      )}
    >
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-2 md:px-8">
        <Select
          aria-label="Block category"
          density="xs"
          selectedKey={value}
          onSelectionChange={(k) => k && onChange(k as BlockCategory)}
          className="w-56 shrink-0 sm:w-64"
        >
          {CATEGORIES.map((c) => (
            <SelectItem key={c.id} id={c.id} icon={ICONS[c.id]} textValue={c.label}>
              {c.label}
            </SelectItem>
          ))}
        </Select>
        <span className="hidden truncate text-body-md text-on-surface-variant sm:block">{plural(counts[value])}</span>
        <Button variant="text" className="ml-auto" icon={<Icon name="grid_view" />} onPress={onShowAll}>
          <span className="hidden sm:inline">All categories</span>
          <span className="sm:hidden">All</span>
        </Button>
      </div>
    </div>
  )
}
