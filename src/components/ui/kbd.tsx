import * as React from "react"
import type { VariantProps } from "tailwind-variants"

import { cn, tv } from "@/lib/utils"

/* Keyboard key · Roboto Mono, 1dp bottom edge (outlined) or a tonal key cap. */
const kbdVariants = tv({
  base: "inline-flex shrink-0 items-center justify-center font-mono text-on-surface",
  variants: {
    variant: {
      outlined: "border border-b-2 border-outline-variant bg-surface-container-lowest",
      tonal: "bg-surface-container-highest",
    },
    size: {
      sm: "h-5 min-w-5 rounded-xs px-1 text-label-sm",
      md: "h-6 min-w-6 rounded-xs px-1.5 text-label-md",
      lg: "h-8 min-w-8 rounded-sm px-2 text-label-lg",
    },
  },
  defaultVariants: { variant: "outlined", size: "md" },
})

export interface KbdProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof kbdVariants> {}

function Kbd({ className, variant, size, ...props }: KbdProps) {
  return <kbd data-slot="kbd" className={kbdVariants({ variant, size, className })} {...props} />
}

export interface KbdGroupProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof kbdVariants> {
  /** Keys pressed together, e.g. ["⌘", "K"]. */
  keys: string[]
  /** Text between keys, e.g. "then" for sequences. Omitted for chords. */
  separator?: React.ReactNode
}

/** A shortcut: ⌘ K, or a sequence like G then D. */
function KbdGroup({ keys, separator, variant, size, className, ...props }: KbdGroupProps) {
  return (
    <span data-slot="kbd-group" className={cn("inline-flex items-center gap-1", className)} {...props}>
      {keys.map((k, i) => (
        <React.Fragment key={i}>
          {i > 0 && separator && <span className="px-0.5 text-body-sm text-on-surface-variant">{separator}</span>}
          <Kbd variant={variant} size={size}>
            {k}
          </Kbd>
        </React.Fragment>
      ))}
    </span>
  )
}

export { Kbd, KbdGroup, kbdVariants }
