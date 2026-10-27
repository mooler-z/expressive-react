import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Select, SelectItem } from "@/components/ui/select"
import { cn } from "@/lib/utils"

/*
 * The token sheet's section navigation, built like the Blocks gallery's category picker:
 * cards at the top, a sticky list beside the content from 1200dp, and a compact bar below that.
 * These jump within the page, so they're links (aria-current="location"), not a selection.
 */

export const TOKEN_SECTIONS = [
  { id: "color", label: "Color", icon: "palette", blurb: "49 roles, light and dark" },
  { id: "type", label: "Type", icon: "text_fields", blurb: "15 styles in Roboto Flex" },
  { id: "shape", label: "Shape", icon: "interests", blurb: "Corner radii and the shape library" },
  { id: "elevation", label: "Elevation", icon: "layers", blurb: "Shadow levels 0–5" },
  { id: "springs", label: "Motion", icon: "animation", blurb: "Spatial and effects springs" },
  { id: "interactions", label: "Interactions", icon: "touch_app", blurb: "State layers, ripple and focus" },
  { id: "symbols", label: "Icons", icon: "emoji_symbols", blurb: "Material Symbols Rounded" },
  { id: "layout", label: "Layout", icon: "space_dashboard", blurb: "The five window size classes" },
] as const

export type TokenSectionId = (typeof TOKEN_SECTIONS)[number]["id"]

/** The section being read: the last one whose top has passed under the header (+ bar). */
export function useActiveSection(offset = 140): TokenSectionId {
  const [active, setActive] = React.useState<TokenSectionId>(TOKEN_SECTIONS[0].id)
  React.useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      let current: TokenSectionId = TOKEN_SECTIONS[0].id
      for (const { id } of TOKEN_SECTIONS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= offset) current = id
      }
      // At the very bottom the last sections can't reach the top; treat them as read.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = TOKEN_SECTIONS.at(-1)!.id
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [offset])
  return active
}

function jumpTo(id: string) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" })
}

/** Outlined link cards with a state layer and hover lift; the arrow says "jumps down this page". */
export function TokenCards({ className }: { className?: string }) {
  return (
    <nav aria-label="Token sections" className={className}>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {TOKEN_SECTIONS.map((s) => (
          <li key={s.id} className="flex">
            <a
              href={`#${s.id}`}
              className={cn(
                "group state-layer focus-ring shape-morph relative flex w-full min-w-0 flex-col items-start rounded-lg border border-outline-variant bg-surface-container-low p-4 text-on-surface",
                "hover:border-outline hover:shadow-1 active:rounded-xl",
              )}
            >
              <span className="flex w-full items-start justify-between gap-2">
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-surface-container-highest text-on-surface-variant">
                  <Icon size={22}>{s.icon}</Icon>
                </span>
                <Icon
                  size={22}
                  className="text-on-surface-variant transition-transform duration-(--md-spring-fast-spatial-duration) ease-fast-spatial group-hover:translate-y-0.5 motion-reduce:transition-none"
                >
                  arrow_downward
                </Icon>
              </span>
              <span className="mt-3 block text-title-md">{s.label}</span>
              <span className="block text-body-sm text-on-surface-variant">{s.blurb}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Sticky list beside the sheet (navigation-drawer items), highlighting the section being read. */
export function TokenSidebar({ active, className }: { active: TokenSectionId; className?: string }) {
  return (
    <nav aria-labelledby="token-sidebar-title" className={className}>
      <div id="token-sidebar-title" className="px-4 pb-2 text-title-sm text-on-surface-variant">
        On this page
      </div>
      <ul className="flex flex-col gap-0.5">
        {TOKEN_SECTIONS.map((s) => {
          const on = s.id === active
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={on ? "location" : undefined}
                className={cn(
                  "state-layer focus-ring flex h-12 w-full items-center gap-3 rounded-full px-4 text-label-lg",
                  "transition-colors duration-(--md-spring-default-effects-duration) ease-default-effects",
                  on ? "bg-secondary-container font-semibold text-on-secondary-container" : "text-on-surface-variant",
                )}
              >
                <Icon size={20} filled={on} className="shrink-0">
                  {s.icon}
                </Icon>
                <span className="min-w-0 flex-1 truncate">{s.label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/** Compact bar under the site header once the cards have scrolled away (below 1200dp). */
export function TokenBar({ active, visible, className }: { active: TokenSectionId; visible: boolean; className?: string }) {
  return (
    <div
      inert={!visible}
      aria-hidden={!visible || undefined}
      className={cn(
        "fixed inset-x-0 top-(--site-top) z-30 border-b border-outline-variant bg-surface/95 backdrop-blur transition-[translate,opacity] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial md:start-24",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0",
        className,
      )}
    >
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-2 md:px-8">
        <Select
          aria-label="Jump to section"
          density="xs"
          selectedKey={active}
          onSelectionChange={(k) => k && jumpTo(String(k))}
          className="w-56 shrink-0 sm:w-64"
        >
          {TOKEN_SECTIONS.map((s) => (
            <SelectItem key={s.id} id={s.id} icon={s.icon} textValue={s.label}>
              {s.label}
            </SelectItem>
          ))}
        </Select>
        <Button variant="text" className="ml-auto" icon={<Icon name="grid_view" />} onPress={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="hidden sm:inline">All sections</span>
          <span className="sm:hidden">All</span>
        </Button>
      </div>
    </div>
  )
}
