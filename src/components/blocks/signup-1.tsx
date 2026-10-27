"use client"

import * as React from "react"
import { Form, Link } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

/*
 * Signup 01 · Strength meter
 * Name, email and password with a four-segment strength meter. Create stays disabled until
 * the password rates Fair or better and the terms are accepted.
 */

export interface Signup1Values {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface Signup1Props {
  onSubmit?: (values: Signup1Values) => void | Promise<void>
  signInHref?: string
  className?: string
}

const LEVELS = [
  { label: "", bar: "" },
  { label: "Weak", bar: "bg-error" },
  { label: "Fair", bar: "bg-tertiary" },
  { label: "Good", bar: "bg-primary-fixed-dim" },
  { label: "Strong", bar: "bg-primary" },
]

/** 0 (empty) · 1 weak · 2 fair · 3 good · 4 strong */
export function passwordScore(pw: string) {
  if (!pw) return 0
  let n = 0
  if (pw.length >= 8) n++
  if (pw.length >= 12) n++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) n++
  if (/\d/.test(pw)) n++
  if (/[^A-Za-z0-9]/.test(pw)) n++
  return Math.max(1, Math.min(4, n))
}

export function Signup1({ onSubmit, signInHref = "#", className }: Signup1Props) {
  const [password, setPassword] = React.useState("")
  const [show, setShow] = React.useState(false)
  const [terms, setTerms] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const score = passwordScore(password)

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const values = {
      firstName: String(data.get("firstName")),
      lastName: String(data.get("lastName")),
      email: String(data.get("email")),
      password,
    }
    setPending(true)
    try {
      if (onSubmit) await onSubmit(values)
      else {
        await new Promise((r) => setTimeout(r, 1000))
        snackbar(`Account created · check ${values.email} to verify`)
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <div className={cn("grid min-h-[640px] place-items-center bg-surface-container-low px-4 py-10", className)}>
      <div className="w-full max-w-[440px] rounded-xl bg-surface p-6 md:p-8">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-md bg-primary text-on-primary">
            <Icon size={20} filled>
              stadia_controller
            </Icon>
          </span>
          <span className="text-title-lg font-semibold">Lumen</span>
        </div>
        <h2 className="mt-6 text-headline-sm font-medium">Create your account</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Already have one?{" "}
          <Link href={signInHref} className="text-primary underline underline-offset-3">
            Sign in
          </Link>
        </p>
        <Form className="mt-6 space-y-4" onSubmit={submit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField name="firstName" label="First name" autoComplete="given-name" defaultValue="Maya" isRequired errorMessage="Enter your first name" />
            <TextField name="lastName" label="Last name" autoComplete="family-name" defaultValue="Ortiz" isRequired errorMessage="Enter your last name" />
          </div>
          <TextField name="email" type="email" label="Work email" autoComplete="email" defaultValue="maya@cinder.gg" isRequired errorMessage={(v) => (v.validationDetails.typeMismatch ? "Enter a valid email address" : "Enter your work email")} />
          <div>
            <TextField
              name="password"
              label="Password"
              autoComplete="new-password"
              type={show ? "text" : "password"}
              value={password}
              onChange={setPassword}
              aria-describedby="signup-1-strength"
              trailing={
                <IconButton aria-label={show ? "Hide password" : "Show password"} onPress={() => setShow((s) => !s)}>
                  <Icon>{show ? "visibility_off" : "visibility"}</Icon>
                </IconButton>
              }
            />
            <div aria-hidden className="mt-2 grid grid-cols-4 gap-1.5 px-1">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-colors duration-(--md-spring-default-effects-duration)",
                    i < score ? LEVELS[score].bar : "bg-secondary-container",
                  )}
                />
              ))}
            </div>
            <div
              id="signup-1-strength"
              aria-live="polite"
              className={cn(
                "mt-1.5 px-1 text-body-sm",
                score === 1 ? "text-error" : score ? "text-on-surface" : "text-on-surface-variant",
              )}
            >
              {score ? `${LEVELS[score].label} password` : "Use 12 or more characters with letters, numbers and symbols"}
            </div>
          </div>
          <Checkbox isSelected={terms} onChange={setTerms} className="-ml-3.5 items-start text-body-md">
            <span className="pt-3">
              I agree to the{" "}
              <Link href="#" className="text-primary underline underline-offset-3">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary underline underline-offset-3">
                Privacy Policy
              </Link>
            </span>
          </Checkbox>
          <Button type="submit" isDisabled={!(score >= 2 && terms)} isPending={pending} className="h-12 w-full">
            Create account
          </Button>
        </Form>
      </div>
    </div>
  )
}
