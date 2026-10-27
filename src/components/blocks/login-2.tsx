"use client"

import * as React from "react"
import { Form, Link } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Shape } from "@/components/ui/shape"
import { snackbar } from "@/components/ui/snackbar"
import { TextField, type TextFieldProps } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

/*
 * Login 02 · Split with status
 * Brand panel with morphing M3 shapes and live service status beside filled text fields.
 * The panel drops away below 840px.
 */

export interface Login2Values {
  email: string
  password: string
}

export interface ServiceStatus {
  name: string
  status: "operational" | "degraded" | "outage"
}

export interface Login2Props {
  onSubmit?: (values: Login2Values) => void | Promise<void>
  onSso?: () => void
  services?: ServiceStatus[]
  forgotPasswordHref?: string
  className?: string
}

const SERVICES: ServiceStatus[] = [
  { name: "Console & APIs", status: "operational" },
  { name: "Game servers", status: "operational" },
  { name: "Player login · SA-São Paulo", status: "degraded" },
]

export function Login2({ onSubmit, onSso, services = SERVICES, forgotPasswordHref = "#", className }: Login2Props) {
  const [pending, setPending] = React.useState(false)

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const values = { email: String(data.get("email")), password: String(data.get("password")) }
    setPending(true)
    try {
      if (onSubmit) await onSubmit(values)
      else {
        await new Promise((r) => setTimeout(r, 1200))
        snackbar("Signed in")
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <div className={cn("grid min-h-[640px] bg-surface lg:grid-cols-2", className)}>
      <div className="relative hidden flex-col justify-between gap-10 overflow-hidden bg-primary-container p-10 text-on-primary-container lg:flex">
        <div aria-hidden className="pointer-events-none absolute -right-20 top-10 size-80 animate-[spin_30s_linear_infinite]">
          <Shape cycle={["cookie9", "clover8", "sunny"]} interval={3200} className="size-full text-primary-fixed-dim" />
        </div>
        <div aria-hidden className="pointer-events-none absolute -bottom-12 left-28 size-44">
          <Shape cycle={["pentagon", "puffy", "gem"]} interval={2800} className="size-full text-tertiary-container" />
        </div>
        <Brand className="relative" />
        <div className="relative max-w-sm">
          <h2 className="text-display-sm font-semibold text-balance">Run the live game from one place.</h2>
          <p className="mt-3 text-body-lg">Events, players, economy and servers for Ember Tactics, Tidebreak and Arena.</p>
        </div>
        <div className="relative rounded-lg bg-surface p-4 text-on-surface shadow-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-title-sm">Service status</span>
            <span className="font-mono text-body-sm text-on-surface-variant">status.cinder.gg</span>
          </div>
          <ul className="mt-2 space-y-1.5 text-body-md">
            {services.map((s) => (
              <li key={s.name} className="flex items-center gap-2">
                <span className={cn("size-2 rounded-full", s.status === "operational" ? "bg-primary" : "animate-pulse bg-error")} />
                <span className="flex-1">{s.name}</span>
                <span className={s.status === "operational" ? "text-on-surface-variant" : "text-error"}>
                  {{ operational: "Operational", degraded: "Degraded", outage: "Outage" }[s.status]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="grid place-items-center px-4 py-10 md:px-10">
        <div className="w-full max-w-[400px]">
          <Brand className="mb-8 lg:hidden" />
          <h2 className="text-headline-md font-medium">Welcome back</h2>
          <p className="mt-1 text-body-md text-on-surface-variant">Sign in with your studio account.</p>
          <Form className="mt-8 space-y-4" onSubmit={submit}>
            <TextField variant="filled" name="email" type="email" label="Email" autoComplete="email" defaultValue="maya@cinder.gg" isRequired errorMessage={(v) => (v.validationDetails.typeMismatch ? "Enter a valid email address" : "Enter your email")} />
            <PasswordField variant="filled" name="password" label="Password" autoComplete="current-password" isRequired errorMessage="Enter your password" />
            <div className="flex justify-end">
              <Link href={forgotPasswordHref} className="focus-ring rounded-xs text-label-lg text-primary">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" size="md" isPending={pending} className="w-full text-title-sm">
              {pending ? "Signing in…" : "Sign in"}
            </Button>
            <p className="pt-2 text-center text-body-md text-on-surface-variant">
              Studio uses SSO?{" "}
              <Link className="focus-ring cursor-pointer rounded-xs text-label-lg text-primary" onPress={() => (onSso ? onSso() : snackbar("Redirecting to Okta…"))}>
                Sign in with SSO
              </Link>
            </p>
          </Form>
        </div>
      </div>
    </div>
  )
}

function Brand({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="grid size-9 place-items-center rounded-md bg-primary text-on-primary">
        <Icon size={20} filled>
          stadia_controller
        </Icon>
      </span>
      <span className="text-title-lg font-semibold">Lumen</span>
    </div>
  )
}

function PasswordField(props: Omit<TextFieldProps, "type" | "trailing">) {
  const [show, setShow] = React.useState(false)
  return (
    <TextField
      {...props}
      type={show ? "text" : "password"}
      trailing={
        <IconButton aria-label={show ? "Hide password" : "Show password"} onPress={() => setShow((s) => !s)}>
          <Icon>{show ? "visibility_off" : "visibility"}</Icon>
        </IconButton>
      }
    />
  )
}
