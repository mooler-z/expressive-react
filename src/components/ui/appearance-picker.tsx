"use client"

import * as React from "react"
import { Label, Radio, RadioGroup, type PopoverProps as AriaPopoverProps } from "react-aria-components"

import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { Ripple } from "@/components/ui/ripple"
import { useTheme, type ThemeMode } from "@/components/ui/theme-provider"
import type { ThemePreset } from "@/components/ui/theme-presets"
import { cn } from "@/lib/utils"

/*
 * Appearance picker · the end-user theme menu: a grid of looks (theme presets, shown by their swatches) and
 * light / system / dark. Reads and writes ThemeProvider through useTheme(), so the choice persists with the
 * provider's other settings. AppearancePanel is the content alone, for settings pages; AppearancePicker puts it
 * in a popover behind a palette icon button for app bars.
 */

const NONE = "__default"

const MODES: { id: ThemeMode; label: string; icon: string }[] = [
  { id: "light", label: "Light", icon: "light_mode" },
  { id: "system", label: "System", icon: "brightness_auto" },
  { id: "dark", label: "Dark", icon: "dark_mode" },
]

export interface AppearancePanelProps {
  /** Looks to offer. Defaults to every preset the ThemeProvider knows (its `presets` prop). */
  presets?: readonly ThemePreset[]
  /** Adds a first option with this label that removes the preset (the provider's default colors). */
  defaultLabel?: string
  /** Show the light / system / dark switch. */
  showMode?: boolean
  /** Panel heading. Pass null for none. */
  title?: React.ReactNode
  /** Line under the heading. */
  description?: React.ReactNode
  className?: string
}

/** Four swatch stripes for a look, in the current mode. */
function LookSwatches({ colors }: { colors: string[] }) {
  return (
    <span aria-hidden data-slot="appearance-swatches" className="flex h-7 w-10 shrink-0 overflow-hidden rounded-xs ring-1 ring-outline-variant">
      {colors.slice(0, 4).map((c, i) => (
        <span key={i} className="flex-1" style={{ background: c }} />
      ))}
    </span>
  )
}

const lookStyles = cn(
  "state-layer focus-ring relative flex min-w-0 cursor-pointer items-center gap-2 rounded-md border border-outline-variant p-2 text-on-surface outline-none",
  "data-selected:border-primary data-selected:bg-primary-container/40",
)

/** The picker's content: looks and mode. Use it on a settings page, or inside your own popover or sheet. */
function AppearancePanel({ presets: presetsProp, defaultLabel, showMode = true, title = "Appearance", description, className }: AppearancePanelProps) {
  const theme = useTheme()
  const presets = presetsProp ?? theme.presets
  const mode = theme.resolvedMode
  const value = theme.preset?.id ?? NONE
  const modeLabel = React.useId()

  return (
    <div data-slot="appearance-panel" className={cn("flex flex-col gap-5", className)}>
      {(title || description) && (
        <div>
          {title && <div className="text-title-md">{title}</div>}
          {description && <div className="text-body-sm text-on-surface-variant">{description}</div>}
        </div>
      )}

      <RadioGroup
        data-slot="appearance-looks"
        value={value}
        onChange={(v) => theme.setPreset(v === NONE ? null : v)}
        className="flex flex-col gap-2"
      >
        <Label className="text-label-lg text-on-surface-variant">Look</Label>
        <div className="-m-1 grid max-h-[min(320px,40vh)] grid-cols-2 gap-2 overflow-y-auto p-1">
          {defaultLabel && (
            <Radio value={NONE} className={lookStyles}>
              {({ isSelected }) => (
                <>
                  <span aria-hidden className="grid h-7 w-10 shrink-0 place-items-center rounded-xs bg-surface-container-highest text-on-surface-variant ring-1 ring-outline-variant">
                    <Icon name="format_color_reset" size={18} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-label-lg">{defaultLabel}</span>
                  {isSelected && <Icon name="check_circle" size={18} filled className="text-primary" />}
                  <Ripple />
                </>
              )}
            </Radio>
          )}
          {presets.map((p) => (
            <Radio key={p.id} value={p.id} className={lookStyles}>
              {({ isSelected }) => (
                <>
                  <LookSwatches colors={p.swatches?.[mode] ?? [p.seed]} />
                  <span className="min-w-0 flex-1 truncate text-label-lg">{p.name}</span>
                  {isSelected && <Icon name="check_circle" size={18} filled className="text-primary" />}
                  <Ripple />
                </>
              )}
            </Radio>
          ))}
        </div>
      </RadioGroup>

      {showMode && (
        <div data-slot="appearance-mode" className="flex flex-col gap-2">
          <span id={modeLabel} className="text-label-lg text-on-surface-variant">
            Mode
          </span>
          <ConnectedButtonGroup
            aria-labelledby={modeLabel}
            size="sm"
            variant="tonal"
            selectedKeys={[theme.mode]}
            onSelectionChange={(keys) => {
              const [next] = [...keys]
              if (next) theme.setMode(next as ThemeMode)
            }}
            className="w-full"
          >
            {MODES.map((m) => (
              <ConnectedButton key={m.id} id={m.id} className="flex-1 gap-1.5">
                <Icon name={m.icon} size={18} />
                {m.label}
              </ConnectedButton>
            ))}
          </ConnectedButtonGroup>
        </div>
      )}
    </div>
  )
}

export interface AppearancePickerProps extends AppearancePanelProps {
  /** Accessible name of the trigger and the popover. */
  "aria-label"?: string
  /** Material Symbols name for the trigger. */
  icon?: string
  placement?: AriaPopoverProps["placement"]
  /** Classes for the trigger icon button. */
  triggerClassName?: string
}

/** Palette icon button that opens the appearance panel in a popover. Drop it into an app bar. */
function AppearancePicker({ "aria-label": label = "Appearance", icon = "palette", placement = "bottom end", triggerClassName, className, ...panel }: AppearancePickerProps) {
  return (
    <PopoverTrigger>
      <IconButton aria-label={label} data-slot="appearance-picker" className={triggerClassName}>
        <Icon name={icon} />
      </IconButton>
      <Popover placement={placement} aria-label={label} className="w-[min(400px,calc(100vw-32px))] overflow-y-auto">
        <AppearancePanel {...panel} className={className} />
      </Popover>
    </PopoverTrigger>
  )
}

export { AppearancePanel, AppearancePicker }
