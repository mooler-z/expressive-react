"use client"

import * as React from "react"
import { flushSync } from "react-dom"
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
import { cn, tv } from "@/lib/utils"

/*
 * Snackbar · M3 (androidx SnackbarTokens)
 * Inverse surface, extra-small (4dp) corners, body-medium text, inverse-primary label-large action,
 * inverse-on-surface close icon. 48dp single line · 68dp two lines · action stacks below long text.
 *
 *   <SnackbarRegion />                         // mount once, near the root
 *   snackbar("Photo archived", { action: { label: "Undo", onAction: restore } })
 */

const snackbarVariants = tv({
  slots: {
    root: [
      "pointer-events-auto flex w-full max-w-[min(100%,560px)] min-w-0 rounded-xs bg-inverse-surface text-body-md text-inverse-on-surface shadow-3 outline-none",
      "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-secondary",
    ],
    message: "min-w-0 flex-1 py-3.5",
    actions: "flex shrink-0 items-center",
    action: [
      "state-layer focus-ring inline-flex h-9 cursor-pointer items-center rounded-full px-3 text-label-lg text-inverse-primary",
    ],
    close: "state-layer focus-ring inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-inverse-on-surface",
  },
  variants: {
    layout: {
      inline: { root: "min-h-12 items-center gap-2 pl-4", actions: "pr-1" },
      stacked: { root: "flex-col gap-1 px-4 pt-0.5 pb-2", message: "pb-0", actions: "-mr-2 justify-end self-stretch" },
    },
    closable: { true: {}, false: {} },
  },
  compoundVariants: [{ layout: "inline", closable: false, class: { actions: "pr-2" } }],
  defaultVariants: { layout: "inline", closable: false },
})

export interface SnackbarAction {
  label: string
  onAction: () => void
}

export interface SnackbarContent {
  message: React.ReactNode
  action?: SnackbarAction
  /** Show the close icon. */
  closable?: boolean
  /** Put the action under the message (long text / long action label). */
  stacked?: boolean
  /** Extra content under the message, e.g. a progress bar. */
  children?: React.ReactNode
}

export interface SnackbarOptions extends Omit<SnackbarContent, "message"> {
  /** Auto-dismiss after ms. Defaults to 4000, or 8000 with an action. Pass 0 to persist. */
  timeout?: number
  onClose?: () => void
}

/** Run queue updates inside a view transition so items animate in, out and reflow. */
export function viewTransitionUpdate(fn: () => void) {
  if (typeof document !== "undefined" && "startViewTransition" in document) {
    const start = document.startViewTransition as unknown as (opts: { update: () => void; types: string[] }) => unknown
    try {
      start.call(document, { update: () => flushSync(fn), types: ["md-toast"] })
      return
    } catch {
      // older engines: callback-only signature
      document.startViewTransition(() => flushSync(fn))
      return
    }
  }
  fn()
}

/** One snackbar at a time, per M3. */
export const snackbarQueue = new ToastQueue<SnackbarContent>({ maxVisibleToasts: 1, wrapUpdate: viewTransitionUpdate })

/** Show a snackbar. Returns its key. */
function snackbar(message: React.ReactNode, { timeout, onClose, ...content }: SnackbarOptions = {}) {
  const ms = timeout ?? (content.action ? 8000 : 4000)
  return snackbarQueue.add({ message, ...content }, { timeout: ms > 0 ? ms : undefined, onClose })
}
snackbar.dismiss = (key: string) => snackbarQueue.close(key)
snackbar.clear = () => snackbarQueue.clear()

/** A valid view-transition-name for a toast key. */
export const transitionName = (key: string) => `md-toast-${key.replace(/[^a-zA-Z0-9_-]/g, "-")}`

