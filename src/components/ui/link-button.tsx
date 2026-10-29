"use client"

import type { ReactNode, Ref } from "react"
import { Link as AriaLink, composeRenderProps, type LinkProps as AriaLinkProps } from "react-aria-components"
import type { VariantProps } from "tailwind-variants"

import { buttonVariants } from "@/components/ui/button"
import { Ripple } from "@/components/ui/ripple"

/*
 * Link button · a navigation link that looks exactly like a common button
 * Same recipe as <Button> (buttonVariants): five color styles × five sizes (XS 32 · S 40 · M 56 · L 96 · XL 136),
 * round or square, the pressed corner morph (8 / 8 / 12 / 16 / 16) on the FastSpatial spring, state layer and ripple.
 * Renders React Aria's <Link>, a real <a href>: middle-click, "open in new tab" and the status-bar URL keep working,
 * and client-side routing goes through RAC's RouterProvider like every other link in the library.
 * Use it for navigation that should read as an action ("← Sessions", "View all", "Open in …"); use <Button> for actions.
 */

export interface LinkButtonProps extends AriaLinkProps, Omit<VariantProps<typeof buttonVariants>, "toggle"> {
  /** Leading icon, e.g. `<Icon name="arrow_back" />`. */
  icon?: ReactNode
  /** Trailing icon, e.g. `<Icon name="open_in_new" />`. */
  trailingIcon?: ReactNode
  ref?: Ref<HTMLAnchorElement>
}

function LinkButton({ className, variant, size, shape, color, icon, trailingIcon, children, ...props }: LinkButtonProps) {
  return (
    <AriaLink
      data-slot="link-button"
      {...props}
      className={composeRenderProps(className, (className) => buttonVariants({ variant, size, shape, color, className }))}
    >
      {composeRenderProps(children, (children) => (
        <>
          {icon}
          {children}
          {trailingIcon}
          <Ripple />
        </>
      ))}
    </AriaLink>
  )
}

export { LinkButton }
