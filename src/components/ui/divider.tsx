"use client"

import * as React from "react"
import { Separator, type SeparatorProps } from "react-aria-components"
import type { VariantProps } from "tailwind-variants"

import { cn, tv } from "@/lib/utils"

/*
 * Divider · M3 (androidx DividerTokens): 1dp outline-variant.
 * Full-width, inset (16dp start, aligned with list text) and middle-inset (16dp both sides), plus vertical.
 */
const dividerVariants = tv({
  base: "shrink-0 border-0 bg-outline-variant",
  variants: {
    orientation: {
      horizontal: "h-px w-auto",
      vertical: "w-px self-stretch",
    },
    inset: {
      none: "",
      start: "",
      middle: "",
    },
  },
  compoundVariants: [
    { orientation: "horizontal", inset: "start", class: "ms-4" },
    { orientation: "horizontal", inset: "middle", class: "mx-4" },
    { orientation: "vertical", inset: "middle", class: "my-2" },
  ],
  defaultVariants: { orientation: "horizontal", inset: "none" },
})

export interface DividerProps extends Omit<SeparatorProps, "orientation">, VariantProps<typeof dividerVariants> {
  /** A label centered in the line ("or"). Horizontal only. */
  children?: React.ReactNode
}

function Divider({ className, orientation = "horizontal", inset, children, ...props }: DividerProps) {
  if (children && orientation === "horizontal") {
    return (
      <div
        role="separator"
        data-slot="divider"
        className={cn("flex items-center gap-3 text-label-md text-on-surface-variant", className)}
      >
        <span aria-hidden className="h-px flex-1 bg-outline-variant" />
        {children}
        <span aria-hidden className="h-px flex-1 bg-outline-variant" />
      </div>
    )
  }
  return (
    <Separator
      data-slot="divider"
      orientation={orientation ?? "horizontal"}
      {...props}
      className={dividerVariants({ orientation, inset, className })}
    />
  )
}

export { Divider, dividerVariants }
