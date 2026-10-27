"use client"

import * as React from "react"
import { Button as AriaButton, ToggleButton, ToggleButtonGroup } from "react-aria-components"

import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarItem,
  SidebarProvider,
  SidebarSubmenu,
} from "@/components/ui/sidebar"
import { snackbar } from "@/components/ui/snackbar"
import { TooltipTrigger, Tooltip } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

/*
 * Sidebar 03 · Title switcher + tree
 * A server-style column of titles (round → square when active) next to a per-title tree of
 * collapsible sections.
 */

type Leaf = { value: string; label?: string; icon?: string; badge?: number | string; tone?: "plain" | "error" }
type Title = {
  id: string
  initials: string
  subtitle: string
  box: string
  sections?: { title: string; defaultExpanded: boolean; items: Leaf[] }[]
  items?: Leaf[]
}

const TITLES: Title[] = [
  {
    id: "Ember Tactics",
    initials: "ET",
    subtitle: "PC · PS5 · Xbox Series",
    box: "bg-tertiary-container text-on-tertiary-container",
    sections: [
      {
        title: "Live ops",
        defaultExpanded: true,
        items: [
          { value: "Live events", badge: 8, tone: "plain" },
          { value: "Store & bundles" },
          { value: "Battle pass" },
        ],
      },
      {
        title: "Players",
        defaultExpanded: true,
        items: [{ value: "Directory" }, { value: "Moderation queue", badge: 12, tone: "error" }, { value: "Bans & appeals" }],
      },
      {
        title: "Game config",
        defaultExpanded: false,
        items: [{ value: "Remote config" }, { value: "Feature flags" }, { value: "Matchmaking playlists", label: "Playlists" }],
      },
    ],
  },
  {
    id: "Tidebreak",
    initials: "TB",
    subtitle: "iOS · Android",
    box: "bg-primary-container text-on-primary-container",
    sections: [
      {
        title: "Live ops",
        defaultExpanded: true,
        items: [{ value: "Events", badge: 2, tone: "plain" }, { value: "Offers & IAP" }, { value: "Push campaigns" }],
      },
      {
        title: "Release",
        defaultExpanded: true,
        items: [{ value: "Phased rollout", badge: "20%", tone: "plain" }, { value: "Store listings" }],
      },
    ],
  },
  {
    id: "Arena (beta)",
    initials: "AR",
    subtitle: "Closed playtest · 4,000 keys",
    box: "bg-secondary-container text-on-secondary-container",
    items: [
      { value: "Playtests", icon: "sports_esports" },
      { value: "Key distribution", icon: "key" },
      { value: "Feedback", icon: "forum", badge: 214, tone: "plain" },
    ],
  },
]

const FIRST_PAGE: Record<string, string> = { "Ember Tactics": "Live events", Tidebreak: "Events", "Arena (beta)": "Playtests" }

function leaf(l: Leaf) {
  return <SidebarItem key={l.value} value={l.value} icon={l.icon} label={l.label ?? l.value} badge={l.badge} badgeTone={l.tone} />
}

export function SidebarBlock3({ className }: { className?: string }) {
  const [titleId, setTitleId] = React.useState(TITLES[0].id)
  const [page, setPage] = React.useState(FIRST_PAGE[TITLES[0].id])
  const title = TITLES.find((t) => t.id === titleId)!

  return (
    <SidebarProvider mode="full">
      <div className={cn("flex h-full min-h-0 bg-surface", className)}>
        <div className="flex w-[72px] shrink-0 flex-col items-center gap-2 bg-surface-container py-3">
          <ToggleButtonGroup
            aria-label="Titles"
            orientation="vertical"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[titleId]}
            onSelectionChange={(keys) => {
              const id = String([...keys][0])
              setTitleId(id)
              setPage(FIRST_PAGE[id])
            }}
            className="flex flex-col gap-2"
          >
            {TITLES.map((t) => (
              <TooltipTrigger key={t.id} delay={300}>
                <ToggleButton
                  id={t.id}
                  aria-label={t.id}
                  className="group focus-ring relative grid size-12 cursor-pointer place-items-center rounded-lg"
                >
                  <span
                    aria-hidden
                    className="absolute -left-3 h-2 w-1 rounded-r-full bg-primary opacity-0 transition-all duration-300 group-data-hovered:opacity-100 group-data-selected:h-8 group-data-selected:opacity-100"
                  />
                  <span
                    className={cn(
                      "grid size-12 place-items-center rounded-full text-title-sm shape-morph group-data-hovered:rounded-lg group-data-selected:rounded-lg",
                      t.box,
                    )}
                  >
                    {t.initials}
                  </span>
                </ToggleButton>
                <Tooltip placement="end">{t.id}</Tooltip>
              </TooltipTrigger>
            ))}
          </ToggleButtonGroup>
          <span className="my-1 h-px w-8 bg-outline-variant" />
          <TooltipTrigger delay={300}>
            <AriaButton
              aria-label="Add title"
              onPress={() => snackbar("Connect a title from Steamworks, PlayStation or the App Store")}
              className="state-layer focus-ring grid size-12 cursor-pointer place-items-center rounded-full border border-dashed border-outline text-on-surface-variant shape-morph data-hovered:rounded-lg"
            >
              <Icon>add</Icon>
            </AriaButton>
            <Tooltip placement="end">Add title</Tooltip>
          </TooltipTrigger>
          <span className="flex-1" />
          <IconButton aria-label="Studio settings" size="md" onPress={() => snackbar("Studio settings")}>
            <Icon>settings</Icon>
          </IconButton>
          <span className="grid size-10 place-items-center rounded-full bg-secondary-container text-label-lg text-on-secondary-container" title="Maya Ortiz">
            MO
          </span>
        </div>

        <Sidebar
          key={title.id}
          value={page}
          onValueChange={setPage}
          aria-label={title.id}
          className="w-64 border-r border-outline-variant"
        >
          <SidebarHeader className="gap-0 px-4 pt-4 pb-2">
            <div className="text-title-md">{title.id}</div>
            <div className="text-body-sm text-on-surface-variant">{title.subtitle}</div>
          </SidebarHeader>
          <SidebarContent>
            {title.sections?.map((s) => (
              <SidebarSubmenu key={s.title} title={s.title} defaultExpanded={s.defaultExpanded}>
                {s.items.map(leaf)}
              </SidebarSubmenu>
            ))}
            {title.items?.map(leaf)}
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="hidden gap-3 p-6 md:flex">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-body-sm text-on-surface-variant">
            <span>{title.id}</span>
            <Icon size={16}>chevron_right</Icon>
            <span className="text-on-surface">{page}</span>
          </nav>
          <div className="grid gap-3 lg:grid-cols-3">
            <div className="h-24 rounded-lg bg-surface-container-low" />
            <div className="h-24 rounded-lg bg-surface-container-low" />
            <div className="h-24 rounded-lg bg-surface-container-low" />
          </div>
          <div className="flex-1 rounded-lg bg-surface-container-low" />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
