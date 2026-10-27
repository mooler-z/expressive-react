"use client"

import * as React from "react"
import {
  Button as AriaButton,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Heading,
  type DisclosureGroupProps,
  type DisclosureProps,
} from "react-aria-components"
import type { VariantProps } from "tailwind-variants"

import { Icon } from "@/components/ui/icon"
import { cn, tv } from "@/lib/utils"

/*
 * Accordion & collapsible
 * React Aria Disclosure/DisclosureGroup (keyboard, aria-expanded, find-in-page reveals closed panels).
 * Panels animate their height on the DefaultSpatial spring; the indicator turns on FastSpatial.
 * Variants follow the kit: tonal (open panels gain a container tone) · flush · outlined ·
 * list (leading icon + meta) · expressive (pill → primary-container, + turns into ×) · numbered.
 */

const accordionVariants = tv({
  slots: {
    root: "",
    item: "group/disclosure relative",
    trigger: [
      "focus-ring relative flex w-full cursor-pointer items-center text-start outline-none",
      "data-disabled:cursor-default data-disabled:text-on-surface/38",
    ],
    number:
      "grid size-7 shrink-0 place-items-center rounded-full bg-secondary-container text-label-md text-on-secondary-container shape-morph group-data-expanded/disclosure:bg-primary group-data-expanded/disclosure:text-on-primary",
    panel: [
      "h-(--disclosure-panel-height) overflow-clip",
      "transition-[height] duration-(--md-spring-default-spatial-duration) ease-default-spatial motion-reduce:transition-none",
    ],
    panelInner: "",
  },
  variants: {
    variant: {
      tonal: {
        root: "space-y-2",
        item: "rounded-lg bg-surface shape-morph data-expanded:bg-surface-container-high",
        trigger: "state-layer min-h-14 gap-4 rounded-[inherit] px-5 py-3 text-title-md text-on-surface",
        panelInner: "px-5 pb-5 text-body-md text-on-surface-variant",
      },
      flush: {
        root: "divide-y divide-outline-variant rounded-lg bg-surface px-4",
        trigger: "min-h-12 gap-3 py-2 text-title-sm text-on-surface [--icon-size:20px] data-hovered:text-primary",
        panelInner: "pb-3 text-body-sm text-on-surface-variant",
      },
      outlined: {
        root: "space-y-2",
        item: "rounded-lg border border-outline-variant bg-surface shape-morph data-expanded:border-primary",
        trigger: "state-layer min-h-12 gap-3 rounded-[inherit] px-4 py-2 text-title-sm text-on-surface [--icon-size:20px]",
        panelInner: "px-4 pb-3 text-body-sm text-on-surface-variant",
      },
      list: {
        root: "space-y-1 rounded-lg bg-surface p-1",
        item: "rounded-md shape-morph data-expanded:bg-surface-container",
        trigger: "state-layer h-12 gap-3 rounded-[inherit] px-3 text-label-lg text-on-surface [--icon-size:20px]",
        panelInner: "px-3 pb-3 pl-11 text-body-sm text-on-surface-variant",
      },
      expressive: {
        root: "space-y-1.5",
        item: [
          "rounded-[28px] bg-surface-container-high text-on-surface shape-morph",
          "data-expanded:rounded-[20px] data-expanded:bg-primary-container data-expanded:text-on-primary-container",
        ],
        trigger: "state-layer min-h-14 gap-3 rounded-[inherit] px-5 py-2 text-title-sm",
        panelInner: "px-5 pb-4 text-body-sm",
      },
      numbered: {
        root: "space-y-2",
        item: "rounded-lg bg-surface",
        trigger: "state-layer min-h-12 gap-3 rounded-[inherit] px-3 py-2 text-title-sm text-on-surface [--icon-size:20px]",
        panelInner: "px-3 pb-3 pl-13 text-body-sm text-on-surface-variant",
      },
    },
  },
  defaultVariants: { variant: "tonal" },
})

type AccordionVariant = NonNullable<VariantProps<typeof accordionVariants>["variant"]>

export type DisclosureIndicator = "chevron" | "chevron-right" | "plus" | "unfold" | "none"

const DEFAULT_INDICATOR: Record<AccordionVariant, DisclosureIndicator> = {
  tonal: "chevron",
  flush: "chevron",
  outlined: "chevron",
  list: "chevron",
  expressive: "plus",
  numbered: "chevron",
}

/** The open/closed glyph. Turns with the FastSpatial spring. */
function DisclosureIndicatorIcon({ kind, className }: { kind: DisclosureIndicator; className?: string }) {
  if (kind === "none") return null
  const turn = "transition-transform duration-(--md-spring-fast-spatial-duration) ease-fast-spatial"
  if (kind === "plus")
    return (
      <span
        aria-hidden
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-full bg-surface text-on-surface shape-morph [--icon-size:20px]",
          "group-data-expanded/disclosure:bg-primary group-data-expanded/disclosure:text-on-primary",
          className,
        )}
      >
        <Icon className={cn(turn, "group-data-expanded/disclosure:rotate-45")}>add</Icon>
      </span>
    )
  const glyph = { chevron: "expand_more", "chevron-right": "chevron_right", unfold: "unfold_more" }[kind]
  return (
    <Icon
      className={cn(
        "shrink-0 text-on-surface-variant",
        turn,
        kind === "chevron-right" ? "text-current group-data-expanded/disclosure:rotate-90 rtl:-scale-x-100" : "group-data-expanded/disclosure:rotate-180",
        className,
      )}
    >
      {glyph}
    </Icon>
  )
}

