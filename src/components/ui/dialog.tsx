"use client"

import * as React from "react"
import {
  Dialog as AriaDialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
  composeRenderProps,
  type DialogProps as AriaDialogProps,
  type ModalOverlayProps,
} from "react-aria-components"

import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

/*
 * Dialogs · M3 basic dialog
 * 28dp corners, surface-container-high, headline-small, right-aligned text-button actions.
 *
 * <DialogTrigger>
 *   <Button>Open</Button>
 *   <Dialog>
 *     <DialogIcon>restart_alt</DialogIcon>
 *     <DialogHeadline>Reset settings?</DialogHeadline>
 *     <DialogBody>…</DialogBody>
 *     <DialogActions>
 *       <Button variant="text" slot="close">Cancel</Button>
 *     </DialogActions>
 *   </Dialog>
 * </DialogTrigger>
 */

export interface DialogProps extends Omit<AriaDialogProps, "className" | "style"> {
  className?: string
  /** Close when the scrim is clicked. Defaults to true; set false for alert dialogs. */
  isDismissable?: boolean
  overlayProps?: Omit<ModalOverlayProps, "children">
  /** Classes for the dialog surface (width, radius, color). `className` styles the inner content. */
  modalClassName?: string
}

function Dialog({ className, modalClassName, isDismissable = true, overlayProps, role, ...props }: DialogProps) {
  return (
    <ModalOverlay
      isDismissable={isDismissable && role !== "alertdialog"}
      {...overlayProps}
      className={composeRenderProps(overlayProps?.className, (className) =>
        cn(
          "fixed inset-0 z-50 grid place-items-center bg-scrim/32 p-4",
          "data-entering:animate-[m3-fade-in_200ms_var(--md-easing-standard)]",
          "data-exiting:animate-[m3-fade-out_150ms_var(--md-easing-standard)]",
          className,
        ),
      )}
    >
      <Modal
        className={cn(
          "w-full max-w-[560px] min-w-[280px] rounded-xl bg-surface-container-high text-on-surface shadow-3",
          "data-entering:animate-[m3-dialog-in_450ms_var(--md-easing-emphasized-decelerate)]",
          "data-exiting:animate-[m3-dialog-out_150ms_var(--md-easing-emphasized-accelerate)]",
          modalClassName,
        )}
      >
        <AriaDialog
          data-slot="dialog"
          role={role}
          {...props}
          className={cn("flex max-h-[calc(100dvh-2rem)] flex-col p-6 outline-none", className)}
        />
      </Modal>
    </ModalOverlay>
  )
}

/** Optional hero icon. Centers the headline below it. */
function DialogIcon({ children, className }: { children: string; className?: string }) {
  return (
    <div data-slot="dialog-icon" className={cn("mb-4 flex justify-center text-secondary", className)}>
      <Icon>{children}</Icon>
    </div>
  )
}

function DialogHeadline({ className, ...props }: React.ComponentProps<typeof Heading>) {
  return (
    <Heading
      slot="title"
      data-slot="dialog-headline"
      className={cn("text-headline-sm text-on-surface [[data-slot=dialog-icon]~&]:text-center", className)}
      {...props}
    />
  )
}

function DialogBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-body"
      className={cn("relative mt-4 min-h-0 overflow-y-auto text-body-md text-on-surface-variant", className)}
      {...props}
    />
  )
}

function DialogActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="dialog-actions" className={cn("mt-6 flex justify-end gap-2", className)} {...props} />
}

export { Dialog, DialogActions, DialogBody, DialogHeadline, DialogIcon, DialogTrigger }
