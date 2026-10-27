"use client"

import * as React from "react"
import {
  Collection,
  Header,
  Keyboard,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  MenuTrigger,
  Popover as AriaPopover,
  Separator,
  SubmenuTrigger,
  Text,
  composeRenderProps,
  type MenuItemProps as AriaMenuItemProps,
  type MenuProps as AriaMenuProps,
  type MenuSectionProps as AriaMenuSectionProps,
  type PopoverProps as AriaPopoverProps,
} from "react-aria-components"
import type { VariantProps } from "tailwind-variants"

import { Icon } from "@/components/ui/icon"
import { cn, tv } from "@/lib/utils"

/*
 * Menus · M3 Expressive (androidx MenuDefaults / SegmentedMenuTokens / StandardMenuTokens / VibrantMenuTokens)
 *   container   surface-container-low (vibrant: tertiary-container) · elevation 2 · 16dp corners
 *   groups      a MenuSection becomes its own segment: 16dp outer corners, 8dp inner, 2dp gap, 4dp padding
 *   items       44dp · 12dp side padding · 4dp corners (12dp on a group's first/last item) · body-large
 *               leading/trailing icons 20dp · shortcut label-small
 *   selected    tertiary-container / on-tertiary-container, 12dp corners (vibrant: tertiary / on-tertiary)
 *   motion      grows from the anchor on the FastSpatial spring, fades out on FastEffects
 *
 * <MenuTrigger>
 *   <Button>Edit</Button>
 *   <MenuPopover>
 *     <Menu>
 *       <MenuItem icon="content_cut" shortcut="⌘X">Cut</MenuItem>
 *       <SubmenuTrigger>
 *         <MenuItem icon="share">Share</MenuItem>
 *         <MenuPopover><Menu>…</Menu></MenuPopover>
 *       </SubmenuTrigger>
 *     </Menu>
 *   </MenuPopover>
 * </MenuTrigger>
 */

const menuVariants = tv({
  slots: {
    // A menu without sections is one card; with sections, each section is a card and the menu is a stack.
    menu: [
      "flex max-h-[inherit] min-w-28 flex-col gap-0.5 overflow-auto outline-none",
      "[&:not(:has(>[data-slot=menu-section]))]:rounded-lg [&:not(:has(>[data-slot=menu-section]))]:p-1",
    ],
    section: "flex flex-col rounded-sm p-1 first:rounded-t-lg last:rounded-b-lg",
    header: "px-3 pt-2 pb-1 text-label-md",
    item: [
      "group/item relative flex min-h-11 cursor-default items-center gap-3 rounded-xs px-3 py-2 text-body-lg outline-none select-none",
      "state-layer shape-morph",
      "first:rounded-t-md last:rounded-b-md [header+&]:rounded-t-md",
      "data-selected:rounded-md",
      "data-focus-visible:outline-2 data-focus-visible:-outline-offset-2 data-focus-visible:outline-secondary",
      "data-disabled:cursor-default",
      "[--icon-size:20px]",
    ],
    leading: "flex shrink-0 items-center",
    label: "min-w-0 flex-1 truncate",
    description: "block text-body-md",
    shortcut: "shrink-0 font-sans text-label-sm",
    trailing: "shrink-0",
    separator: "mx-3 my-1 border-t border-outline-variant",
  },
  variants: {
    variant: {
      standard: {
        menu: "[&:not(:has(>[data-slot=menu-section]))]:bg-surface-container-low",
        section: "bg-surface-container-low",
        header: "text-on-surface-variant",
        item: "text-on-surface data-selected:bg-tertiary-container data-selected:text-on-tertiary-container data-disabled:text-on-surface/38",
        leading: "text-on-surface-variant group-data-selected/item:text-on-tertiary-container group-data-disabled/item:text-on-surface/38",
        description: "text-on-surface-variant group-data-selected/item:text-on-tertiary-container group-data-disabled/item:text-on-surface/38",
        shortcut: "text-on-surface-variant group-data-selected/item:text-on-tertiary-container group-data-disabled/item:text-on-surface/38",
        trailing: "text-on-surface-variant group-data-selected/item:text-on-tertiary-container group-data-disabled/item:text-on-surface/38",
      },
      vibrant: {
        menu: "[&:not(:has(>[data-slot=menu-section]))]:bg-tertiary-container",
        section: "bg-tertiary-container",
        header: "text-on-tertiary-container",
        item: "text-on-tertiary-container data-selected:bg-tertiary data-selected:text-on-tertiary data-disabled:text-on-tertiary-container/38",
        leading: "text-on-tertiary-container group-data-hovered/item:text-tertiary group-data-selected/item:text-on-tertiary",
        description: "text-on-tertiary-container group-data-selected/item:text-on-tertiary",
        shortcut: "text-on-tertiary-container group-data-selected/item:text-on-tertiary",
        trailing: "text-on-tertiary-container group-data-selected/item:text-on-tertiary",
      },
    },
  },
  defaultVariants: { variant: "standard" },
})

