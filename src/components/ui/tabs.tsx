"use client"

import * as React from "react"
import {
  SelectionIndicator,
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  composeRenderProps,
  type TabListProps as AriaTabListProps,
  type TabPanelProps as AriaTabPanelProps,
  type TabProps as AriaTabProps,
  type TabsProps as AriaTabsProps,
} from "react-aria-components"

import { Badge, BadgeAnchor } from "@/components/ui/badge"
import { Icon } from "@/components/ui/icon"
import { composeTailwindRenderProps, tv } from "@/lib/utils"

/*
 * Tabs · M3 (androidx PrimaryNavigationTabTokens, SecondaryNavigationTabTokens)
 *   primary    48dp (64dp with a stacked icon) · title-small · active primary, inactive on-surface-variant
 *              indicator 3dp, 3dp top corners, as wide as the tab content
 *   secondary  48dp · title-small · active on-surface · indicator 2dp, full tab width
 *   divider    1dp under the row
 *   pill       segmented-pill tabs from the kit (not an M3 spec component)
 * The indicator slides between tabs on the FastSpatial spring (React Aria SelectionIndicator).
 */

type Variant = "primary" | "secondary" | "pill"

const TabsVariantContext = React.createContext<{ variant: Variant; scrollable: boolean }>({ variant: "primary", scrollable: false })

function Tabs({ className, ...props }: AriaTabsProps) {
  return (
    <AriaTabs
      data-slot="tabs"
      {...props}
      className={composeTailwindRenderProps(className, "flex flex-col data-[orientation=vertical]:flex-row")}
    />
  )
}

const tabListVariants = tv({
  base: "group/tablist relative flex shrink-0 data-[orientation=vertical]:flex-col",
  variants: {
    variant: {
      primary: "border-b border-outline-variant data-[orientation=vertical]:border-e data-[orientation=vertical]:border-b-0",
      secondary: "border-b border-outline-variant data-[orientation=vertical]:border-e data-[orientation=vertical]:border-b-0",
      pill: "w-fit gap-1 rounded-full bg-surface-container p-1",
    },
    scrollable: {
      true: "no-scrollbar overflow-x-auto data-[orientation=vertical]:overflow-x-visible data-[orientation=vertical]:overflow-y-auto",
      false: "",
    },
  },
  defaultVariants: { variant: "primary", scrollable: false },
})

export interface TabListProps<T> extends AriaTabListProps<T> {
  variant?: Variant
  /** Let tabs keep their natural width and scroll horizontally when they overflow. */
  scrollable?: boolean
}

function TabList<T extends object>({ variant = "primary", scrollable = false, className, ...props }: TabListProps<T>) {
  const ctx = React.useMemo(() => ({ variant, scrollable }), [variant, scrollable])
  return (
    <TabsVariantContext.Provider value={ctx}>
      <AriaTabList
        data-slot="tab-list"
        {...props}
        className={composeRenderProps(className, (className) => tabListVariants({ variant, scrollable, className }))}
      />
    </TabsVariantContext.Provider>
  )
}

