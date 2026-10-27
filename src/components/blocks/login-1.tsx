"use client"

import * as React from "react"
import { Form, Link } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Divider } from "@/components/ui/divider"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { snackbar } from "@/components/ui/snackbar"
import { TextField, type TextFieldProps } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

/*
 * Login 01 · Centered card
 * Email + password with show/hide, keep-me-signed-in, SSO and an async submit.
 * The email validates as you type; an empty submit shows the required errors.
 */

export interface Login1Values {
  email: string
  password: string
  remember: boolean
}

export interface Login1Props {
  onSubmit?: (values: Login1Values) => void | Promise<void>
  onSso?: (provider: "google" | "saml") => void
  forgotPasswordHref?: string
  className?: string
}

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export function Login1({ onSubmit, onSso, forgotPasswordHref = "#", className }: Login1Props) {
  const [email, setEmail] = React.useState("maya@cinder.gg")
  const [pending, setPending] = React.useState(false)
  const emailInvalid = email.length > 0 && !EMAIL.test(email)

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (emailInvalid) return
    const data = new FormData(e.currentTarget)
    const values = { email, password: String(data.get("password")), remember: data.get("remember") === "on" }
    setPending(true)
    try {
      if (onSubmit) await onSubmit(values)
      else {
        await new Promise((r) => setTimeout(r, 1200))
        snackbar(`Signed in as ${values.email}`)
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <div className={cn("grid min-h-[640px] place-items-center bg-surface-container px-4 py-10", className)}>
      <div className="w-full max-w-[400px] rounded-xl bg-surface p-6 shadow-1 md:p-8">
        <Brand />
        <h2 className="mt-6 text-headline-sm font-medium">Sign in</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">Live ops console for Cinder Studio</p>
        <Form className="mt-6 space-y-4" onSubmit={submit}>
          <TextField
            name="email"
            type="email"
            label="Work email"
            autoComplete="email"
            isRequired
            value={email}
            onChange={setEmail}
            isInvalid={emailInvalid || undefined}
            errorMessage={(v) => (emailInvalid || v.validationDetails.typeMismatch ? "Enter a valid email address" : "Enter your work email")}
          />
          <PasswordField name="password" label="Password" autoComplete="current-password" defaultValue="frostfire-night-42" isRequired errorMessage="Enter your password" />
          <div className="flex items-center justify-between gap-2">
            <Checkbox name="remember" value="on" defaultSelected className="-ml-3.5 text-body-md">
              Keep me signed in
            </Checkbox>
            <Link href={forgotPasswordHref} className="focus-ring rounded-xs text-label-lg text-primary">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" isPending={pending} className="h-12 w-full">
            {pending ? "Signing in…" : "Sign in"}
          </Button>
          <Divider>or</Divider>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button variant="outlined" className="h-12 text-on-surface" onPress={() => (onSso ? onSso("google") : snackbar("Redirecting to Google Workspace…"))}>
              <Icon>domain</Icon>
              Google
            </Button>
            <Button variant="outlined" className="h-12 text-on-surface" onPress={() => (onSso ? onSso("saml") : snackbar("Redirecting to your identity provider…"))}>
              <Icon>key</Icon>
              SAML SSO
            </Button>
          </div>
        </Form>
        <p className="mt-6 text-center text-body-sm text-on-surface-variant">Need access? Ask a studio admin for an invite.</p>
      </div>
    </div>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-2">
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
