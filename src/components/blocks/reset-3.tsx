"use client"

import * as React from "react"
import { Form, Link } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { InputOTP } from "@/components/ui/input-otp"
import { Shape } from "@/components/ui/shape"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

/*
 * Reset 03 · Code + new password
 * A texted six-digit code, then the new password, then confirmation. The bar along the top
 * tracks progress. Any six digits pass; 000000 shows the error state.
 */


export interface Reset3Props {
  phone?: string
  /** Return false to reject the code. Defaults to accepting anything but 000000. */
  verifyCode?: (code: string) => boolean | Promise<boolean>
  onSubmit?: (password: string) => void | Promise<void>
  signInHref?: string
  className?: string
}

const BAR = ["w-1/3", "w-2/3", "w-full"]

export function Reset3({ phone = "•••• ••• 0193", verifyCode, onSubmit, signInHref = "#", className }: Reset3Props) {
  const [step, setStep] = React.useState(0)
  const [code, setCode] = React.useState("")
  const [bad, setBad] = React.useState(false)
  const [password, setPassword] = React.useState("")

  const check = async (value: string) => {
    const ok = verifyCode ? await verifyCode(value) : value !== "000000"
    setBad(!ok)
    if (ok) setStep(1)
  }

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await onSubmit?.(password)
    setPassword("")
    setStep(2)
  }

  return (
    <div className={cn("grid min-h-[560px] place-items-center bg-surface-container-low px-4 py-10", className)}>
      <div className="w-full max-w-[420px] overflow-hidden rounded-xl bg-surface">
        <div className="h-1 bg-secondary-container" role="progressbar" aria-label="Reset progress" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step + 1} aria-valuetext={step < 2 ? `Step ${step + 1} of 2` : "Done"}>
          <div className={cn("h-full rounded-e-full bg-primary transition-[width] duration-500 ease-emphasized", BAR[step])} />
        </div>
        <div className="p-6 md:p-8">
          {step === 0 && (
            <div key="code" className="animate-pop">
              <h2 className="text-headline-sm font-medium">Enter your reset code</h2>
              <p className="mt-1 text-body-md text-on-surface-variant">We texted 6 digits to {phone}.</p>
              <InputOTP
                fullWidth className="mt-6"
                aria-label="6-digit code"
                groups={[6]}
                value={code}
                onChange={(v) => {
                  setCode(v)
                  if (v.length < 6) setBad(false)
                }}
                onComplete={check}
                isInvalid={bad}
                errorMessage="That code is incorrect or expired."
              />
              <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
                <Link className="cursor-pointer text-label-lg text-primary" onPress={() => snackbar(`New code sent to ${phone}`)}>
                  Send a new code
                </Link>
                <span className="text-body-sm text-on-surface-variant">Expires in 10 min</span>
              </div>
            </div>
          )}
          {step === 1 && (
            <div key="password" className="animate-pop">
              <h2 className="text-headline-sm font-medium">Set a new password</h2>
              <Form className="mt-6 space-y-4" onSubmit={save}>
                <TextField type="password" label="New password" autoComplete="new-password" value={password} onChange={setPassword} isRequired minLength={8} errorMessage="Use at least 8 characters" />
                <TextField
                  type="password"
                  label="Confirm password"
                  autoComplete="new-password"
                  isRequired
                  validate={(v) => (v !== password ? "Passwords don't match" : null)}
                  errorMessage={(v) => (v.validationDetails.valueMissing ? "Confirm your new password" : v.validationErrors.join(" "))}
                />
                <Button type="submit" className="h-12 w-full">
                  Update password
                </Button>
              </Form>
            </div>
          )}
          {step === 2 && (
            <div key="done" className="flex animate-pop flex-col items-center py-4 text-center">
              <div className="relative grid size-20 place-items-center">
                <div aria-hidden className="absolute inset-0 animate-[spin_40s_linear_infinite]">
                  <Shape cycle={["cookie12", "sunny", "cookie9"]} interval={2600} className="size-full text-primary-container" />
                </div>
                <Icon size={36} className="relative text-on-primary-container">
                  check
                </Icon>
              </div>
              <h2 className="mt-4 text-headline-sm font-medium">Password updated</h2>
              <p className="mt-1 text-body-md text-on-surface-variant">Use it the next time you sign in on any device.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Link href={signInHref} className="state-layer focus-ring inline-flex h-10 items-center rounded-full bg-primary px-5 text-label-lg text-on-primary">
                  Sign in
                </Link>
                <Button
                  variant="text"
                  onPress={() => {
                    setStep(0)
                    setCode("")
                  }}
                >
                  Start over
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
