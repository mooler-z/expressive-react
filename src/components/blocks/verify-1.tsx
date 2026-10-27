"use client"

import * as React from "react"
import { Link } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Shape } from "@/components/ui/shape"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * Verify 01 · Check your inbox
 * Resend is on a cooldown timer; mail-app shortcuts and a fix for a mistyped address sit underneath.
 */

export interface Verify1Props {
  email?: string
  /** Seconds before Resend unlocks. */
  cooldown?: number
  onResend?: () => void | Promise<void>
  changeEmailHref?: string
  className?: string
}

export function Verify1({ email = "maya@cinder.gg", cooldown = 30, onResend, changeEmailHref = "#", className }: Verify1Props) {
  const [left, setLeft] = React.useState(24)

  React.useEffect(() => {
    if (left <= 0) return
    const t = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [left])

  const resend = async () => {
    await onResend?.()
    setLeft(cooldown)
    snackbar(`Sent a new link to ${email}`)
  }

  return (
    <div className={cn("grid min-h-[560px] place-items-center bg-surface-container-low px-4 py-10", className)}>
      <div className="flex w-full max-w-[440px] flex-col items-center rounded-xl bg-surface p-6 text-center md:p-10">
        <div className="relative grid size-24 place-items-center">
          <div aria-hidden className="absolute inset-0 animate-[spin_30s_linear_infinite]">
            <Shape cycle={["cookie9", "sunny", "clover8"]} interval={2800} className="size-full text-primary-container" />
          </div>
          <Icon size={40} className="relative text-on-primary-container">
            mark_email_unread
          </Icon>
        </div>
        <h2 className="mt-6 text-headline-sm font-medium">Verify your email</h2>
        <p className="mt-2 text-body-md text-on-surface-variant">
          We sent a link to <span className="font-medium text-on-surface">{email}</span>. Open it to activate your Lumen account.
        </p>
        <div className="mt-6 grid w-full gap-2 sm:grid-cols-2">
          <Button variant="outlined" className="h-12 text-on-surface" onPress={() => snackbar("Opening Gmail…")}>
            <Icon>mail</Icon>
            Open Gmail
          </Button>
          <Button variant="outlined" className="h-12 text-on-surface" onPress={() => snackbar("Opening Outlook…")}>
            <Icon>mail</Icon>
            Open Outlook
          </Button>
        </div>
        <Button variant="text" className="mt-3 tabular-nums" isDisabled={left > 0} onPress={resend}>
          {left > 0 ? `Resend in 0:${String(left).padStart(2, "0")}` : "Resend email"}
        </Button>
        <p className="mt-4 text-body-sm text-on-surface-variant">
          Wrong address?{" "}
          <Link href={changeEmailHref} className="text-primary underline underline-offset-3">
            Change email
          </Link>
        </p>
      </div>
    </div>
  )
}
