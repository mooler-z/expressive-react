import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * Skeleton · surface-container-highest blocks that mirror the final layout.
 * `pulse` (default) fades the block; `shimmer` sweeps a highlight across it.
 */

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: "pulse" | "shimmer" | "none"
  /** Stagger start (ms) for wave effects across rows. */
  delay?: number
}

const ANIMATION = {
  pulse: "animate-pulse",
  shimmer:
    "bg-[linear-gradient(90deg,var(--md-surface-container-highest)_30%,var(--md-surface-container)_50%,var(--md-surface-container-highest)_70%)] bg-size-[300%_100%] animate-[m3-shimmer_1.6s_linear_infinite]",
  none: "",
} as const

function Skeleton({ animation = "pulse", delay, className, style, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden
      data-slot="skeleton"
      className={cn("rounded-xs bg-surface-container-highest motion-reduce:animate-none", ANIMATION[animation], className)}
      style={delay ? { animationDelay: `${delay}ms`, ...style } : style}
      {...props}
    />
  )
}

export interface SkeletonTextProps extends Omit<SkeletonProps, "children"> {
  /** Number of lines. */
  lines?: number
  /** Width of the last line (any CSS width). */
  lastLineWidth?: string
  /** Tailwind height class per line. */
  lineClassName?: string
}

/** A paragraph of skeleton lines; the last one is shorter. */
function SkeletonText({ lines = 3, lastLineWidth = "60%", lineClassName, className, animation, delay, ...props }: SkeletonTextProps) {
  return (
    <div aria-hidden data-slot="skeleton-text" className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          animation={animation}
          delay={delay}
          className={cn("h-3 rounded-full", lineClassName)}
          style={{ width: i === lines - 1 && lines > 1 ? lastLineWidth : "100%" }}
        />
      ))}
    </div>
  )
}

export { Skeleton, SkeletonText }
