import type * as React from "react"

// Registry id → the Components-page (kit) section that already demos it. Used as the Preview for
// component and hook pages that don't have a content file yet, so every /docs/<id> shows something real.

export const KIT_SECTION: Record<string, string> = {
  // Actions
  button: "buttons",
  "icon-button": "icon-buttons",
  fab: "fab",
  "button-group": "button-groups",
  // Communication
  badge: "badges",
  progress: "progress",
  "loading-indicator": "loading",
  snackbar: "snackbar",
  toast: "toast",
  tooltip: "tooltips",
  // Containment
  card: "cards",
  carousel: "carousel",
  dialog: "dialogs",
  "alert-dialog": "alert-dialog",
  divider: "dividers",
  list: "lists",
  sheet: "sheets",
  accordion: "accordion",
  // Navigation
  "app-bar": "app-bars",
  "navigation-bar": "navigation-bar",
  "navigation-rail": "navigation-rail",
  "navigation-drawer": "navigation-drawer",
  tabs: "tabs",
  search: "search",
  toolbar: "toolbars",
  breadcrumb: "breadcrumb",
  pagination: "pagination",
  sidebar: "sidebar",
  "navigation-menu": "navigation-menu",
  menubar: "context-menu",
  // Selection
  checkbox: "checkbox",
  chip: "chips",
  "date-picker": "date-pickers",
  "time-picker": "time-pickers",
  calendar: "calendar",
  menu: "menus",
  select: "menus",
  radio: "radio",
  slider: "sliders",
  switch: "switch",
  combobox: "combobox",
  command: "command",
  "context-menu": "context-menu",
  // Inputs & forms
  "text-field": "text-fields",
  field: "field",
  "input-group": "input-group",
  "input-otp": "input-otp",
  "date-field": "date-pickers",
  // Content & layout
  avatar: "avatar",
  "aspect-ratio": "aspect-ratio",
  "code-block": "code-block",
  "empty-state": "empty",
  skeleton: "skeleton",
  "scroll-area": "scroll-area",
  resizable: "scroll-area",
  marker: "marker",
  popover: "popover",
  direction: "direction",
  alert: "alert",
  // Data
  table: "table",
  "data-table": "data-table",
  chart: "chart",
  trace: "trace",
  // Chat
  message: "message",
  "message-scroller": "message-scroller",
  attachment: "attachment",
  questionnaire: "questionnaire",
  // Utilities
  shape: "shape",
  ripple: "interactions",
  reveal: "interactions",
  "theme-provider": "color",
  // Hooks
  "use-window-size-class": "layout",
  "use-media-query": "layout",
  "use-motion": "motion",
  "use-press-scale": "interactions",
  "use-magnetic": "interactions",
  "use-tilt": "interactions",
  "use-drag-scroll": "scroll-area",
}

/** Lazy kit sections (src/docs/sections/<id>.tsx default exports). */
export const KIT_SECTIONS = import.meta.glob<{ default: React.ComponentType }>("/src/docs/sections/*.tsx")

/**
 * Kit sections that can't run inside the site chrome. The command kit demo mounts a CommandDialog with the
 * default ⌘K shortcut, which the site header's search already owns: both palettes would toggle together.
 */
export const KIT_FALLBACK_EXCLUDED: Record<string, string> = {
  command: "Its kit demo binds ⌘K, which the site search uses on this page.",
}

export function kitSectionLoader(id: string) {
  if (KIT_FALLBACK_EXCLUDED[id]) return undefined
  const section = KIT_SECTION[id]
  return section ? KIT_SECTIONS[`/src/docs/sections/${section}.tsx`] : undefined
}
