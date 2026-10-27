"use client"

import * as React from "react"
import type { VariantProps } from "tailwind-variants"

import { Shape, type ShapeName } from "@/components/ui/shape"
import { cn, tv } from "@/lib/utils"

const SEQUENCE: ShapeName[] = ["softBurst", "cookie9", "pentagon", "puffy", "sunny", "cookie4", "oval"]

const loadingIndicatorVariants = tv({
  slots: {
    root: "inline-grid shrink-0 place-items-center rounded-full",
    spinner: "size-[79%] animate-[spin_4s_linear_infinite] motion-reduce:animate-[spin_12s_linear_infinite]",
  },
  variants: {
    contained: {
      true: { root: "bg-primary-container text-on-primary-container" },
      false: { root: "text-primary" },
    },
  },
  defaultVariants: { contained: false },
})

export interface LoadingIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingIndicatorVariants> {
  /** Outer size in px (spec: 48, indicator 38). */
  size?: number
  /** Shapes to morph through. */
  shapes?: ShapeName[]
}

/** M3 Expressive loading indicator: a morphing, rotating shape for short indeterminate waits. */
function LoadingIndicator({
  size = 48,
  contained,
  shapes = SEQUENCE,
  className,
  style,
  "aria-label": ariaLabel = "Loading",
  ...props
}: LoadingIndicatorProps) {
  const { root, spinner } = loadingIndicatorVariants({ contained })
  return (
    <div
      role="progressbar"
      aria-label={ariaLabel}
      data-slot="loading-indicator"
      className={cn(root(), className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <div className={spinner()}>
        <Shape cycle={shapes} interval={650} morphDuration={520} className="size-full" />
      </div>
    </div>
  )
}

export { LoadingIndicator, loadingIndicatorVariants }