const tabVariants = tv({
  slots: {
    root: [
      "group state-layer focus-ring relative flex cursor-pointer items-center justify-center text-title-sm outline-none select-none",
      "data-disabled:cursor-default data-disabled:opacity-38",
    ],
    content: "relative flex items-center justify-center",
    indicator: "pointer-events-none absolute transition-[translate,width,height] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial motion-reduce:transition-none",
  },
  variants: {
    variant: {
      primary: {
        root: [
          "min-h-12 px-4 text-on-surface-variant data-hovered:text-on-surface data-selected:text-primary",
          "group-data-[orientation=vertical]/tablist:justify-start",
        ],
        content: "h-full gap-0.5 self-stretch",
        indicator: [
          "bottom-0 left-0 h-[3px] w-full rounded-t-[3px] bg-primary",
          "group-data-[orientation=vertical]/tablist:hidden",
        ],
      },
      secondary: {
        root: [
          "h-12 px-4 text-on-surface-variant data-hovered:text-on-surface data-selected:text-on-surface",
          "group-data-[orientation=vertical]/tablist:justify-start",
        ],
        content: "gap-2",
        indicator: [
          "bottom-0 left-0 h-0.5 w-full bg-primary",
          "group-data-[orientation=vertical]/tablist:top-0 group-data-[orientation=vertical]/tablist:end-0 group-data-[orientation=vertical]/tablist:left-auto group-data-[orientation=vertical]/tablist:h-full group-data-[orientation=vertical]/tablist:w-0.5",
        ],
      },
      pill: {
        root: "isolate h-10 rounded-full px-4 text-label-lg text-on-surface-variant data-selected:text-on-secondary-container",
        content: "gap-2",
        indicator: "inset-0 -z-10 rounded-full bg-secondary-container",
      },
    },
    stacked: {
      true: { root: "min-h-16", content: "flex-col" },
      false: { content: "flex-row gap-2" },
    },
    fill: {
      true: { root: "flex-1 group-data-[orientation=vertical]/tablist:flex-none" },
      false: { root: "flex-none" },
    },
  },
  compoundVariants: [
    // primary vertical: indicator becomes a 3dp bar on the end edge of the tab
    { variant: "primary", class: { root: "group-data-[orientation=vertical]/tablist:min-h-14" } },
    { variant: "primary", fill: false, class: { root: "min-w-[90px]" } },
  ],
  defaultVariants: { variant: "primary", stacked: false, fill: true },
})

export interface TabProps extends Omit<AriaTabProps, "children"> {
  /** Material Symbols name. Stacked above the label on primary tabs, inline otherwise. */
  icon?: string
  /** Put the icon beside the label on primary tabs. */
  inlineIcon?: boolean
  /** Count, short text, or `true` for a dot. */
  badge?: number | string | boolean
  badgeLabel?: string
  children?: React.ReactNode
}

function Tab({ icon, inlineIcon, badge, badgeLabel, className, children, ...props }: TabProps) {
  const { variant, scrollable } = React.useContext(TabsVariantContext)
  const stacked = variant === "primary" && !!icon && !inlineIcon && !!children
  const s = tabVariants({ variant, stacked, fill: !scrollable && variant !== "pill" })
  const count = typeof badge === "boolean" ? undefined : badge
  const glyph = icon && (
    <Icon className="transition-[--icon-fill] duration-(--md-spring-default-effects-duration) group-data-selected:[--icon-fill:1]">{icon}</Icon>
  )
  return (
    <AriaTab
      data-slot="tab"
      {...props}
      className={composeRenderProps(className, (className) => s.root({ className }))}
    >
      <span className={s.content()}>
        {glyph && badge !== undefined && badge !== false && (stacked || !children) ? (
          <BadgeAnchor count={count} dot={badge === true} badgeLabel={badgeLabel}>
            {glyph}
          </BadgeAnchor>
        ) : (
          glyph
        )}
        {children && <span className="truncate">{children}</span>}
        {children && !stacked && badge !== undefined && badge !== false && (
          <Badge count={count} aria-label={badgeLabel} />
        )}
        {variant === "primary" && <SelectionIndicator className={s.indicator()} />}
      </span>
      {variant !== "primary" && <SelectionIndicator className={s.indicator()} />}
      {variant === "primary" && <span aria-hidden className="pointer-events-none absolute inset-y-0 end-0 hidden w-[3px] rounded-s-[3px] bg-primary opacity-0 group-data-selected:opacity-100 group-data-[orientation=vertical]/tablist:block" />}
    </AriaTab>
  )
}

function TabPanel({ className, ...props }: AriaTabPanelProps) {
  return (
    <AriaTabPanel
      data-slot="tab-panel"
      {...props}
      className={composeTailwindRenderProps(className, "min-w-0 flex-1 outline-none data-focus-visible:outline-3 data-focus-visible:outline-secondary")}
    />
  )
}

export { Tab, TabList, TabPanel, Tabs, tabListVariants, tabVariants }