/** First mounted region per queue wins, so mounting it in a page and at the root is harmless. */
export function useSingletonRegion(queue: object) {
  const id = React.useId()
  const [active, setActive] = React.useState(false)
  React.useEffect(() => {
    const owners = (regionOwners.get(queue) ?? []).concat(id)
    regionOwners.set(queue, owners)
    setActive(owners[0] === id)
    const notify = () => setActive(regionOwners.get(queue)?.[0] === id)
    listeners.add(notify)
    return () => {
      regionOwners.set(queue, (regionOwners.get(queue) ?? []).filter((x) => x !== id))
      listeners.delete(notify)
      listeners.forEach((l) => l())
    }
  }, [queue, id])
  return active
}
const regionOwners = new WeakMap<object, string[]>()
const listeners = new Set<() => void>()

export interface SnackbarRegionProps {
  /** bottom-center (compact default) or bottom-start (M3 large-screen placement). */
  position?: "bottom-center" | "bottom-start"
  /** Extra bottom offset in px, e.g. to sit above a navigation bar (80). */
  offset?: number
  className?: string
}

function SnackbarRegion({ position = "bottom-center", offset = 0, className }: SnackbarRegionProps) {
  const active = useSingletonRegion(snackbarQueue)
  if (!active) return null
  return (
    <AriaToastRegion
      // Distinct names: both regions can be on screen at once
      aria-label="Snackbar messages"
      queue={snackbarQueue}
      data-slot="snackbar-region"
      className={cn(
        "pointer-events-none fixed inset-x-0 z-[60] flex px-4 outline-none",
        position === "bottom-center" ? "justify-center" : "justify-start md:px-6",
        className,
      )}
      style={{ bottom: 16 + offset }}
    >
      {({ toast }) => <SnackbarToast toast={toast} />}
    </AriaToastRegion>
  )
}

function SnackbarToast({ toast }: { toast: QueuedToast<SnackbarContent> }) {
  const { message, action, closable, stacked, children } = toast.content
  const s = snackbarVariants({ layout: stacked ? "stacked" : "inline", closable: !!closable })
  return (
    <AriaToast
      toast={toast}
      data-slot="snackbar"
      className={s.root()}
      style={{ viewTransitionName: transitionName(toast.key), ["viewTransitionClass" as string]: "md-toast" }}
    >
      <AriaToastContent className={s.message()}>
        <Text slot="title">{message}</Text>
        {children}
      </AriaToastContent>
      {(action || closable) && (
        <div className={s.actions()}>
          {action && (
            <AriaButton
              className={s.action()}
              onPress={() => {
                action.onAction()
                snackbarQueue.close(toast.key)
              }}
            >
              {action.label}
            </AriaButton>
          )}
          {closable && (
            <AriaButton slot="close" aria-label="Dismiss" className={s.close()}>
              <Icon size={24}>close</Icon>
            </AriaButton>
          )}
        </div>
      )}
    </AriaToast>
  )
}

export interface SnackbarProps extends React.HTMLAttributes<HTMLDivElement>, Omit<VariantProps<typeof snackbarVariants>, "closable" | "layout"> {
  message: React.ReactNode
  action?: SnackbarAction
  /** Called by the close icon; renders it when set. */
  onClose?: () => void
  stacked?: boolean
}

/** Static snackbar surface — for inline use and docs. Use `snackbar()` for the live, announced one. */
function Snackbar({ message, action, onClose, stacked, className, children, ...props }: SnackbarProps) {
  const s = snackbarVariants({ layout: stacked ? "stacked" : "inline", closable: !!onClose })
  return (
    <div data-slot="snackbar" className={cn(s.root(), className)} {...props}>
      <div className={s.message()}>
        {message}
        {children}
      </div>
      {(action || onClose) && (
        <div className={s.actions()}>
          {action && (
            <AriaButton className={s.action()} onPress={action.onAction}>
              {action.label}
            </AriaButton>
          )}
          {onClose && (
            <AriaButton aria-label="Dismiss" className={s.close()} onPress={onClose}>
              <Icon size={24}>close</Icon>
            </AriaButton>
          )}
        </div>
      )}
    </div>
  )
}

export { Snackbar, SnackbarRegion, snackbar, snackbarVariants }
