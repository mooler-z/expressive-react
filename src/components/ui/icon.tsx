import * as React from "react"

import { cn } from "@/lib/utils"

export type IconProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & IconOptions &
  (
    | { /** Material Symbols ligature, e.g. "add", "settings". */ name: string; children?: never }
    | { name?: never; /** Material Symbols ligature, e.g. "add", "settings". */ children: string }
  )

interface IconOptions {
  /** Pixel size. Defaults to the parent's `--icon-size`, else 24. */
  size?: number
  /** Filled glyph (FILL 1). Animates when toggled inside a transition. */
  filled?: boolean
  /** Font weight axis, 100–700. */
  weight?: number
}

/**
 * Material Symbols Rounded glyph. Requires the font:
 * https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200
 */
function Icon({ name, children, size, filled, weight, className, style, ...props }: IconProps) {
  return (
    <span
      aria-hidden
      data-slot="icon"
      className={cn("md-icon", className)}
      style={{
        ...(size && { fontSize: size, "--icon-opsz": Math.min(48, Math.max(20, size)) }),
        ...(filled && { "--icon-fill": 1 }),
        ...(weight && { "--icon-wght": weight }),
        ...style,
      } as React.CSSProperties}
      {...props}
    >
      {name ?? children}
    </span>
  )
}

export { Icon }
