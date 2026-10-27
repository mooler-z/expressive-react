"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogActions, DialogBody, DialogHeadline, DialogTrigger, type DialogProps } from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

/*
 * Alert dialog · a basic dialog that requires a decision.
 * role="alertdialog", no dismiss on scrim tap; Escape still cancels.
 * Destructive confirms use the error role (filled error button, error icon).
 *
 * <DialogTrigger>
 *   <Button>Delete…</Button>
 *   <AlertDialog title="Delete workspace?" confirmLabel="Delete" destructive onConfirm={remove}>
 *     All projects will be removed.
 *   </AlertDialog>
 * </DialogTrigger>
 */

export interface AlertDialogProps extends Omit<DialogProps, "children" | "role" | "isDismissable"> {
  title: React.ReactNode
  /** Material Symbols name shown above the headline (left-aligned). */
  icon?: string
  /** Body: supporting text and any extra content (e.g. a type-to-confirm field). */
  children?: React.ReactNode
  confirmLabel: React.ReactNode
  cancelLabel?: React.ReactNode
  /** Called before the dialog closes. */
  onConfirm?: () => void
  onCancel?: () => void
  /** Error-role confirm button and icon. */
  destructive?: boolean
  /** Confirm button style. Defaults to filled (error) when destructive, else text. */
  confirmVariant?: "text" | "filled" | "tonal"
  isConfirmDisabled?: boolean
  /** Extra actions between Cancel and confirm, e.g. "Discard" (3-action layout). */
  extraActions?: React.ReactNode
}

function AlertDialog({
  title,
  icon,
  children,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  destructive = false,
  confirmVariant = destructive ? "filled" : "text",
  isConfirmDisabled,
  extraActions,
  className,
  ...props
}: AlertDialogProps) {
  return (
    <Dialog role="alertdialog" isDismissable={false} className={className} {...props}>
      {icon && (
        <div data-slot="alert-dialog-icon" className={cn("mb-4 flex", destructive ? "text-error" : "text-secondary")}>
          <Icon>{icon}</Icon>
        </div>
      )}
      <DialogHeadline>{title}</DialogHeadline>
      {children && <DialogBody className="mt-3">{children}</DialogBody>}
      <DialogActions className="flex-wrap">
        <Button variant="text" slot="close" onPress={onCancel}>
          {cancelLabel}
        </Button>
        {extraActions}
        <Button
          slot="close"
          variant={confirmVariant}
          isDisabled={isConfirmDisabled}
          onPress={onConfirm}
          className={cn(
            confirmVariant !== "text" && "px-6",
            destructive && (confirmVariant === "text" ? "text-error" : "bg-error text-on-error"),
          )}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export { AlertDialog, DialogTrigger as AlertDialogTrigger }
