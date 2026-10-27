import * as React from "react"

import { Icon } from "@/components/ui/icon"
import { cn, tv } from "@/lib/utils"

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width / height, e.g. 16 / 9. */
  ratio?: number
}

/** Fixed-ratio frame. Images and videos inside are cropped to fill it. */
function AspectRatio({ ratio = 1, className, style, ...props }: AspectRatioProps) {
  return (
    <div
      data-slot="aspect-ratio"
      className={cn("relative w-full overflow-hidden [&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>video]:object-cover", className)}
      style={{ aspectRatio: ratio, ...style }}
      {...props}
    />
  )
}

/* M3 media placeholder: an icon on a container role, with an optional ratio / duration label. */
const mediaPlaceholderVariants = tv({
  base: "relative grid size-full place-items-center [--icon-size:40px]",
  variants: {
    color: {
      primary: "bg-primary-container text-on-primary-container",
      secondary: "bg-secondary-container text-on-secondary-container",
      tertiary: "bg-tertiary-container text-on-tertiary-container",
      neutral: "bg-surface-container-highest text-on-surface-variant",
      error: "bg-error-container text-on-error-container",
    },
  },
  defaultVariants: { color: "primary" },
})

export interface MediaPlaceholderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  icon?: string
  color?: "primary" | "secondary" | "tertiary" | "neutral" | "error"
  /** Corner tag, e.g. "16 : 9" or "12:04". */
  label?: React.ReactNode
}

function MediaPlaceholder({ icon = "image", color, label, className, children, ...props }: MediaPlaceholderProps) {
  return (
    <div data-slot="media-placeholder" className={mediaPlaceholderVariants({ color, className })} {...props}>
      <Icon>{icon}</Icon>
      {label && <MediaLabel>{label}</MediaLabel>}
      {children}
    </div>
  )
}

/** Small tag pinned over media (bottom-end by default). */
function MediaLabel({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="media-label"
      className={cn("absolute right-2 bottom-2 rounded-xs bg-surface/80 px-2 py-0.5 font-mono text-label-sm text-on-surface backdrop-blur", className)}
      {...props}
    />
  )
}

export { AspectRatio, MediaLabel, MediaPlaceholder, mediaPlaceholderVariants }
