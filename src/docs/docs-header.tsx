import { Button as AriaButton, ListBox, ListBoxItem, Popover, Select, SelectValue } from "react-aria-components"
import { NavLink } from "react-router"

import { Icon } from "@/components/ui/icon"
import { ToggleIconButton } from "@/components/ui/icon-button"
import { Shape } from "@/components/ui/shape"
import { useTheme, type SchemeVariant } from "@/components/ui/theme-provider"
import { PAGES } from "@/docs/catalog"
import { cn } from "@/lib/utils"

const SEEDS = ["#6750A4", "#0B57D0", "#146C2E", "#B3261E", "#8C4A00", "#006A6A"]
const VARIANTS: SchemeVariant[] = ["tonalSpot", "vibrant", "expressive", "fidelity", "content", "neutral", "monochrome", "rainbow", "fruitSalad"]

/** Sticky docs top bar: page nav + theme controls. Pages with their own app chrome (Landing, Admin) may omit it. */
export function DocsHeader({ leading }: { leading?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-2 bg-surface/90 px-2 backdrop-blur md:px-4">
      {leading}
      <NavLink to="/" className="flex items-center gap-3 pl-2">
        <Shape shape="cookie9" hoverShape="sunny" className="size-9 text-primary" />
        <span className="text-title-lg font-medium">
          Expressive React <span className="hidden text-on-surface-variant sm:inline">· Kit</span>
        </span>
      </NavLink>
      <nav className="ml-4 hidden items-center gap-1 xl:flex">
        {PAGES.map((p) => (
          <NavLink
            key={p.path}
            to={p.path}
            className={({ isActive }) =>
              cn(
                "state-layer inline-flex h-10 items-center gap-2 rounded-full px-4 text-label-lg text-primary",
                isActive && "bg-secondary-container text-on-secondary-container",
              )
            }
          >
            <Icon size={20}>{p.icon}</Icon>
            {p.title}
          </NavLink>
        ))}
      </nav>
      <ThemeControls className="ml-auto" />
    </header>
  )
}

export function ThemeControls({ className }: { className?: string }) {
  const { resolvedMode, setMode, seed, setSeed, variant, setVariant } = useTheme()
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="hidden items-center gap-1 md:flex">
        {SEEDS.map((hex) => (
          <AriaButton
            key={hex}
            aria-label={`Seed ${hex}`}
            onPress={() => setSeed(seed === hex ? null : hex)}
            className="focus-ring size-7 cursor-pointer rounded-full border-2 border-transparent transition-[border-radius] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial data-hovered:rounded-[8px]"
            style={{ background: hex, borderColor: seed === hex ? "var(--md-on-surface)" : undefined }}
          />
        ))}
      </div>
      <Select
        aria-label="Scheme variant"
        selectedKey={variant}
        onSelectionChange={(k) => setVariant(k as SchemeVariant)}
        isDisabled={!seed}
        className="hidden sm:block"
      >
        <AriaButton className="state-layer focus-ring ml-2 inline-flex h-10 cursor-pointer items-center gap-1 rounded-full border border-outline-variant pr-2 pl-4 text-label-lg text-on-surface-variant data-disabled:opacity-38">
          <SelectValue />
          <Icon size={20}>arrow_drop_down</Icon>
        </AriaButton>
        <Popover className="min-w-(--trigger-width) rounded-xs bg-surface-container py-2 shadow-2">
          <ListBox className="outline-none">
            {VARIANTS.map((v) => (
              <ListBoxItem
                key={v}
                id={v}
                className="state-layer flex h-12 cursor-pointer items-center px-4 text-label-lg outline-none data-selected:bg-secondary-container data-selected:text-on-secondary-container"
              >
                {v}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </Select>
      <ToggleIconButton aria-label="Dark mode" isSelected={resolvedMode === "dark"} onChange={(dark) => setMode(dark ? "dark" : "light")}>
        <Icon>{resolvedMode === "dark" ? "dark_mode" : "light_mode"}</Icon>
      </ToggleIconButton>
    </div>
  )
}
