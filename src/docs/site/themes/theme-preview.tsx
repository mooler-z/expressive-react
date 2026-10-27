import { TopAppBar } from "@/components/ui/app-bar"
import { Button } from "@/components/ui/button"
import { Chip, FilterChip } from "@/components/ui/chip"
import { Fab } from "@/components/ui/fab"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { List, ListItem } from "@/components/ui/list"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ThemeScope } from "@/components/ui/theme-provider"
import type { BuilderTheme } from "@/docs/site/themes/theme-data"

const SURFACES = ["bg-surface-container-lowest", "bg-surface-container-low", "bg-surface-container", "bg-surface-container-high", "bg-surface-container-highest"]

/** One phone-like preview, rendered with its own scheme (independent of the site's mode). */
export function ThemePreview({ theme, mode }: { theme: BuilderTheme; mode: "light" | "dark" }) {
  const title = mode === "light" ? "Light" : "Dark"
  return (
    <ThemeScope
      mode={mode}
      seed={theme.seed}
      variant={theme.variant}
      contrast={theme.contrast}
      aria-label={`${title} preview`}
      role="group"
      className="overflow-hidden rounded-xl shadow-1 ring-1 ring-outline-variant/50"
    >
      <TopAppBar
        className="static"
        scrolled
        title={title}
        navigation={
          <IconButton aria-label="Menu">
            <Icon name="menu" />
          </IconButton>
        }
        actions={
          <IconButton aria-label="More options">
            <Icon name="more_vert" />
          </IconButton>
        }
      />
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          <Button>Filled</Button>
          <Button variant="tonal">Tonal</Button>
          <Button variant="outlined">Outlined</Button>
          <Button variant="text">Text</Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="min-w-0 rounded-xl bg-primary-container p-4 text-on-primary-container">
            <div className="truncate text-label-md">primary-container</div>
            <div className="mt-1 text-headline-sm font-medium tabular-nums">1,284</div>
          </div>
          <div className="min-w-0 rounded-xl bg-tertiary-container p-4 text-on-tertiary-container">
            <div className="truncate text-label-md">tertiary-container</div>
            <div className="mt-1 text-headline-sm font-medium tabular-nums">+38%</div>
          </div>
        </div>

        <List className="overflow-hidden rounded-lg bg-surface-container-high py-0">
          <ListItem
            className="bg-transparent"
            leading={
              <span className="grid size-10 place-items-center rounded-full bg-secondary-container text-on-secondary-container">
                <Icon name="inbox" size={20} filled />
              </span>
            }
            supportingText="on surface-container-high"
            trailing={<Switch defaultSelected aria-label={`${title} preview switch`} />}
          >
            List item
          </ListItem>
        </List>

        <Slider aria-label={`${title} preview slider`} defaultValue={55} />

        <div className="flex flex-wrap items-center gap-2">
          <FilterChip defaultSelected>Selected</FilterChip>
          <Chip>Chip</Chip>
          <Chip className="border-transparent bg-error-container text-on-error-container">Error</Chip>
          <Fab aria-label="Edit" size="sm" className="ml-auto">
            <Icon name="edit" />
          </Fab>
        </div>
      </div>
      <div className="grid grid-cols-5" aria-hidden>
        {SURFACES.map((s) => (
          <span key={s} className={`h-6 ${s}`} />
        ))}
      </div>
    </ThemeScope>
  )
}