const AccordionContext = React.createContext<{ variant: AccordionVariant; headingLevel: 2 | 3 | 4 | 5 | 6 }>({
  variant: "tonal",
  headingLevel: 3,
})

export interface AccordionProps extends Omit<DisclosureGroupProps, "className">, VariantProps<typeof accordionVariants> {
  className?: string
  /** Heading level wrapping each trigger. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
}

/** Group of disclosures. One open at a time unless `allowsMultipleExpanded`. */
function Accordion({ className, variant = "tonal", headingLevel = 3, ...props }: AccordionProps) {
  const { root } = accordionVariants({ variant })
  return (
    <AccordionContext.Provider value={{ variant: variant ?? "tonal", headingLevel }}>
      <DisclosureGroup data-slot="accordion" className={root({ className })} {...props} />
    </AccordionContext.Provider>
  )
}

export interface AccordionItemProps extends Omit<DisclosureProps, "children" | "className"> {
  className?: string
  /** Trigger label. */
  title: React.ReactNode
  /** Leading slot (icon, avatar). In the `list` variant an icon string renders a primary icon. */
  leading?: React.ReactNode
  /** Trailing meta before the indicator, e.g. a count. */
  trailing?: React.ReactNode
  /** Numbered badge (the `numbered` variant). */
  number?: React.ReactNode
  indicator?: DisclosureIndicator
  triggerClassName?: string
  panelClassName?: string
  children?: React.ReactNode
}

function AccordionItem({
  className,
  title,
  leading,
  trailing,
  number,
  indicator,
  triggerClassName,
  panelClassName,
  children,
  ...props
}: AccordionItemProps) {
  const { variant, headingLevel } = React.useContext(AccordionContext)
  const s = accordionVariants({ variant })
  return (
    <Disclosure data-slot="accordion-item" className={s.item({ className })} {...props}>
      <Heading level={headingLevel} className="m-0 rounded-[inherit]">
        <AriaButton slot="trigger" className={s.trigger({ className: triggerClassName })}>
          {number != null && <span className={s.number()}>{number}</span>}
          {typeof leading === "string" ? <Icon className="text-primary">{leading}</Icon> : leading}
          <span className="min-w-0 flex-1">{title}</span>
          {trailing != null && <span className="text-label-md text-on-surface-variant group-data-expanded/disclosure:text-current">{trailing}</span>}
          <DisclosureIndicatorIcon kind={indicator ?? DEFAULT_INDICATOR[variant]} />
        </AriaButton>
      </Heading>
      <DisclosurePanel className={s.panel()}>
        <div className={s.panelInner({ className: panelClassName })}>{children}</div>
      </DisclosurePanel>
    </Disclosure>
  )
}

const collapsibleVariants = tv({
  slots: {
    root: "group/disclosure relative rounded-lg",
    trigger: [
      "state-layer focus-ring relative flex h-12 w-full cursor-pointer items-center gap-2 rounded-[inherit] px-4 text-start text-label-lg outline-none [--icon-size:20px]",
      "data-disabled:cursor-default data-disabled:text-on-surface/38",
    ],
    panel: [
      "h-(--disclosure-panel-height) overflow-clip",
      "transition-[height] duration-(--md-spring-default-spatial-duration) ease-default-spatial motion-reduce:transition-none",
    ],
  },
  variants: {
    variant: {
      outlined: {
        root: "border border-outline-variant bg-surface",
        trigger: "justify-between text-on-surface",
        panel: "border-outline-variant group-data-expanded/disclosure:border-t",
      },
      tonal: {
        root: "bg-surface-container",
        trigger: "text-primary",
      },
      plain: {
        trigger: "text-on-surface",
      },
    },
  },
  defaultVariants: { variant: "outlined" },
})

export interface CollapsibleProps extends Omit<DisclosureProps, "children" | "className">, VariantProps<typeof collapsibleVariants> {
  className?: string
  title: React.ReactNode
  /** Defaults: outlined → unfold (trailing), tonal/plain → chevron-right (leading). */
  indicator?: DisclosureIndicator
  headingLevel?: 2 | 3 | 4 | 5 | 6
  triggerClassName?: string
  panelClassName?: string
  children?: React.ReactNode
}

/** A single show/hide region. */
function Collapsible({
  className,
  variant = "outlined",
  title,
  indicator,
  headingLevel = 3,
  triggerClassName,
  panelClassName,
  children,
  ...props
}: CollapsibleProps) {
  const s = collapsibleVariants({ variant })
  const kind = indicator ?? (variant === "outlined" ? "unfold" : "chevron-right")
  const leadingIndicator = kind === "chevron-right"
  return (
    <Disclosure data-slot="collapsible" className={s.root({ className })} {...props}>
      <Heading level={headingLevel} className="m-0 rounded-[inherit]">
        <AriaButton slot="trigger" className={s.trigger({ className: triggerClassName })}>
          {leadingIndicator && <DisclosureIndicatorIcon kind={kind} />}
          <span className={cn("min-w-0", !leadingIndicator && "flex-1")}>{title}</span>
          {!leadingIndicator && <DisclosureIndicatorIcon kind={kind} />}
        </AriaButton>
      </Heading>
      <DisclosurePanel className={s.panel({ className: panelClassName })}>{children}</DisclosurePanel>
    </Disclosure>
  )
}

export { Accordion, AccordionItem, Collapsible, DisclosureIndicatorIcon, accordionVariants, collapsibleVariants }
