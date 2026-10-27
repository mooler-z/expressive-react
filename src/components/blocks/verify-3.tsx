"use client"

import * as React from "react"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * Verify 03 · In-app banner
 * For staff who skipped verification: a dismissible banner across the console and a locked
 * publish action until the address is confirmed.
 */

export interface Verify3Props {
  email?: string
  onResend?: () => void | Promise<void>
  className?: string
}

export function Verify3({ email = "maya@cinder.gg", onResend, className }: Verify3Props) {
  const [open, setOpen] = React.useState(true)
  const [sent, setSent] = React.useState(false)

  const resend = async () => {
    await onResend?.()
    setSent(true)
    snackbar(`Verification email sent to ${email}`)
  }

  return (
    <div className={cn("flex min-h-[420px] flex-col bg-surface", className)}>
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-outline-variant px-4 md:px-6">
        <span className="grid size-9 place-items-center rounded-md bg-primary text-on-primary">
          <Icon size={20} filled>
            stadia_controller
          </Icon>
        </span>
        <span className="text-title-md font-semibold">Lumen</span>
        <span className="flex-1" />
        {!open && (
          <Button
            variant="text"
            size="xs"
            onPress={() => {
              setOpen(true)
              setSent(false)
            }}
          >
            Show banner
          </Button>
        )}
        <Avatar size="sm" name="Maya Ortiz" color="secondary" />
      </header>
      {open && (
        <div role="status" className="flex animate-fade-up flex-wrap items-center gap-x-4 gap-y-2 bg-tertiary-container px-4 py-3 text-on-tertiary-container md:px-6">
          <Icon>mark_email_unread</Icon>
          <p className="min-w-[min(100%,220px)] flex-1 text-body-md">
            <span className="font-medium">Verify {email}</span> to publish events and change store prices.
          </p>
          {sent ? (
            <span className="inline-flex items-center gap-1 text-label-lg">
              <Icon size={18}>check</Icon>
              Sent · check your inbox
            </span>
          ) : (
            <Button size="xs" className="h-9 bg-on-tertiary-container px-4 text-tertiary-container" onPress={resend}>
              Resend email
            </Button>
          )}
          <IconButton aria-label="Dismiss" className="size-9 text-on-tertiary-container" onPress={() => setOpen(false)}>
            <Icon size={20}>close</Icon>
          </IconButton>
        </div>
      )}
      <main className="flex-1 p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-body-sm text-on-surface-variant">Events · Draft</div>
            <h2 className="text-headline-sm font-medium">Double XP Weekend</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span id="verify-3-lock" className="text-body-sm text-on-surface-variant">
              Publishing needs a verified email
            </span>
            <Button isDisabled aria-describedby="verify-3-lock" className="pr-4 pl-3">
              <Icon>lock</Icon>
              Publish
            </Button>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="h-24 rounded-lg bg-surface-container-low" />
          <div className="h-24 rounded-lg bg-surface-container-low" />
          <div className="h-24 rounded-lg bg-surface-container-low" />
        </div>
        <div className="mt-3 h-32 rounded-lg bg-surface-container-low" />
      </main>
    </div>
  )
}
