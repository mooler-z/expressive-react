import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { BlockPreview } from "@/docs/blocks-layout"
import { cn } from "@/lib/utils"

/**
 * One numbered block variant, as the kit's Blocks pages show them:
 * "01 · Title · [Copy install]", a description, then the live block in a bordered frame.
 */
export function BlockDemo({
  id,
  n,
  title,
  name,
  description,
  frameClassName,
  children,
}: {
  /** Anchor id (the reference article id, e.g. "app-shell-1"). */
  id: string
  n: number
  title: string
  /** Registry item name, for the install command. */
  name: string
  description: React.ReactNode
  /** Height and background of the preview frame, e.g. "h-[640px]". */
  frameClassName?: string
  children: React.ReactNode
}) {
  const command = `npx shadcn add @expressive/${name}`
  return (
    <article id={id} className="scroll-mt-24 space-y-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="inline-flex h-6 items-center rounded-sm bg-primary-container px-2 font-mono text-label-md text-on-primary-container">
          {String(n).padStart(2, "0")}
        </span>
        <h3 className="text-title-lg font-medium">{title}</h3>
        <span className="flex-1" />
        <Button
          variant="outlined"
          size="xs"
          className="h-9"
          aria-label={`Copy install command: ${command}`}
          onPress={async () => {
            try {
              await navigator.clipboard.writeText(command)
              snackbar(`Copied · ${command}`)
            } catch {
              snackbar(command)
            }
          }}
        >
          <Icon size={18}>terminal</Icon>
          Copy install
        </Button>
      </div>
      <p className="text-body-md text-on-surface-variant">{description}</p>
      <BlockPreview className={cn("h-[640px]", frameClassName)}>{children}</BlockPreview>
    </article>
  )
}

/** Group header ("App shell · 3 variants"), matching the kit. */
export function BlockGroup({
  id,
  title,
  description,
  count,
  children,
}: {
  id: string
  title: string
  description: string
  count: number
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-12">
      <header className="flex flex-wrap items-end justify-between gap-2 border-b border-outline-variant pb-4">
        <div>
          <h2 className="text-headline-md font-semibold">{title}</h2>
          <p className="mt-1 max-w-prose text-body-md text-on-surface-variant">{description}</p>
        </div>
        <span className="text-label-lg text-on-surface-variant">{count} variants</span>
      </header>
      {children}
    </section>
  )
}
