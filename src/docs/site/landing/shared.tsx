import * as React from "react"
import { Link, type LinkProps } from "react-aria-components"

import { buttonVariants } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/code-block"
import { Icon } from "@/components/ui/icon"
import { Ripple } from "@/components/ui/ripple"
import { snackbar } from "@/components/ui/snackbar"
import { usePressScale } from "@/hooks/use-press-scale"
import { cn } from "@/lib/utils"

export const INSTALL = "npx shadcn add @expressive/init"

export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("text-headline-lg font-semibold text-balance md:text-display-sm", className)}>{children}</h2>
}

export function InlineCode({ children, className }: { children: React.ReactNode; className?: string }) {
  return <code className={cn("font-mono", className)}>{children}</code>
}

type LinkButtonProps = Omit<LinkProps, "className" | "children"> &
  Parameters<typeof buttonVariants>[0] & {
    className?: string
    icon?: React.ReactNode
    trailingIcon?: React.ReactNode
    /** Scale to .94 on press and spring back (the design's `data-press`). */
    pressScale?: boolean
    children: React.ReactNode
  }

/** A link that looks and moves exactly like `<Button>`: state layer, press morph, ripple. */
export function LinkButton({ variant, size, shape, color, className, icon, trailingIcon, pressScale, children, ...props }: LinkButtonProps) {
  const ref = React.useRef<HTMLAnchorElement>(null)
  usePressScale(ref, { scale: 0.94, disabled: !pressScale })
  return (
    <Link ref={ref} {...props} className={buttonVariants({ variant, size, shape, color, className })}>
      {icon}
      {children}
      {trailingIcon}
      <Ripple />
    </Link>
  )
}

/** `$ npx shadcn add …` pill with a copy button; copying confirms with a snackbar. */
export function InstallCommand({ command = INSTALL, className, surface = "bg-surface-container-high", ...props }: { command?: string; className?: string; surface?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex h-14 items-center gap-2 rounded-full pr-2 pl-5 font-mono text-body-md text-on-surface", surface, className)} {...props}>
      <span className="text-on-surface-variant select-none" aria-hidden>
        $
      </span>
      <code className="min-w-0 flex-1 truncate">{command}</code>
      <CopyButton value={command} aria-label="Copy install command" onCopied={() => snackbar("Copied install command")} className="text-on-surface-variant" />
    </div>
  )
}

/** Card-style surface used across the landing (surface-container-low, xl corners). */
export function Panel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl bg-surface-container-low", className)} {...props} />
}

export function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <Icon name="check" size={20} className="text-primary" />
      <span>{children}</span>
    </li>
  )
}