type MenuVariant = NonNullable<VariantProps<typeof menuVariants>["variant"]>

const MenuVariantContext = React.createContext<MenuVariant>("standard")

/** Popover surface for menus, selects and comboboxes. Transparent itself: the menu or its sections are the cards. */
const menuPopoverStyles = cn(
  "drop-elevation-2 max-w-[min(320px,calc(100vw-2rem))] origin-(--trigger-anchor-point) outline-none",
  "data-entering:m3-menu-enter data-exiting:m3-overlay-exit",
)

export interface MenuPopoverProps extends Omit<AriaPopoverProps, "className"> {
  className?: string
}

function MenuPopover({ className, placement, offset = 4, ...props }: MenuPopoverProps) {
  return (
    <AriaPopover
      data-slot="menu-popover"
      placement={placement}
      offset={offset}
      {...props}
      className={({ trigger }) =>
        cn(menuPopoverStyles, trigger === "SubmenuTrigger" && "origin-top-left", className)
      }
    />
  )
}

export interface MenuProps<T> extends AriaMenuProps<T> {
  /** standard (surface-container-low) or vibrant (tertiary-container). */
  variant?: MenuVariant
}

function Menu<T extends object>({ className, variant = "standard", ...props }: MenuProps<T>) {
  return (
    <MenuVariantContext.Provider value={variant}>
      <AriaMenu
        data-slot="menu"
        {...props}
        className={composeRenderProps(className, (className) => menuVariants({ variant }).menu({ className }))}
      />
    </MenuVariantContext.Provider>
  )
}

export interface MenuItemProps<T> extends Omit<AriaMenuItemProps<T>, "children"> {
  children?: React.ReactNode
  /** Leading Material Symbol name. */
  icon?: string
  /** Leading slot for anything else (avatar, color swatch). Wins over `icon`. */
  leading?: React.ReactNode
  /** Second line of supporting text. */
  description?: React.ReactNode
  /** Keyboard shortcut shown at the end, e.g. "⌘X". */
  shortcut?: string
  /** Trailing slot (badge, count). */
  trailing?: React.ReactNode
}

function MenuItem<T extends object>({
  className,
  children,
  icon,
  leading,
  description,
  shortcut,
  trailing,
  textValue,
  ...props
}: MenuItemProps<T>) {
  const variant = React.useContext(MenuVariantContext)
  const s = menuVariants({ variant })
  return (
    <AriaMenuItem
      data-slot="menu-item"
      textValue={textValue ?? (typeof children === "string" ? children : undefined)}
      {...props}
      className={composeRenderProps(className, (className) => s.item({ className }))}
    >
      {({ hasSubmenu, isSelected, selectionMode }) => (
        <>
          {(leading || icon) && <span className={s.leading()}>{leading ?? <Icon>{icon!}</Icon>}</span>}
          <span className={s.label()}>
            {description ? (
              <>
                <Text slot="label" className="block truncate">
                  {children}
                </Text>
                <Text slot="description" className={s.description()}>
                  {description}
                </Text>
              </>
            ) : (
              children
            )}
          </span>
          {trailing && <span className={s.trailing()}>{trailing}</span>}
          {shortcut && <Keyboard className={s.shortcut()}>{shortcut}</Keyboard>}
          {selectionMode !== "none" && isSelected && (
            <span className={s.trailing()}>
              <Icon>check</Icon>
            </span>
          )}
          {hasSubmenu && (
            <span className={s.trailing()}>
              <Icon>arrow_right</Icon>
            </span>
          )}
        </>
      )}
    </AriaMenuItem>
  )
}

export interface MenuSectionProps<T> extends AriaMenuSectionProps<T> {
  /** Optional group label. */
  title?: React.ReactNode
}

/** A segment of an Expressive menu: its own rounded card, separated from siblings by a 2dp gap. */
function MenuSection<T extends object>({ className, title, children, items, ...props }: MenuSectionProps<T>) {
  const variant = React.useContext(MenuVariantContext)
  const s = menuVariants({ variant })
  return (
    <AriaMenuSection data-slot="menu-section" {...props} className={s.section({ className })}>
      {title && <Header className={s.header()}>{title}</Header>}
      <Collection items={items}>{children}</Collection>
    </AriaMenuSection>
  )
}

function MenuHeader({ className, ...props }: React.ComponentProps<typeof Header>) {
  const variant = React.useContext(MenuVariantContext)
  return <Header data-slot="menu-header" {...props} className={menuVariants({ variant }).header({ className })} />
}

function MenuSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return <Separator data-slot="menu-separator" {...props} className={menuVariants().separator({ className })} />
}

export { Menu, MenuHeader, MenuItem, MenuPopover, MenuSection, MenuSeparator, MenuTrigger, SubmenuTrigger, menuPopoverStyles, menuVariants }
