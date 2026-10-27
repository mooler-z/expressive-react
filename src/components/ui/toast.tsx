"use client"

import * as React from "react"
import {
  Button as AriaButton,
  Text,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastQueue as ToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
  type QueuedToast,
} from "react-aria-components"
import type { VariantProps } from "tailwind-variants"

import { Icon } from "@/components/ui/icon"
import { transitionName, useSingletonRegion, viewTransitionUpdate } from "@/components/ui/snackbar"
import { cn, tv } from "@/lib/utils"

/*
 * Toast · richer than a snackbar: an icon on a role-colored container, title + description,
 * optional actions or custom content, stacked from a corner (up to 4 visible).
 * Use snackbar() for single-line confirmations.
 *
 *   <ToastRegion />                            // mount once, near the root
 *   toast({ title: "Rollout complete", description: "v4.2.0 is live", icon: "check_circle", tone: "tertiary" })
 */

const toastVariants = tv({
  slots: {
    root: [
      "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-md bg-surface-container-highest p-4 text-on-surface shadow-3 outline-none",
      "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-secondary",
    ],
    icon: "grid size-10 shrink-0 place-items-center rounded-full",
    body: "min-w-0 flex-1",
    title: "block text-title-sm",
    description: "mt-0.5 block text-body-md text-on-surface-variant",
    actions: "mt-1 -ml-3 flex flex-wrap gap-1",
    action: "state-layer focus-ring inline-flex h-9 cursor-pointer items-center rounded-full px-3 text-label-lg text-primary",
    close: "state-layer focus-ring -mt-2 -mr-2 inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-on-surface-variant",
  },
  variants: {
    tone: {
      primary: { icon: "bg-primary-container text-on-primary-container" },
      secondary: { icon: "bg-secondary-container text-on-secondary-container" },
      tertiary: { icon: "bg-tertiary-container text-on-tertiary-container" },
      error: { icon: "bg-error-container text-on-error-container" },
      neutral: { icon: "bg-surface-container text-on-surface-variant" },
    },
  },
  defaultVariants: { tone: "primary" },
})

export type ToastTone = NonNullable<VariantProps<typeof toastVariants>["tone"]>

export interface ToastAction {
  label: string
  onAction: () => void
}

export interface ToastContent {
  title: React.ReactNode
  description?: React.ReactNode
  /** Material Symbols name, shown filled on the tone's container. */
  icon?: string
  /** Replaces the icon, e.g. a <LoadingIndicator />. */
  media?: React.ReactNode
  tone?: ToastTone
  actions?: ToastAction[]
  /** Extra content under the description, e.g. progress. */
  children?: React.ReactNode
  /** Show the dismiss button. Defaults to true. */
  closable?: boolean
}

export interface ToastOptions extends ToastContent {
  /** Auto-dismiss after ms. Defaults to 6000; persists when there are actions. Pass 0 to persist. */
  timeout?: number
  onClose?: () => void
}

export const toastQueue = new ToastQueue<ToastContent>({ maxVisibleToasts: 4, wrapUpdate: viewTransitionUpdate })

/** Show a toast. Returns its key. */
function toast({ timeout, onClose, ...content }: ToastOptions) {
  const ms = timeout ?? (content.actions?.length ? 0 : 6000)
  return toastQueue.add(content, { timeout: ms > 0 ? ms : undefined, onClose })
}
toast.dismiss = (key: string) => toastQueue.close(key)
toast.clear = () => toastQueue.clear()

export interface ToastRegionProps {
  position?: "bottom-end" | "top-end" | "bottom-start" | "top-start"
  className?: string
}

function ToastRegion({ position = "bottom-end", className }: ToastRegionProps) {
  const active = useSingletonRegion(toastQueue)
  if (!active) return null
  const [v, h] = position.split("-")
  return (
    <AriaToastRegion
      // Distinct names: both regions can be on screen at once
      aria-label="Notifications"
      queue={toastQueue}
      data-slot="toast-region"
      className={cn(
        "pointer-events-none fixed z-[60] flex w-full max-w-sm gap-2 px-4 outline-none sm:w-auto sm:px-0",
        v === "bottom" ? "bottom-4 flex-col-reverse" : "top-4 flex-col",
        h === "end" ? "right-0 sm:right-4" : "left-0 sm:left-4",
        className,
      )}
    >
      {({ toast }) => <LiveToast toast={toast} />}
    </AriaToastRegion>
  )
}

function LiveToast({ toast }: { toast: QueuedToast<ToastContent> }) {
  const c = toast.content
  return (
    <AriaToast
      toast={toast}
      data-slot="toast"
      className={toastVariants({ tone: c.tone }).root()}
      style={{ viewTransitionName: transitionName(toast.key), ["viewTransitionClass" as string]: "md-toast" }}
    >
      <ToastInner {...c} live onAction={() => toastQueue.close(toast.key)} />
    </AriaToast>
  )
}

function ToastInner({
  title,
  description,
  icon,
  media,
  tone,
  actions,
  children,
  closable = true,
  live,
  onAction,
  onClose,
}: ToastContent & { live?: boolean; onAction?: () => void; onClose?: () => void }) {
  const s = toastVariants({ tone })
  const Body = live ? AriaToastContent : "div"
  const T = live ? Text : "span"
  return (
    <>
      {media ??
        (icon && (
          <span className={s.icon()}>
            <Icon filled>{icon}</Icon>
          </span>
        ))}
      <Body className={s.body()}>
        <T {...(live && { slot: "title" })} className={s.title()}>
          {title}
        </T>
        {description && (
          <T {...(live && { slot: "description" })} className={s.description()}>
            {description}
          </T>
        )}
        {children}
        {actions?.length ? (
          <div className={s.actions()}>
            {actions.map((a) => (
              <AriaButton
                key={a.label}
                className={s.action()}
                onPress={() => {
                  a.onAction()
                  onAction?.()
                }}
              >
                {a.label}
              </AriaButton>
            ))}
          </div>
        ) : null}
      </Body>
      {closable &&
        (live ? (
          <AriaButton slot="close" aria-label="Dismiss" className={s.close()}>
            <Icon size={20}>close</Icon>
          </AriaButton>
        ) : (
          onClose && (
            <AriaButton aria-label="Dismiss" className={s.close()} onPress={onClose}>
              <Icon size={20}>close</Icon>
            </AriaButton>
          )
        ))}
    </>
  )
}

export interface ToastCardProps extends ToastContent {
  className?: string
  /** Renders the dismiss button when set. */
  onClose?: () => void
}

/** Static toast surface — for inline use and docs. Use `toast()` for the live, announced one. */
function ToastCard({ className, ...props }: ToastCardProps) {
  return (
    <div data-slot="toast" className={cn(toastVariants({ tone: props.tone }).root(), className)}>
      <ToastInner {...props} />
    </div>
  )
}

export { ToastCard, ToastRegion, toast, toastVariants }
