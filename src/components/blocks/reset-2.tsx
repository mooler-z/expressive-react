"use client"

import * as React from "react"
import { Form } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { snackbar } from "@/components/ui/snackbar"
import { TextField, type TextFieldProps } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

/*
 * Reset 02 · New password rules
 * Two fields with a live checklist. Save unlocks once every rule passes, including the match.
 */

export interface Reset2Props {
  email?: string
  onSubmit?: (values: { password: string; signOutOthers: boolean }) => void | Promise<void>
  className?: string
}

export function passwordRules(password: string, confirm: string) {
  return [
    { label: "At least 12 characters", ok: password.length >= 12 },
    { label: "Upper- and lowercase letters", ok: /[A-Z]/.test(password) && /[a-z]/.test(password) },
    { label: "At least one number or symbol", ok: /[\d\W_]/.test(password) },
    { label: "Both passwords match", ok: password.length > 0 && password === confirm },
  ]
}

export function Reset2({ email = "maya@cinder.gg", onSubmit, className }: Reset2Props) {
  const [password, setPassword] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [signOut, setSignOut] = React.useState(true)
  const [pending, setPending] = React.useState(false)
  const rules = passwordRules(password, confirm)
  const valid = rules.every((r) => r.ok)

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!valid) return
    setPending(true)
    try {
      if (onSubmit) await onSubmit({ password, signOutOthers: signOut })
      else {
        await new Promise((r) => setTimeout(r, 800))
        snackbar(signOut ? "Password updated · other sessions were signed out" : "Password updated")
      }
      setPassword("")
      setConfirm("")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className={cn("grid min-h-[600px] place-items-center bg-surface-container px-4 py-10", className)}>
      <div className="w-full max-w-[440px] rounded-xl bg-surface p-6 md:p-8">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-md bg-primary text-on-primary">
            <Icon size={20} filled>
              stadia_controller
            </Icon>
          </span>
          <span className="text-title-lg font-semibold">Lumen</span>
        </div>
        <h2 className="mt-6 text-headline-sm font-medium">Choose a new password</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">For {email}</p>
        <Form className="mt-6 space-y-4" onSubmit={submit}>
          <PasswordField label="New password" autoComplete="new-password" value={password} onChange={setPassword} aria-describedby="reset-2-rules" />
          <PasswordField label="Confirm password" autoComplete="new-password" value={confirm} onChange={setConfirm} />
          <ul id="reset-2-rules" className="space-y-2 rounded-lg bg-surface-container-low p-4">
            {rules.map((r) => (
              <li key={r.label} className={cn("flex items-center gap-2 text-body-md transition-colors", r.ok ? "text-on-surface" : "text-on-surface-variant")}>
                <Icon size={20} filled={r.ok} className={cn("transition-colors", r.ok ? "text-primary" : "text-outline")}>
                  {r.ok ? "check_circle" : "radio_button_unchecked"}
                </Icon>
                <span>
                  {r.label}
                  <span className="sr-only">{r.ok ? " · met" : " · not met"}</span>
                </span>
              </li>
            ))}
          </ul>
          <Checkbox isSelected={signOut} onChange={setSignOut} className="-ml-3.5 text-body-md">
            Sign out of all other sessions
          </Checkbox>
          <Button type="submit" isDisabled={!valid} isPending={pending} className="h-12 w-full">
            Save password
          </Button>
        </Form>
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
