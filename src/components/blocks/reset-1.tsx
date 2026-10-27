"use client"

import * as React from "react"
import { Form, Link } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

/*
 * Reset 01 · Request a link
 * Email-only request that swaps to a confirmation in place, with a way back to the form.
 */

export interface Reset1Props {
  onSubmit?: (email: string) => void | Promise<void>
  signInHref?: string
  className?: string
}

export function Reset1({ onSubmit, signInHref = "#", className }: Reset1Props) {
  const [sent, setSent] = React.useState(false)
  const [pending, setPending] = React.useState(false)

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = String(new FormData(e.currentTarget).get("email"))
    setPending(true)
    try {
      await (onSubmit ? onSubmit(email) : new Promise((r) => setTimeout(r, 700)))
      setSent(true)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className={cn("grid min-h-[520px] place-items-center bg-surface-container-low px-4 py-10", className)}>
      <div className="w-full max-w-[400px] rounded-xl bg-surface p-6 md:p-8">
        {sent ? (
          <div key="sent" className="animate-pop">
            <span className="grid size-12 place-items-center rounded-lg bg-primary-container text-on-primary-container">
              <Icon>mark_email_read</Icon>
            </span>
            <h2 className="mt-5 text-headline-sm font-medium">Check your email</h2>
            <p className="mt-1 text-body-md text-on-surface-variant">If that address has a Lumen account, a reset link is on its way. It expires in 30 minutes.</p>
            <div className="mt-6 space-y-3">
              <Button className="h-12 w-full" onPress={() => snackbar("Opening your email app…")}>
                Open email app
              </Button>
              <Button variant="text" className="w-full" onPress={() => setSent(false)}>
                Try a different email
              </Button>
            </div>
          </div>
        ) : (
          <div key="form" className="animate-pop">
            <span className="grid size-12 place-items-center rounded-lg bg-secondary-container text-on-secondary-container">
              <Icon>lock_reset</Icon>
            </span>
            <h2 className="mt-5 text-headline-sm font-medium">Reset your password</h2>
            <p className="mt-1 text-body-md text-on-surface-variant">Enter the email on your Lumen account and we'll send a reset link.</p>
            <Form className="mt-6 space-y-3" onSubmit={submit}>
              <TextField
                name="email"
                type="email"
                label="Email"
                autoComplete="email"
                defaultValue="maya@cinder.gg"
                isRequired
                errorMessage={(v) => (v.validationDetails.typeMismatch ? "Enter a valid email address" : "Enter your email")}
              />
              <Button type="submit" isPending={pending} className="h-12 w-full">
                Send reset link
              </Button>
              <Link href={signInHref} className="state-layer focus-ring flex h-10 items-center justify-center gap-1 rounded-full text-label-lg text-primary">
                <Icon size={20}>arrow_back</Icon>
                Back to sign in
              </Link>
            </Form>
          </div>
        )}
      </div>
    </div>
  )
}
