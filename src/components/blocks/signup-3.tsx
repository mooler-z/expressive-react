"use client"

import * as React from "react"
import { Form, Link } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

/*
 * Signup 03 · Invite acceptance
 * Joining from an email invite: the inviter, role and title access sit beside a short form,
 * with the email locked to the invited address.
 */

export interface Signup3Props {
  email?: string
  inviter?: { name: string; title: string }
  role?: string
  onSubmit?: (values: { email: string; displayName: string; password: string }) => void | Promise<void>
  onDecline?: () => void
  className?: string
}

const ALLOWED = ["Create and schedule live events", "Edit store offers and bundles", "View player profiles and purchase history"]

export function Signup3({
  email = "tomas@cinder.gg",
  inviter = { name: "Ines Moreau", title: "Head of Live Ops · Cinder Studio" },
  role = "Live ops editor",
  onSubmit,
  onDecline,
  className,
}: Signup3Props) {
  const [show, setShow] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const initials = inviter.name.split(" ").map((w) => w[0]).join("").slice(0, 2)

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setPending(true)
    try {
      const values = { email, displayName: String(data.get("displayName")), password: String(data.get("password")) }
      if (onSubmit) await onSubmit(values)
      else {
        await new Promise((r) => setTimeout(r, 1200))
        snackbar("Welcome to Cinder Studio")
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <div className={cn("grid min-h-[620px] bg-surface lg:grid-cols-2", className)}>
      <div className="flex flex-col justify-between gap-8 bg-inverse-surface p-8 text-inverse-on-surface md:p-10">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-md bg-inverse-primary text-inverse-surface">
            <Icon size={20} filled>
              stadia_controller
            </Icon>
          </span>
          <span className="text-title-lg font-semibold">Lumen</span>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-inverse-primary text-title-md text-inverse-surface">{initials}</span>
            <div>
              <div className="text-title-md">{inviter.name} invited you</div>
              <div className="text-body-md opacity-80">{inviter.title}</div>
            </div>
          </div>
          <h2 className="mt-6 text-headline-md font-medium text-balance">Join Cinder Studio as a {role}</h2>
          <ul className="mt-6 space-y-3 text-body-md">
            {ALLOWED.map((a) => (
              <li key={a} className="flex gap-3">
                <Icon size={20} className="text-inverse-primary">
                  check
                </Icon>
                {a}
              </li>
            ))}
            <li className="flex gap-3 opacity-70">
              <Icon size={20}>block</Icon>
              Bans and refunds stay with admins
            </li>
          </ul>
        </div>
        <div>
          <div className="text-body-sm opacity-80">Access to 2 of 3 titles</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              ["ET", "Ember Tactics", "bg-tertiary-container text-on-tertiary-container"],
              ["TB", "Tidebreak", "bg-primary-container text-on-primary-container"],
            ].map(([mono, name, tone]) => (
              <span key={name} className="inline-flex h-8 items-center gap-2 rounded-sm border border-inverse-on-surface/30 pr-3 pl-1 text-label-lg">
                <span className={cn("grid size-6 place-items-center rounded-xs text-label-sm", tone)}>{mono}</span>
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="grid place-items-center px-4 py-10 md:px-10">
        <Form className="w-full max-w-[400px] space-y-4" onSubmit={submit}>
          <div>
            <h2 className="text-headline-sm font-medium">Create your login</h2>
            <p className="mt-1 text-body-md text-on-surface-variant">This invite expires in 6 days.</p>
          </div>
          <TextField type="email" label="Email" value={email} isReadOnly description="Locked to the invited address" trailing={<Icon className="text-on-surface-variant">lock</Icon>} />
          <TextField name="displayName" label="Display name" autoComplete="name" defaultValue="Tomás Ibarra" isRequired errorMessage="Enter the name teammates will see" />
          <TextField
            name="password"
            label="Choose a password"
            autoComplete="new-password"
            type={show ? "text" : "password"}
            isRequired
            minLength={8}
            errorMessage={(v) => (v.validationDetails.tooShort ? "Use at least 8 characters" : "Choose a password")}
            trailing={
              <IconButton aria-label={show ? "Hide password" : "Show password"} onPress={() => setShow((s) => !s)}>
                <Icon>{show ? "visibility_off" : "visibility"}</Icon>
              </IconButton>
            }
          />
          <Button type="submit" isPending={pending} className="h-12 w-full">
            {pending ? "Joining…" : "Join Cinder Studio"}
          </Button>
          <p className="text-center text-body-sm text-on-surface-variant">
            Not Tomás?{" "}
            <Link className="cursor-pointer text-primary underline underline-offset-3" onPress={() => (onDecline ? onDecline() : snackbar("Invite declined"))}>
              Decline this invite
            </Link>
          </p>
        </Form>
      </div>
    </div>
  )
}
