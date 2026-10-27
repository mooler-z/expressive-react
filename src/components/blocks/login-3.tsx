"use client"

import * as React from "react"
import { Form, Link } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { snackbar } from "@/components/ui/snackbar"
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs"
import { TextField, type TextFieldProps } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

/*
 * Login 03 · Magic link
 * Passwordless by default with a password tab as fallback. Sending the link swaps the
 * form for a confirmation that echoes the address.
 */

export interface Login3Props {
  onSendLink?: (email: string) => void | Promise<void>
  onSubmit?: (values: { email: string; password: string }) => void | Promise<void>
  className?: string
}

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export function Login3({ onSendLink, onSubmit, className }: Login3Props) {
  const [email, setEmail] = React.useState("maya@cinder.gg")
  const [sent, setSent] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const [invalid, setInvalid] = React.useState(false)

  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!EMAIL.test(email)) return setInvalid(true)
    setPending(true)
    try {
      await (onSendLink ? onSendLink(email) : new Promise((r) => setTimeout(r, 600)))
      setSent(true)
    } finally {
      setPending(false)
    }
  }

  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setPending(true)
    try {
      if (onSubmit) await onSubmit({ email: String(data.get("email")), password: String(data.get("password")) })
      else {
        await new Promise((r) => setTimeout(r, 1200))
        snackbar("Signed in")
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <div className={cn("flex min-h-[600px] flex-col bg-surface px-6 py-8 md:px-14 md:py-12", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-md bg-primary text-on-primary">
            <Icon size={20} filled>
              stadia_controller
            </Icon>
          </span>
          <span className="text-title-lg font-semibold">Lumen</span>
        </div>
        <Button variant="text" className="text-on-surface-variant" onPress={() => snackbar("Help center opens in a new tab")}>
          <Icon>help</Icon>
          Help
        </Button>
      </div>
      <div className="mt-12 w-full max-w-[440px] md:mt-16">
        <h2 className="text-display-sm font-semibold tracking-tight">Sign in to Lumen</h2>
        <Tabs className="mt-6">
          <TabList aria-label="Sign-in method" scrollable>
            <Tab id="link">Email link</Tab>
            <Tab id="password">Password</Tab>
          </TabList>
          <TabPanel id="link">
            {sent ? (
              <div className="mt-6 animate-pop rounded-xl bg-primary-container p-5 text-on-primary-container">
                <div className="flex items-start gap-3">
                  <Icon size={28}>forward_to_inbox</Icon>
                  <div className="min-w-0">
                    <div className="text-title-md">Check your inbox</div>
                    <p className="mt-1 break-words text-body-md">
                      We sent a sign-in link to <span className="font-medium">{email}</span>. Open it on this device.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onPress={() => snackbar("Opening Gmail…")}>Open Gmail</Button>
                  <Button variant="text" className="text-on-primary-container" onPress={() => setSent(false)}>
                    Use a different email
                  </Button>
                </div>
              </div>
            ) : (
              <Form className="mt-6 space-y-4" onSubmit={send}>
                <p className="text-body-md text-on-surface-variant">We'll email you a link that signs you in on this device. It expires in 15 minutes.</p>
                <TextField
                  type="email"
                  label="Work email"
                  autoComplete="email"
                  value={email}
                  onChange={(v) => {
                    setEmail(v)
                    setInvalid(false)
                  }}
                  isInvalid={invalid || undefined}
                  errorMessage="Enter a valid email address"
                />
                <Button type="submit" isPending={pending} className="h-12 pr-6 pl-5">
                  {!pending && <Icon>send</Icon>}
                  Email me a link
                </Button>
              </Form>
            )}
          </TabPanel>
          <TabPanel id="password">
            <Form className="mt-6 space-y-4" onSubmit={signIn}>
              <TextField name="email" type="email" label="Work email" autoComplete="email" defaultValue="maya@cinder.gg" isRequired errorMessage={(v) => (v.validationDetails.typeMismatch ? "Enter a valid email address" : "Enter your work email")} />
              <PasswordField name="password" label="Password" autoComplete="current-password" isRequired errorMessage="Enter your password" />
              <Button type="submit" isPending={pending} className="h-12 px-6">
                {pending ? "Signing in…" : "Sign in"}
              </Button>
            </Form>
          </TabPanel>
        </Tabs>
        <p className="mt-8 text-body-sm text-on-surface-variant">
          Staff accounts require two-factor authentication.{" "}
          <Link href="#two-factor-1" className="text-primary underline underline-offset-3">
            How it works
          </Link>
        </p>
      </div>
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
